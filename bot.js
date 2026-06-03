/**
 * Uzum Market — Telegram Bot (Node.js, long polling)
 * Запуск: node bot.js
 *
 * Команды:
 *   /start   — приветствие
 *   /profile — профиль пользователя
 *   /orders  — последние заказы
 *   /help    — список команд
 */

import TelegramBot from 'node-telegram-bot-api'

const TOKEN      = process.env.TELEGRAM_BOT_TOKEN || '8878216849:AAHmxmAdWdR_FkheZuWJMTl8tHbObL_yESw'
const ADMIN_ID   = process.env.TELEGRAM_ADMIN_CHAT_ID || '8357557157'

// Long polling — бот сам опрашивает Telegram сервер
const bot = new TelegramBot(TOKEN, { polling: true })

console.log('🤖 Uzum Market Bot запущен...')

// ─── /start ─────────────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || 'Покупатель'
  const chatId = msg.chat.id

  bot.sendMessage(chatId,
    `👋 Привет, <b>${name}</b>!\n\n` +
    `Добро пожаловать в <b>Uzum Market</b> — крупнейший маркетплейс Узбекистана.\n\n` +
    `📦 Здесь ты можешь:\n` +
    `• Следить за статусом заказов\n` +
    `• Получать уведомления о доставке\n` +
    `• Управлять своим профилем\n\n` +
    `Выбери действие:`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [
          [{ text: '📦 Мои заказы' }, { text: '👤 Профиль' }],
          [{ text: '🔔 Уведомления' }, { text: '❓ Помощь' }],
        ],
        resize_keyboard: true,
      },
    }
  )
})

// ─── /profile ───────────────────────────────────────────────────────────────
bot.onText(/\/profile|👤 Профиль/, (msg) => {
  const { first_name, last_name, username, id } = msg.from
  bot.sendMessage(msg.chat.id,
    `👤 <b>Ваш профиль</b>\n\n` +
    `🙍 Имя: ${first_name}${last_name ? ' ' + last_name : ''}\n` +
    `📛 Username: ${username ? '@' + username : '—'}\n` +
    `🆔 Telegram ID: <code>${id}</code>\n\n` +
    `💡 Чтобы привязать Telegram к аккаунту на сайте:\n` +
    `1. Зайди в <b>Профиль → Telegram</b> на сайте\n` +
    `2. Нажми «Получить код»\n` +
    `3. Отправь код сюда командой /link КОД`,
    { parse_mode: 'HTML' }
  )
})

// ─── /orders ─────────────────────────────────────────────────────────────────
bot.onText(/\/orders|📦 Мои заказы/, (msg) => {
  // В реальном проекте здесь запрос к БД по telegram_id
  bot.sendMessage(msg.chat.id,
    `📦 <b>Мои заказы</b>\n\n` +
    `Чтобы видеть свои заказы здесь, привяжи Telegram к аккаунту на сайте.\n\n` +
    `👉 Профиль → вкладка Telegram → Получить код\n` +
    `Затем отправь: /link ВАШ_КОД`,
    { parse_mode: 'HTML' }
  )
})

// ─── /help ───────────────────────────────────────────────────────────────────
bot.onText(/\/help|❓ Помощь/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `❓ <b>Помощь</b>\n\n` +
    `<b>Доступные команды:</b>\n\n` +
    `/start — Главное меню\n` +
    `/profile — Ваш профиль\n` +
    `/orders — История заказов\n` +
    `/link КОД — Привязать аккаунт\n` +
    `/notify on|off — Включить/выключить уведомления\n` +
    `/help — Этот список\n\n` +
    `📞 <b>Поддержка:</b> +998 71 200-00-00\n` +
    `📧 support@uzum.uz`,
    { parse_mode: 'HTML' }
  )
})

// ─── /link КОД ───────────────────────────────────────────────────────────────
bot.onText(/\/link (.+)/, (msg, match) => {
  const code    = match[1].trim().toUpperCase()
  const telegramId = msg.from.id

  // Проверяем формат кода UZUM-XXXXXX
  if (!code.startsWith('UZUM-')) {
    bot.sendMessage(msg.chat.id,
      `❌ Неверный код. Код должен начинаться с <b>UZUM-</b>\n\n` +
      `Получи код на сайте: Профиль → Telegram → Получить код`,
      { parse_mode: 'HTML' }
    )
    return
  }

  // В реальном проекте — сохранить telegram_id в БД по коду
  // Здесь просто подтверждаем
  bot.sendMessage(msg.chat.id,
    `✅ <b>Аккаунт успешно привязан!</b>\n\n` +
    `🆔 Ваш Telegram ID: <code>${telegramId}</code>\n\n` +
    `Теперь вы будете получать уведомления о:\n` +
    `✅ Оформлении заказа\n` +
    `📦 Сборке заказа\n` +
    `🚚 Передаче курьеру\n` +
    `📍 Прибытии в пункт выдачи\n` +
    `🎉 Доставке заказа`,
    { parse_mode: 'HTML' }
  )
  console.log(`[Bot] Linked: code=${code} telegramId=${telegramId}`)
})

// ─── /notify on|off ──────────────────────────────────────────────────────────
bot.onText(/\/notify (on|off)|🔔 Уведомления/, (msg, match) => {
  const action = match?.[1]
  if (!action) {
    bot.sendMessage(msg.chat.id,
      `🔔 <b>Управление уведомлениями</b>\n\n` +
      `Включить:  /notify on\n` +
      `Выключить: /notify off`,
      { parse_mode: 'HTML' }
    )
    return
  }
  const on = action === 'on'
  bot.sendMessage(msg.chat.id,
    on
      ? `🔔 Уведомления <b>включены</b>. Вы будете получать все обновления по заказам.`
      : `🔕 Уведомления <b>выключены</b>. Вы не будете получать сообщения от бота.`,
    { parse_mode: 'HTML' }
  )
})

// ─── Неизвестное сообщение ────────────────────────────────────────────────────
bot.on('message', (msg) => {
  const text = msg.text || ''
  // Пропускаем команды и кнопки клавиатуры — они уже обработаны выше
  const handled = ['/start', '/profile', '/orders', '/help', '/notify', '/link',
    '📦 Мои заказы', '👤 Профиль', '🔔 Уведомления', '❓ Помощь']
  if (handled.some(h => text.startsWith(h))) return

  bot.sendMessage(msg.chat.id,
    `🤔 Не понимаю эту команду.\n\nНапиши /help чтобы увидеть список команд.`
  )
})

// ─── Уведомление администратору о запуске ────────────────────────────────────
bot.sendMessage(ADMIN_ID,
  `🚀 <b>Uzum Market Bot запущен</b>\n🕐 ${new Date().toLocaleString('ru-RU')}`,
  { parse_mode: 'HTML' }
).catch(() => {}) // тихо, если admin_id не задан

// ─── Обработка ошибок polling ─────────────────────────────────────────────────
bot.on('polling_error', (err) => {
  console.error('[Bot] Polling error:', err.message)
})
