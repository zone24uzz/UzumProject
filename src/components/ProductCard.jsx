import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const fmt = (p) => new Intl.NumberFormat('ru-UZ').format(p) + ' сум'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const inWishlist = isInWishlist(product.id)
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null

  return (
    <div
      style={{
        background: '#fff', borderRadius: 16,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f8f8f8', overflow: 'hidden' }}>
        <Link to={`/product/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.images[0]}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            loading="lazy"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.isNew && (
            <span style={{ background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>Новинка</span>
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}
        >
          <ShoppingCart size={14} />
          В корзину
        </button>
      </div>
    </div>
  )
}
