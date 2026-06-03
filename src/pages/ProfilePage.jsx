/**
 * ProfilePage — Личный кабинет
 * Показывает профиль, историю заказов, избранное
 * и управление Telegram-уведомлениями
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Package, Heart, Settings, LogOut, ChevronRight,
  ArrowLeft, Bell, BellOff, Send, Copy, Check, Edit2, Save, X
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ORDER_STATUSES, checkBot, sendTestMessage } from '../services/telegramBot'

const fmt = (p) => new Intl.NumberFormat('ru-UZ').format(p) + ' сум'

export default function ProfilePage() {
  const { cartCount } = useCart()
  const { user, logout, openAuth, linkTelegram, toggleTgNotifications, updateProfile } = useAuth()
  const [tab, setTab] = useState('orders') // 'orders' | 'settings' | 'telegram'
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [tgCode, setTgCode]    = useState(null) // уникальный код привязки
  const [codeCopied, setCodeCopied] = useState(false)
  const [botStatus, setBotStatus] = useState(null) // null | 'checking' | 'ok' | 'error'
  const [testSent, setTestSent]   = useState(false)

  // Не залогинен — предлагаем войти
  if (!user) return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>Профиль</span>
      </div>
      <div style={{ maxWidth: 400, margin: '60px auto 0', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <User size={36} color="#7B2FBE" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Войдите в аккаунт</h2>
        <p style={{ color: '#888', marginBottom: 28, fontSize: 14 }}>Чтобы видеть заказы, избранное и управлять профилем</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => openAuth('login')}
            style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: '#7B2FBE', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Войти
          </button>
          <button onClick={() => openAuth('register')}
            style={{ padding: '12px 28px', borderRadius: 12, border: '2px solid #7B2FBE', background: 'transparent', color: '#7B2FBE', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Регистрация
          </button>
        </div>
      </div>
    </div>
  )

  const orders   = user.orders || []
  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const startEdit = () => {
    setEditForm({ name: user.name, email: user.email })
    setEditing(true)
  }

  const saveEdit = () => {
    updateProfile(editForm)
    setEditing(false)
  }

  // Генерация уникального кода привязки Telegram
  const generateTgCode = () => {
    const code = `UZUM-${user.id.slice(-6).toUpperCase()}`
    setTgCode(code)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(tgCode).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  // Симуляция привязки по коду (в реальности — вебхук от бота)
  const simulateLinkTelegram = () => {
    const fakeId = `tg_${user.id}`
    linkTelegram(fakeId)
  }

  const handleCheckBot = async () => {
    setBotStatus('checking')
    const res = await checkBot()
    setBotStatus(res?.ok ? 'ok' : 'error')
  }

  const handleTestMessage = async () => {
    setTestSent(false)
    await sendTestMessage()
    setTestSent(true)
    setTimeout(() => setTestSent(false), 4000)
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>Профиль</span>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Карточка пользователя ── */}
        <div style={{
          background: 'linear-gradient(135deg, #7B2FBE 0%, #9b4fd4 100%)',
          borderRadius: 24, padding: '28px 28px 0', overflow: 'hidden', position: 'relative',
          boxShadow: '0 8px 32px rgba(123,47,190,0.3)',
        }}>
          {/* Декор-орбы */}
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 80, bottom: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Аватар с инициалами */}
              <div style={{ width: 68, height: 68, background: 'rgba(255,255,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#fff', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                {initials}
              </div>
              <div>
                {editing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '5px 10px', color: '#fff', fontSize: 14, outline: 'none' }} />
                    <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '5px 10px', color: '#fff', fontSize: 13, outline: 'none' }} />
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{user.name}</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{user.email}</p>
                  </>
                )}
              </div>
            </div>

            {/* Кнопки редактирования */}
            <div style={{ display: 'flex', gap: 8 }}>
              {editing ? (
                <>
                  <button onClick={saveEdit} style={headerBtn('#10b981')}><Save size={15} /></button>
                  <button onClick={() => setEditing(false)} style={headerBtn('rgba(255,255,255,0.2)')}><X size={15} /></button>
                </>
              ) : (
                <button onClick={startEdit} style={headerBtn('rgba(255,255,255,0.15)')}><Edit2 size={15} /></button>
              )}
            </div>
          </div>

          {/* Статистика */}
          <div style={{ display: 'flex', gap: 0, marginTop: 24, marginBottom: 0, position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Заказов', value: orders.length },
              { label: 'В корзине', value: cartCount },
              { label: 'Бонусов', value: '0' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '14px 0', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Вкладки ── */}
        <div style={{ display: 'flex', background: '#fff', borderRadius: 16, padding: 4, gap: 4, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          {[
            { key: 'orders', label: 'Заказы', icon: <Package size={15} /> },
            { key: 'telegram', label: 'Telegram', icon: <Send size={15} /> },
            { key: 'settings', label: 'Настройки', icon: <Settings size={15} /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: tab === t.key ? 'linear-gradient(135deg, #7B2FBE, #9b4fd4)' : 'transparent',
                color: tab === t.key ? '#fff' : '#888',
                transition: 'all 0.2s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Вкладка: Заказы ── */}
        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <Package size={48} color="#ddd" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#aaa', fontSize: 14 }}>Заказов пока нет</p>
                <Link to="/" style={{ display: 'inline-block', marginTop: 16, color: '#7B2FBE', fontWeight: 600, fontSize: 14 }}>Перейти к покупкам →</Link>
              </div>
            ) : orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* ── Вкладка: Telegram ── */}
        {tab === 'telegram' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Статус привязки */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: '#E8F4FD', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={22} color="#0088cc" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Telegram-уведомления</h3>
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                    {user.telegramId ? '✅ Аккаунт привязан' : '⚠️ Аккаунт не привязан'}
                  </p>
                </div>
                {user.telegramId && (
                  <div style={{ marginLeft: 'auto' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <span style={{ fontSize: 13, color: '#555' }}>{user.tgNotifications ? 'Вкл' : 'Выкл'}</span>
                      <div
                        onClick={() => toggleTgNotifications(!user.tgNotifications)}
                        style={{
                          width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                          background: user.tgNotifications ? '#7B2FBE' : '#e5e5e5',
                          position: 'relative', transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: 2,
                          left: user.tgNotifications ? 22 : 2,
                          width: 20, height: 20, borderRadius: '50%',
                          background: '#fff', transition: 'left 0.2s',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }} />
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Типы уведомлений */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Вы будете получать уведомления:</p>
                {Object.values(ORDER_STATUSES).map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555' }}>
                    <span>{s.emoji}</span> {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Привязка по коду */}
            {!user.telegramId && (
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Как привязать Telegram?</h4>
                <ol style={{ paddingLeft: 18, fontSize: 13, color: '#666', lineHeight: 2, marginBottom: 16 }}>
                  <li>Откройте бота <a href="https://t.me/uzum_shop_bot" target="_blank" rel="noopener noreferrer" style={{ color: '#7B2FBE', fontWeight: 600 }}>@uzum_shop_bot</a> в Telegram</li>
                  <li>Нажмите /start</li>
                  <li>Отправьте боту ваш уникальный код</li>
                </ol>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={generateTgCode}
                    style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: '#7B2FBE', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Получить код
                  </button>
                </div>
                {tgCode && (
                  <div style={{ marginTop: 14, background: '#f8f5ff', borderRadius: 14, padding: '14px 16px' }}>
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Ваш код привязки:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <code style={{ flex: 1, fontSize: 18, fontWeight: 900, color: '#7B2FBE', letterSpacing: 2 }}>{tgCode}</code>
                      <button onClick={copyCode} style={{ background: codeCopied ? '#10b981' : '#7B2FBE', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, transition: 'background 0.2s' }}>
                        {codeCopied ? <Check size={13} /> : <Copy size={13} />}
                        {codeCopied ? 'Скопировано' : 'Скопировать'}
                      </button>
                    </div>
                    {/* Симуляция привязки */}
                    <button onClick={simulateLinkTelegram}
                      style={{ marginTop: 12, width: '100%', padding: '8px 0', borderRadius: 10, border: '2px dashed #7B2FBE', background: 'transparent', color: '#7B2FBE', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                      🔗 Симулировать привязку (для демо)
                    </button>
                  </div>
                )}
              </div>
            )}

            {user.telegramId && (
              <div style={{ background: '#ECFDF5', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #A7F3D0' }}>
                <Check size={16} color="#059669" />
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>Telegram привязан. Уведомления о заказах будут приходить автоматически.</span>
              </div>
            )}

            {/* ── Блок диагностики бота ── */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#333' }}>🔧 Диагностика бота</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={handleCheckBot}
                  disabled={botStatus === 'checking'}
                  style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: '#EDE9FE', color: '#7B2FBE', fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: botStatus === 'checking' ? 0.6 : 1 }}>
                  {botStatus === 'checking' ? '⏳ Проверяю...' : '🤖 Проверить бота'}
                </button>
                <button onClick={handleTestMessage}
                  style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: testSent ? '#ECFDF5' : '#E8F4FD', color: testSent ? '#059669' : '#0088cc', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {testSent ? '✅ Отправлено!' : '📨 Тест-сообщение мне'}
                </button>
              </div>
              {botStatus === 'ok' && (
                <p style={{ marginTop: 10, fontSize: 13, color: '#059669', fontWeight: 600 }}>✅ Бот активен и отвечает</p>
              )}
              {botStatus === 'error' && (
                <p style={{ marginTop: 10, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>❌ Бот не отвечает — перезапусти dev-сервер (npm run dev)</p>
              )}
            </div>
          </div>
        )}

        {/* ── Вкладка: Настройки ── */}
        {tab === 'settings' && (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            {[
              { icon: Heart, label: 'Избранное', desc: 'Сохранённые товары', to: '/wishlist', color: '#FEE2E2', iconColor: '#DC2626' },
              { icon: Package, label: 'Мои заказы', desc: 'История покупок', onClick: () => setTab('orders'), color: '#EDE9FE', iconColor: '#7B2FBE' },
              { icon: Send, label: 'Telegram', desc: 'Уведомления о заказах', onClick: () => setTab('telegram'), color: '#E8F4FD', iconColor: '#0088cc' },
            ].map(({ icon: Icon, label, desc, to, onClick, color, iconColor }, i, arr) => (
              <div
                key={label}
                onClick={onClick}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                {to ? (
                  <Link to={to} style={{ display: 'contents', textDecoration: 'none' }}>
                    <SettingsRow Icon={Icon} label={label} desc={desc} color={color} iconColor={iconColor} />
                  </Link>
                ) : (
                  <SettingsRow Icon={Icon} label={label} desc={desc} color={color} iconColor={iconColor} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Выход */}
        <button
          onClick={logout}
          style={{ width: '100%', background: '#fff', border: 'none', borderRadius: 16, padding: '14px 0', color: '#ef4444', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <LogOut size={16} /> Выйти из аккаунта
        </button>
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const status = ORDER_STATUSES[order.status] || ORDER_STATUSES.placed
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Заказ #{order.id}</span>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#f8f5ff', color: '#7B2FBE' }}>
          {status.emoji} {status.label}
        </span>
      </div>
      {order.items?.slice(0, 2).map(item => (
        <p key={item.id} className="line-clamp-2" style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>
          {item.title} × {item.qty}
        </p>
      ))}
      {order.items?.length > 2 && (
        <p style={{ fontSize: 12, color: '#aaa' }}>+ещё {order.items.length - 2} товара</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
        <span style={{ fontSize: 12, color: '#aaa' }}>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#7B2FBE' }}>
          {new Intl.NumberFormat('ru-UZ').format(order.total)} сум
        </span>
      </div>
    </div>
  )
}

function SettingsRow({ Icon, label, desc, color, iconColor }) {
  return (
    <>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{label}</p>
        <p style={{ fontSize: 12, color: '#aaa', marginTop: 1 }}>{desc}</p>
      </div>
      <ChevronRight size={16} color="#ccc" />
    </>
  )
}

const headerBtn = (bg) => ({
  background: bg, border: 'none', borderRadius: 10, width: 34, height: 34,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#fff', transition: 'opacity 0.2s',
})
