import os
import json
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Активация карты и начисление бонуса 500₽
    Args: event с telegram_id пользователя
    Returns: HTTP response с новым балансом
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            telegram_id = body_data.get('telegram_id')
            
            if not telegram_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'telegram_id is required'})
                }
            
            dsn = os.environ.get('DATABASE_URL', '')
            
            conn = psycopg2.connect(dsn)
            cur = conn.cursor()
            
            cur.execute(
                "SELECT balance, card_activated FROM users WHERE telegram_id = %s",
                (telegram_id,)
            )
            result = cur.fetchone()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            current_balance, card_activated = result
            
            if card_activated:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Card already activated', 'balance': float(current_balance)})
                }
            
            new_balance = Decimal(str(current_balance)) + Decimal('500.00')
            
            cur.execute(
                "UPDATE users SET balance = %s, card_activated = TRUE, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = %s",
                (new_balance, telegram_id)
            )
            conn.commit()
            
            cur.close()
            conn.close()
            
            bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
            if bot_token:
                import urllib.request
                
                message_text = (
                    "🎉 *Поздравляем!*\n\n"
                    f"Ваша карта успешно активирована!\n"
                    f"💰 Бонус *500₽* зачислен на ваш баланс!\n\n"
                    f"Ваш новый баланс: *{float(new_balance)}₽*\n\n"
                    "Теперь вы можете:\n"
                    "• Вывести средства через СБП\n"
                    "• Пригласить друзей и получить ещё больше!\n\n"
                    "Откройте приложение, чтобы продолжить 👇"
                )
                
                send_data = {
                    'chat_id': telegram_id,
                    'text': message_text,
                    'parse_mode': 'Markdown',
                    'reply_markup': {
                        'inline_keyboard': [[
                            {
                                'text': '🚀 Открыть приложение',
                                'web_app': {'url': 'https://alpha-card-project--preview.poehali.dev/'}
                            }
                        ]]
                    }
                }
                
                send_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
                req_data = json.dumps(send_data).encode('utf-8')
                req = urllib.request.Request(
                    send_url,
                    data=req_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                try:
                    with urllib.request.urlopen(req) as response:
                        response.read()
                except Exception:
                    pass
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'balance': float(new_balance),
                    'bonus': 500
                })
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }