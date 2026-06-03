/**
 * Telegram Bot Service
 * Токен читается из .env (VITE_TELEGRAM_BOT_TOKEN)
 * Fallback значения используются если .env ещё не подхватился (нужен перезапуск сервера)
 */

const BOT_TOKEN     = import.meta.env.VITE_TELEGRAM_BOT_TOKEN     || '8878216849:AAHmxmAdWdR_FkheZuWJMTl8tHbObL_yESw'
const ADMIN_CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID || '8357557157'
const API_BASE      = `https://api.telegram.org/bot${BOT_TOKEN}`

/**
 * Проверить что бот жив — вызывает getMe
 * Вернёт объект бота или null
 */
export async function checkBot() {
  try {
    const res  = await fetch(`${API_BASE}/getMe`)
    const data = await res.json()
    if (data.ok) {
      console.log('[TelegramBot] ✅ Bot is alive:', data.result.username)
    } else {
      console.warn('[TelegramBot] ❌ getMe failed:', data.description)
    }
    return data
  } catch (err) {
    console.warn('[TelegramBot] ❌ Network error:', err.message)
    return null
  }
}

/**
 * Отправить тестовое сообщение администратору
 */
export async function sendTestMessage() {
  return sendMessage(ADMIN_CHAT_ID, `🤖 <b>Тест Uzum Market Bot</b>\n\nБот работает! ✅\n🕐 ${new Date().toLocaleString('ru-RU')}`)
}

// Статусы заказа с эмодзи
export const ORDER_STATUSES = {
  placed:    { label: 'Заказ принят',               emoji: '✅' },
  preparing: { label: 'Заказ собирается',            emoji: '📦' },
  shipped:   { label: 'Передан курьеру',             emoji: '🚚' },
  arrived:   { label: 'Прибыл в пункт выдачи',      emoji: '📍' },
  delivered: { label: 'Заказ доставлен',             emoji: '🎉' },
  cancelled: { label: 'Заказ отменён',               emoji: '❌' },
}

/**
 * Базовая функция отправки сообщения
 * @param {string|number} chatId  — Telegram chat_id получателя
 * @param {string} text           — текст сообщения (поддерживает HTML)
 */
async function sendMessage(chatId, text) {
  if (!BOT_TOKEN || !chatId) return

  try {
    const res = await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })
    const data = await res.json()
    if (!data.ok) console.warn('Telegram API error:', data.description)
    return data
  } catch (err) {
    console.warn('Telegram send error:', err)
  }
}

// ─── Клиентские уведомления ─────────────────────────────────────────────────

/**
 * Уведомление о новом заказе (клиенту)
 */
export async function notifyOrderPlaced(chatId, order) {
  if (!chatId) return
  const itemsList = order.items
    .map(i => `  • ${i.title} × ${i.qty}`)
    .join('\n')

  const msg = `
✅ <b>Заказ оформлен!</b>

🛍 <b>Заказ №${order.id}</b>
📦 Товары:
${itemsList}

💰 Сумма: <b>${fmtPrice(order.total)}</b>
📍 Пункт выдачи: ${order.pickup?.name || '—'}

Мы уже обрабатываем ваш заказ. Следите за статусом здесь!
`.trim()

  return sendMessage(chatId, msg)
}

/**
 * Уведомление об изменении статуса заказа (клиенту)
 */
export async function notifyOrderStatus(chatId, order, statusKey) {
  if (!chatId) return
  const status = ORDER_STATUSES[statusKey]
  if (!status) return

  const msg = `
${status.emoji} <b>${status.label}</b>

🛍 Заказ №${order.id}
💰 Сумма: ${fmtPrice(order.total)}

${getStatusDetail(statusKey)}
`.trim()

  return sendMessage(chatId, msg)
}

function getStatusDetail(key) {
  const details = {
    placed:    'Ваш заказ принят в обработку.',
    preparing: 'Мы уже собираем ваш заказ на складе.',
    shipped:   'Курьер забрал ваш заказ и направляется в пункт выдачи.',
    arrived:   'Ваш заказ ждёт вас в пункте выдачи. Возьмите с собой паспорт или код заказа.',
    delivered: 'Спасибо за покупку! Будем рады видеть вас снова 🙌',
    cancelled: 'Если у вас есть вопросы — напишите нам.',
  }
  return details[key] || ''
}

// ─── Админ-уведомления ───────────────────────────────────────────────────────

/**
 * Уведомление администратору о новом заказе
 */
export async function notifyAdminNewOrder(order) {
  if (!ADMIN_CHAT_ID) return
  const itemsList = order.items
    .map(i => `  • ${i.title} × ${i.qty} = ${fmtPrice((i.discountPrice || i.price) * i.qty)}`)
    .join('\n')

  const msg = `
🛒 <b>Новый заказ №${order.id}</b>

👤 Покупатель: ${order.userName || 'Гость'}
📱 Телефон: ${order.phone || '—'}
📍 Пункт выдачи: ${order.pickup?.name || '—'}

📦 Товары:
${itemsList}

💰 <b>Итого: ${fmtPrice(order.total)}</b>
🕐 ${new Date().toLocaleString('ru-RU')}
`.trim()

  return sendMessage(ADMIN_CHAT_ID, msg)
}

/**
 * Уведомление администратору о новом пользователе
 */
export async function notifyAdminNewUser(user) {
  if (!ADMIN_CHAT_ID) return
  const msg = `
👤 <b>Новый пользователь</b>

🙍 Имя: ${user.name}
📧 Email: ${user.email}
🕐 ${new Date().toLocaleString('ru-RU')}
`.trim()

  return sendMessage(ADMIN_CHAT_ID, msg)
}

/**
 * Массовая рассылка (broadcast) — для администратора
 * @param {string[]} chatIds — список chat_id пользователей
 * @param {string}   text    — текст сообщения
 */
export async function broadcastMessage(chatIds, text) {
  const results = await Promise.allSettled(
    chatIds.map(id => sendMessage(id, text))
  )
  return results
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtPrice(p) {
  return new Intl.NumberFormat('ru-UZ').format(p) + ' сум'
}
