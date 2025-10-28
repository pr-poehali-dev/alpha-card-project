import os
import json
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение баланса пользователя или создание нового
    Args: event с telegram_id, username, first_name
    Returns: HTTP response с балансом и данными пользователя
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        try:
            params = event.get('queryStringParameters', {}) or {}
            telegram_id = params.get('telegram_id')
            username = params.get('username', '')
            first_name = params.get('first_name', 'Гость')
            
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
                "SELECT id, balance, card_ordered, card_activated, referral_code, first_name FROM users WHERE telegram_id = %s",
                (telegram_id,)
            )
            result = cur.fetchone()
            
            if result:
                user_id, balance, card_ordered, card_activated, referral_code, db_first_name = result
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'telegram_id': int(telegram_id),
                        'balance': float(balance),
                        'card_ordered': card_ordered,
                        'card_activated': card_activated,
                        'referral_code': referral_code,
                        'first_name': db_first_name or first_name
                    })
                }
            
            import random
            import string
            referral_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            cur.execute(
                "INSERT INTO users (telegram_id, username, first_name, referral_code) VALUES (%s, %s, %s, %s) RETURNING id, balance",
                (telegram_id, username, first_name, referral_code)
            )
            user_id, balance = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'telegram_id': int(telegram_id),
                    'balance': float(balance),
                    'card_ordered': False,
                    'card_activated': False,
                    'referral_code': referral_code,
                    'first_name': first_name
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
