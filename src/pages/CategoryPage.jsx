import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { SlidersHorizontal, ArrowLeft, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'

export default function CategoryPage({ products, categories }) {
  const { slug } = useParams()
  const category = categories.find(c => c.slug === slug)
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3000000)

  if (!category) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <p style={{ color: '#999', fontSize: 18 }}>Категория не найдена</p>
      <Link to="/" style={{ color: '#7B2FBE', marginTop: 16, display: 'inline-block' }}>← На главную</Link>
    </div>
  )

  let filtered = products.filter(p => p.categoryId === category.id)
  filtered = filtered.filter(p => {
    const price = p.discountPrice || p.price
    return price >= minPrice && price <= maxPrice
  })
  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  if (sortBy === 'new') filtered = [...filtered].sort((a, b) => b.isNew - a.isNew)

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>{category.name}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{category.name}</h1>
        <span style={{ fontSize: 13, color: '#999' }}>{filtered.length} товаров</span>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: `2px solid ${showFilters ? '#7B2FBE' : '#e5e5e5'}`,
            background: showFilters ? '#EDE9FE' : '#fff',
            color: showFilters ? '#7B2FBE' : '#555',
            padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <SlidersHorizontal size={15} />
          Фильтры
        </button>

        <div style={{ position: 'relative' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              appearance: 'none', border: '2px solid #e5e5e5', background: '#fff',
              padding: '8px 36px 8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              outline: 'none', cursor: 'pointer', color: '#333'
            }}
          >
            <option value="default">По умолчанию</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="rating">По рейтингу</option>
            <option value="new">Сначала новинки</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Цена (сум)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(+e.target.value)}
              placeholder="От"
              style={{ border: '2px solid #e5e5e5', borderRadius: 8, padding: '7px 12px', fontSize: 13, width: 130, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#7B2FBE'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'}
            />
            <span style={{ color: '#ccc' }}>—</span>
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              placeholder="До"
              style={{ border: '2px solid #e5e5e5', borderRadius: 8, padding: '7px 12px', fontSize: 13, width: 130, outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#7B2FBE'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'}
            />
            <button
              onClick={() => { setMinPrice(0); setMaxPrice(3000000) }}
              style={{ color: '#7B2FBE', background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
            >
              Сбросить
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
          <p style={{ fontSize: 18, fontWeight: 600 }}>Товары не найдены</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Попробуйте изменить фильтры</p>
        </div>
      ) : (
        <div className="grid-products">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
