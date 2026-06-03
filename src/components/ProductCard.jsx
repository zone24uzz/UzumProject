import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const fmt = (p) => new Intl.NumberFormat('ru-UZ').format(p) + ' сум'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const inWishlist = isInWishlist(product.id)
  const cardRef = useRef(null)
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -8
    const rotY = ((x - cx) / cx) * 8
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  return (
    <div
      ref={cardRef}
      className="tilt-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#fff', borderRadius: 16,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f8f8f8', overflow: 'hidden' }}>
        <Link to={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.images[0]}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            loading="lazy"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Sheen overlay on hover */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
          borderRadius: 'inherit',
        }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.isNew && (
            <span className="animate-badge-bounce" style={{ display: 'inline-block', background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>Новинка</span>
          )}
          {discount && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product)}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, background: '#fff', borderRadius: '50%',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2) rotateZ(8deg)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotateZ(0deg)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)' }}
        >
          <Heart size={15} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#aaa'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: 6 }}>
        <span style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand}</span>

        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', flex: 1 }}>
          <h3 className="line-clamp-2" style={{ fontSize: 13, fontWeight: 500, color: '#222', lineHeight: 1.4 }}>
            {product.title}
          </h3>
        </Link>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={11} fill={s <= Math.round(product.rating) ? '#FBBF24' : 'none'} color={s <= Math.round(product.rating) ? '#FBBF24' : '#ddd'} />
          ))}
          <span style={{ fontSize: 11, color: '#999', marginLeft: 2 }}>{product.rating}</span>
        </div>

        {/* Price */}
        <div style={{ marginTop: 2 }}>
          {product.discountPrice ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#7B2FBE' }}>{fmt(product.discountPrice)}</div>
              <div style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>{fmt(product.price)}</div>
            </>
          ) : (
            <div style={{ fontSize: 16, fontWeight: 800, color: '#7B2FBE' }}>{fmt(product.price)}</div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => addToCart(product)}
          className="btn-purple"
          style={{
            marginTop: 6, width: '100%', padding: '9px 0',
            borderRadius: 10, fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) translateZ(4px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(123,47,190,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) translateZ(0)'; e.currentTarget.style.boxShadow = 'none' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px) translateZ(0)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) translateZ(4px)' }}
        >
          <ShoppingCart size={14} />
          В корзину
        </button>
      </div>
    </div>
  )
}
