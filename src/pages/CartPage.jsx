import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock } from 'lucide-react'
import { BsCheckCircleFill } from 'react-icons/bs'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import CheckoutModal from '../components/CheckoutModal'

const fmt = (p) => new Intl.NumberFormat('ru-UZ').format(p) + ' сум'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart()
  const { user, openAuth, addOrder } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [ordered, setOrdered]     = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  const handleSuccess = (order) => {
    setLastOrder(order)
    setShowModal(false)
    setOrdered(true)
    // Сохранить заказ в профиль пользователя
    if (user) addOrder(order)
  }

  if (ordered) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, animation: 'float3d 3s ease-in-out infinite' }}>
        <BsCheckCircleFill size={72} color="#10b981" />
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Заказ оформлен!</h2>
      <p style={{ color: '#888', marginBottom: 8 }}>Спасибо за покупку. Мы свяжемся с вами в ближайшее время.</p>
      {lastOrder?.id && (
        <p style={{ color: '#7B2FBE', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>
          Номер заказа: #{lastOrder.id}
        </p>
      )}
      {user?.telegramId && user?.tgNotifications && (
        <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
          📱 Уведомления о статусе заказа придут в Telegram
        </p>
      )}
      <Link to="/" style={{ background: '#7B2FBE', color: '#fff', padding: '12px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
        На главную
      </Link>
    </div>
  )

  if (cartItems.length === 0) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <ShoppingBag size={72} color="#ddd" style={{ margin: '0 auto 16px' }} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#555', marginBottom: 8 }}>Корзина пуста</h2>
      <p style={{ color: '#aaa', marginBottom: 24 }}>Добавьте товары, чтобы оформить заказ</p>
      <Link to="/" style={{ background: '#7B2FBE', color: '#fff', padding: '12px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
        Перейти к покупкам
      </Link>
    </div>
  )

  const delivery = cartTotal >= 500000 ? 0 : 25000
  const total = cartTotal + delivery

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>Корзина</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Корзина ({cartItems.length})</h1>

      <div className="cart-layout">
        {/* Список товаров */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ background: '#fff', borderRadius: 16, padding: 16, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(123,47,190,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
            >
              <Link to={`/product/${item.id}`} style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: '#f5f5f5', display: 'block' }}>
                <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                  <p className="line-clamp-2" style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{item.title}</p>
                </Link>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{item.brand}</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#7B2FBE', marginTop: 6 }}>{fmt(item.discountPrice || item.price)}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                >
                  <Trash2 size={16} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e5e5e5', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Итого */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', position: 'sticky', top: 100, alignSelf: 'start' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Итого</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#555' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Товары ({cartItems.reduce((s, i) => s + i.qty, 0)} шт.)</span>
              <span>{fmt(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Доставка</span>
              <span style={{ color: delivery === 0 ? '#10b981' : '#333', fontWeight: delivery === 0 ? 600 : 400 }}>
                {delivery === 0 ? 'Бесплатно' : fmt(delivery)}
              </span>
            </div>
            {delivery > 0 && <p style={{ fontSize: 12, color: '#aaa' }}>Бесплатная доставка от 500 000 сум</p>}
          </div>
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '16px 0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
            <span>К оплате</span>
            <span style={{ color: '#7B2FBE' }}>{fmt(total)}</span>
          </div>

          {/* Кнопка — если не залогинен, предложить войти */}
          {!user ? (
            <div>
              <button
                onClick={() => openAuth('login')}
                style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: '#7B2FBE', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Lock size={16} /> Войти для оформления
              </button>
              <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 8 }}>
                Войдите, чтобы отслеживать заказы и получать уведомления
              </p>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: '#7B2FBE', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#5a1f8a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#7B2FBE'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Оформить заказ
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <CheckoutModal
          total={total}
          items={cartItems}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          onClearCart={clearCart}
        />
      )}
    </div>
  )
}
