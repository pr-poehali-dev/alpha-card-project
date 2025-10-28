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
        callback_query = body_data.get('callback_query', {})
        
        chat_id = message.get('chat', {}).get('id') or callback_query.get('message', {}).get('chat', {}).get('id')
        text = message.get('text', '')
        callback_data = callback_query.get('data', '')
        
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
                'inline_keyboard': [
                    [{
                        'text': '🚀 Открыть приложение',
                        'web_app': {'url': web_app_url}
                    }],
                    [
                        {
                            'text': '💳 Оформить карту',
                            'web_app': {'url': f'{web_app_url}?page=card-order'}
                        },
                        {
                            'text': '💰 Баланс',
                            'web_app': {'url': web_app_url}
                        }
                    ],
                    [
                        {
                            'text': '👥 Пригласить друга',
                            'web_app': {'url': f'{web_app_url}?page=referral'}
                        },
                        {
                            'text': '💸 Вывести деньги',
                            'web_app': {'url': f'{web_app_url}?page=withdraw'}
                        }
                    ],
                    [{
                        'text': '❓ Помощь',
                        'web_app': {'url': f'{web_app_url}?page=support'}
                    }]
                ]
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
        
        if callback_data and chat_id and bot_token:
            import urllib.request
            
            response_texts = {
                'order_card': (
                    "💳 *Оформление карты Альфа-Банка*\n\n"
                    "🎁 Получите 1000₽ бонусом:\n"
                    "• 500₽ от нас\n"
                    "• 500₽ от Альфа-Банка\n\n"
                    "📝 Инструкция:\n"
                    "1. Перейдите по ссылке: https://alfa.me/ASQWHN\n"
                    "2. Оформите карту\n"
                    "3. Активируйте в приложении\n"
                    "4. Совершите покупку от 200₽\n"
                    "5. Пришлите чек в @Alfa_Bank778\n\n"
                    "✨ Бесплатное обслуживание и кэшбэк!"
                ),
                'balance': (
                    "💰 *Ваш баланс*\n\n"
                    "Текущий баланс: *0 ₽*\n\n"
                    "Чтобы пополнить баланс:\n"
                    "• Оформите карту Альфа-Банка (+500₽)\n"
                    "• Пригласите друзей (+200₽ за каждого)"
                ),
                'referral': (
                    "👥 *Реферальная программа*\n\n"
                    "💸 Зарабатывайте 200₽ за каждого друга!\n\n"
                    "Ваша реферальная ссылка:\n"
                    "`https://alfacard.promo/ref/ABC123`\n\n"
                    "Как это работает:\n"
                    "1. Отправьте ссылку другу\n"
                    "2. Друг регистрируется и оформляет карту\n"
                    "3. Вы оба получаете бонусы!\n\n"
                    "Приглашено друзей: *0*"
                ),
                'withdraw': (
                    "💸 *Вывод средств*\n\n"
                    "Доступно к выводу: *0 ₽*\n\n"
                    "Вывод осуществляется через СБП (Систему Быстрых Платежей) "
                    "на любой банк без комиссии.\n\n"
                    "Откройте приложение для оформления заявки на вывод."
                ),
                'help': (
                    "❓ *Помощь и поддержка*\n\n"
                    "📱 Telegram: @Alfa_Bank778\n"
                    "📧 Email: support@alfacard.promo\n\n"
                    "🕐 Время работы:\n"
                    "Ежедневно с 9:00 до 21:00 (МСК)\n\n"
                    "Мы всегда готовы помочь вам!"
                )
            }
            
            response_text = response_texts.get(callback_data, 'Неизвестная команда')
            
            send_data = {
                'chat_id': chat_id,
                'text': response_text,
                'parse_mode': 'Markdown'
            }
            
            if callback_data == 'order_card':
                send_data['reply_markup'] = {
                    'inline_keyboard': [[
                        {
                            'text': '🔗 Оформить карту',
                            'url': 'https://alfa.me/ASQWHN'
                        }
                    ]]
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
            
            if callback_query.get('id'):
                answer_url = f'https://api.telegram.org/bot{bot_token}/answerCallbackQuery'
                answer_data = json.dumps({'callback_query_id': callback_query['id']}).encode('utf-8')
                answer_req = urllib.request.Request(
                    answer_url,
                    data=answer_data,
                    headers={'Content-Type': 'application/json'}
                )
                try:
                    with urllib.request.urlopen(answer_req) as response:
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