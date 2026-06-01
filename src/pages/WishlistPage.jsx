import { Link } from 'react-router-dom'
import { Heart, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const { wishlist } = useCart()

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#333' }}>Избранное</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Избранное ({wishlist.length})</h1>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Heart size={72} color="#ddd" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#555', marginBottom: 8 }}>Список пуст</h2>
          <p style={{ color: '#aaa', marginBottom: 24 }}>Добавляйте товары в избранное, нажав на сердечко</p>
          <Link to="/" style={{ background: '#7B2FBE', color: '#fff', padding: '12px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div className="grid-products">
          {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
