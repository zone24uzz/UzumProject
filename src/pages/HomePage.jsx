import { Link } from 'react-router-dom'
import { Cpu, Shirt, Footprints, Home, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { BsGift } from 'react-icons/bs'
import Banner from '../components/Banner'
import ProductCard from '../components/ProductCard'

const iconMap = { Cpu, Shirt, Footprints, Home }
const catColors = [
  { bg: '#EDE9FE', color: '#7B2FBE' },
  { bg: '#FEE2E2', color: '#DC2626' },
  { bg: '#DBEAFE', color: '#2563EB' },
  { bg: '#D1FAE5', color: '#059669' },
]

const SectionHeader = ({ icon, title, link }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>{title}</h2>
    </div>
    {link && (
      <Link
        to={link}
        style={{
          fontSize: 13, fontWeight: 600, color: '#7B2FBE',
          background: '#EDE9FE', padding: '6px 16px', borderRadius: 20,
          textDecoration: 'none', transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#DDD6FE'}
        onMouseLeave={e => e.currentTarget.style.background = '#EDE9FE'}
      >
        Все →
      </Link>
    )}
  </div>
)

const Grid = ({ children }) => (
  <div className="grid-products">{children}</div>
)

export default function HomePage({ products, categories }) {
  const trending = products.filter(p => p.isTrending)
  const newProducts = products.filter(p => p.isNew)

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* Banner */}
      <Banner />

      {/* Categories */}
      <section>
        <SectionHeader title="Категории" />
        <div className="grid-categories">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Home
            const c = catColors[i % catColors.length]
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                style={{
                  background: '#fff', borderRadius: 16, padding: '28px 16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                  textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(123,47,190,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 18, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={28} color={c.color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#333', textAlign: 'center' }}>{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Trending */}
      <section>
        <SectionHeader
          icon={<Flame size={22} color="#f97316" />}
          title="Популярное"
          link="/search?trending=true"
        />
        <Grid>{trending.map(p => <ProductCard key={p.id} product={p} />)}</Grid>
      </section>

      {/* Promo */}
      <div className="promo-block" style={{
        background: 'linear-gradient(135deg, #7B2FBE 0%, #9b4fd4 100%)',
        borderRadius: 20, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20, marginBottom: 12, letterSpacing: '0.5px' }}>
            СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ
          </span>
          <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 36, marginBottom: 8 }}>Скидка 15%</h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 20 }}>
            На первый заказ с промокодом{' '}
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 6, fontWeight: 700, color: '#fff' }}>UZUM15</span>
          </p>
          <button
            className="btn-purple"
            style={{ background: '#fff', color: '#7B2FBE', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Получить скидку
          </button>
        </div>
        <div className="promo-gift" style={{ color: '#fff', opacity: 0.9 }}>
          <BsGift size={90} />
        </div>
      </div>

      {/* New */}
      <section>
        <SectionHeader
          icon={<Sparkles size={22} color="#7B2FBE" />}
          title="Новинки"
          link="/search?new=true"
        />
        <Grid>{newProducts.map(p => <ProductCard key={p.id} product={p} />)}</Grid>
      </section>

      {/* All */}
      <section>
        <SectionHeader
          icon={<TrendingUp size={22} color="#666" />}
          title="Все товары"
        />
        <Grid>{products.map(p => <ProductCard key={p.id} product={p} />)}</Grid>
      </section>

    </div>
  )
}
