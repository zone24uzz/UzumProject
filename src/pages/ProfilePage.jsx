import { Link } from 'react-router-dom'
import { User, Package, Heart, Settings, LogOut, ChevronRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProfilePage() {
  const { cartCount } = useCart()

  const menuItems = [
    { icon: Package, label: 'Мои заказы', desc: 'История покупок', to: '#', color: '#EDE9FE', iconColor: '#7B2FBE' },
    { icon: Heart, label: 'Избранное', desc: 'Сохранённые товары', to: '/wishlist', color: '#FEE2E2', iconColor: '#DC2626' },
    { icon: Settings, label: 'Настройки', desc: 'Профиль и безопасность', to: '#', color: '#DBEAFE', iconColor: '#2563EB' },
  ]

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>Профиль</span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Avatar card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #7B2FBE, #9b4fd4)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={28} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>Покупатель</h2>
            <p style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>customer@example.com</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[{ label: 'Заказов', value: '0' }, { label: 'В корзине', value: cartCount }, { label: 'Бонусов', value: '0' }].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 12px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#7B2FBE' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          {menuItems.map(({ icon: Icon, label, desc, to, color, iconColor }, i) => (
            <Link
              key={label}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                textDecoration: 'none', borderBottom: i < menuItems.length - 1 ? '1px solid #f5f5f5' : 'none',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>{label}</p>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 1 }}>{desc}</p>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </Link>
          ))}
        </div>

        <button style={{
          width: '100%', background: '#fff', border: 'none', borderRadius: 16,
          padding: '14px 0', color: '#ef4444', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 1px 6px rgba(0,0,0,0.06)', transition: 'background 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </div>
  )
}
