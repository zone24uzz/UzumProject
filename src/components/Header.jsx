import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Search, Menu, MapPin, ChevronDown, User, Phone } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header({ categories }) {
  const { cartCount, wishlist } = useCart()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>

      {/* Top bar */}
      <div style={{ background: '#7B2FBE', color: '#fff', fontSize: 12, padding: '9px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', opacity: 0.9 }}>
            <MapPin size={12} />
            <span style={{ fontWeight: 600 }}>Ташкент</span>
            <ChevronDown size={11} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: 'rgba(255,255,255,0.85)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Phone size={11} />
              <span>+998 71 200-00-00</span>
            </div>
            <span>Доставка по всему Узбекистану</span>
            <span style={{ cursor: 'pointer' }}>Помощь</span>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="header-main">

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, background: '#7B2FBE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>U</span>
          </div>
          <span style={{ color: '#7B2FBE', fontWeight: 900, fontSize: 24, letterSpacing: '-0.5px' }}>uzum</span>
        </Link>

        {/* Catalog btn */}
        <Link
          to="/search?trending=true"
          className="header-catalog-btn"
          style={{
            alignItems: 'center', gap: 8,
            background: '#7B2FBE', color: '#fff',
            padding: '10px 20px', borderRadius: 12,
            fontWeight: 600, fontSize: 14, textDecoration: 'none',
            flexShrink: 0, transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#5a1f8a'}
          onMouseLeave={e => e.currentTarget.style.background = '#7B2FBE'}
        >
          <Menu size={16} />
          Каталог
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1 }}>
          <div style={{ display: 'flex', border: '2px solid #7B2FBE', borderRadius: 12, overflow: 'hidden' }}>
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Поиск по товарам, брендам..."
              style={{
                flex: 1, padding: '10px 16px', fontSize: 14,
                border: 'none', outline: 'none', background: '#fff', color: '#333'
              }}
            />
            <button
              type="submit"
              style={{ background: '#7B2FBE', color: '#fff', padding: '0 20px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#5a1f8a'}
              onMouseLeave={e => e.currentTarget.style.background = '#7B2FBE'}
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {[
            { to: '/wishlist', icon: <Heart size={24} />, label: 'Избранное', badge: wishlist.length, badgeColor: '#ef4444' },
            { to: '/cart', icon: <ShoppingCart size={24} />, label: 'Корзина', badge: cartCount, badgeColor: '#7B2FBE' },
            { to: '/profile', icon: <User size={24} />, label: 'Войти', badge: 0, badgeColor: '' },
          ].map(({ to, icon, label, badge, badgeColor }) => (
            <Link
              key={to}
              to={to}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: '#555', textDecoration: 'none', position: 'relative', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7B2FBE'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}
            >
              <div style={{ position: 'relative' }}>
                {icon}
                {badge > 0 && (
                  <span style={{
                    position: 'absolute', top: -6, right: -6,
                    background: badgeColor, color: '#fff',
                    fontSize: 10, fontWeight: 700,
                    borderRadius: '50%', width: 18, height: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{badge}</span>
                )}
              </div>
              <span className="header-action-label">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Category nav */}
      <div style={{ borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 24px', display: 'flex', gap: 4, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              style={{
                flexShrink: 0, padding: '6px 16px',
                fontSize: 13, fontWeight: 500, color: '#555',
                borderRadius: 20, textDecoration: 'none',
                whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EDE9FE'; e.currentTarget.style.color = '#7B2FBE' }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#555' }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
