import { useSearchParams, Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import ProductCard from '../components/ProductCard'

export default function SearchPage({ products }) {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const trending = params.get('trending')
  const isNew = params.get('new')

  let results = products
  if (query) {
    const q = query.toLowerCase()
    results = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  } else if (trending) {
    results = products.filter(p => p.isTrending)
  } else if (isNew) {
    results = products.filter(p => p.isNew)
  }

  const title = query ? `Результаты: "${query}"` : trending ? 'Популярное' : 'Новинки'

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>Поиск</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>{title}</h1>
        <span style={{ fontSize: 13, color: '#999' }}>{results.length} товаров</span>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Search size={64} color="#ddd" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#555', marginBottom: 8 }}>Ничего не найдено</h2>
          <p style={{ color: '#aaa', marginBottom: 24 }}>Попробуйте другой запрос</p>
          <Link to="/" style={{ background: '#7B2FBE', color: '#fff', padding: '12px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
            На главную
          </Link>
        </div>
      ) : (
        <div className="grid-products">
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
