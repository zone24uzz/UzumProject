import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, Heart, Star, ArrowLeft, Package, Shield, Truck, RotateCcw } from 'lucide-react'
import { BsCheckLg } from 'react-icons/bs'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const fmt = (p) => new Intl.NumberFormat('ru-UZ').format(p) + ' сум'

export default function ProductPage({ products }) {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <p style={{ color: '#999', fontSize: 18 }}>Товар не найден</p>
      <Link to="/" style={{ color: '#7B2FBE', marginTop: 16, display: 'inline-block' }}>← На главную</Link>
    </div>
  )

  const related = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5)
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : null
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 56 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999', marginBottom: 24 }}>
        <Link to="/" style={{ color: '#7B2FBE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={14} /> Главная
        </Link>
        <span>/</span>
        <span style={{ color: '#444' }}>{product.title}</span>
      </div>

      {/* Main card */}
      <div className="product-layout" style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>

        {/* LEFT — Image */}
        <div style={{ position: 'relative' }}>
          {/* Badges */}
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {discount && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>-{discount}%</span>
            )}
            {product.isNew && (
              <span style={{ background: '#10b981', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8 }}>Новинка</span>
            )}
          </div>

          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f8f8f8', aspectRatio: '1/1' }}>
            <img
              src={product.images[0]}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* RIGHT — Details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Brand */}
          <span style={{ fontSize: 13, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            {product.brand}
          </span>

          {/* Title */}
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', lineHeight: 1.3, marginBottom: 14 }}>
            {product.title}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <Star
                  key={s}
                  size={18}
                  fill={s <= Math.round(product.rating) ? '#FBBF24' : 'none'}
                  color={s <= Math.round(product.rating) ? '#FBBF24' : '#ddd'}
                />
              ))}
            </div>
            <span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>{product.rating} / 5</span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 20 }}>
            {product.discountPrice ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#7B2FBE' }}>{fmt(product.discountPrice)}</span>
                <span style={{ fontSize: 18, color: '#bbb', textDecoration: 'line-through' }}>{fmt(product.price)}</span>
              </div>
            ) : (
              <span style={{ fontSize: 32, fontWeight: 900, color: '#7B2FBE' }}>{fmt(product.price)}</span>
            )}
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Package size={16} color={product.stock > 10 ? '#10b981' : '#f97316'} />
            <span style={{ fontSize: 14, fontWeight: 600, color: product.stock > 10 ? '#10b981' : '#f97316' }}>
              {product.stock > 0 ? `В наличии: ${product.stock} шт.` : 'Нет в наличии'}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 28 }}>
            {product.description}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 700, transition: 'all 0.2s',
                background: added ? '#10b981' : '#7B2FBE',
                color: '#fff',
              }}
              onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#5a1f8a' }}
              onMouseLeave={e => { if (!added) e.currentTarget.style.background = '#7B2FBE' }}
            >
              {added ? <BsCheckLg size={18} /> : <ShoppingCart size={18} />}
              {added ? 'Добавлено в корзину' : 'В корзину'}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                width: 52, height: 52, borderRadius: 14, border: `2px solid ${inWishlist ? '#ef4444' : '#e5e5e5'}`,
                background: inWishlist ? '#FEF2F2' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
              }}
              onMouseEnter={e => { if (!inWishlist) e.currentTarget.style.borderColor = '#7B2FBE' }}
              onMouseLeave={e => { if (!inWishlist) e.currentTarget.style.borderColor = '#e5e5e5' }}
            >
              <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#aaa'} />
            </button>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { Icon: Truck, label: 'Быстрая доставка' },
              { Icon: Shield, label: 'Гарантия качества' },
              { Icon: RotateCcw, label: 'Возврат 14 дней' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                background: '#f8f5ff', borderRadius: 14, padding: '16px 8px', textAlign: 'center'
              }}>
                <Icon size={22} color="#7B2FBE" />
                <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 20 }}>Похожие товары</h2>
          <div className="grid-products">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
