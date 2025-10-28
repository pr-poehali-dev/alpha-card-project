import os
import json
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Telegram bot webhook handler для Mini App
    Args: event - webhook update от Telegram
    Returns: HTTP response для Telegram
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        message = body_data.get('message', {})
        chat_id = message.get('chat', {}).get('id')
        text = message.get('text', '')
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
        web_app_url = 'https://alpha-card-project--preview.poehali.dev/'
        
        if text == '/start' and chat_id and bot_token:
            response_text = (
                "👋 Добро пожаловать в реферальную программу Альфа-Банка!\n\n"
                "🎁 Получите 1000₽ бонусом за оформление карты\n"
                "💰 Зарабатывайте 200₽ за каждого друга\n\n"
                "Нажмите кнопку ниже, чтобы начать! 👇"
            )
            
            import urllib.request
            
            keyboard = {
                'inline_keyboard': [[
                    {
                        'text': '🚀 Открыть приложение',
                        'web_app': {'url': web_app_url}
                    }
                ]]
            }
            
            send_data = {
                'chat_id': chat_id,
                'text': response_text,
                'reply_markup': keyboard
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
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'ok': True})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }