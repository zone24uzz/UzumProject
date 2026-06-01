import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BsFire, BsStars, BsLightningChargeFill } from 'react-icons/bs'

const banners = [
  {
    id: 1,
    title: 'Мегараспродажа',
    subtitle: 'Скидки до 70% на электронику',
    gradient: 'linear-gradient(135deg, #7B2FBE 0%, #4a1a7a 100%)',
    BadgeIcon: BsFire,
    badge: 'ХИТ СЕЗОНА',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=80',
    cta: 'Смотреть скидки',
  },
  {
    id: 2,
    title: 'Новая коллекция',
    subtitle: 'Одежда и обувь — стиль без компромиссов',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #c94a1a 100%)',
    BadgeIcon: BsStars,
    badge: 'НОВИНКИ',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
    cta: 'Смотреть коллекцию',
  },
  {
    id: 3,
    title: 'Умный дом',
    subtitle: 'Техника для комфортной жизни',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #064e3b 100%)',
    BadgeIcon: BsLightningChargeFill,
    badge: 'ВЫГОДНО',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    cta: 'Выбрать технику',
  },
]

const btnStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 20,
  width: 44,
  height: 44,
  background: 'rgba(255,255,255,0.22)',
  backdropFilter: 'blur(6px)',
  border: '1.5px solid rgba(255,255,255,0.3)',
  borderRadius: '50%',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.2s',
}

export default function Banner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % banners.length), 4500)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(p => (p - 1 + banners.length) % banners.length)
  const next = () => setCurrent(p => (p + 1) % banners.length)

  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }} className="banner-height">

      {/* Slides */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.7s ease',
            background: b.gradient,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <img
            src={b.img}
            alt={b.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.2 }}
          />
          <div style={{ position: 'absolute', right: -40, top: -40, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', right: 60, bottom: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div className="banner-content" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.2)', color: '#fff',
              fontSize: 11, fontWeight: 700, padding: '5px 14px',
              borderRadius: 20, marginBottom: 16, letterSpacing: '0.5px', width: 'fit-content'
            }}>
              <b.BadgeIcon size={13} />
              {b.badge}
            </span>
            <h2 className="banner-title" style={{ color: '#fff', fontWeight: 900, lineHeight: 1.1, marginBottom: 12 }}>{b.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 24 }}>{b.subtitle}</p>
            <button style={{
              background: '#fff', color: '#7B2FBE', fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', width: 'fit-content'
            }}>
              {b.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Prev arrow */}
      <button
        onClick={prev}
        style={{ ...btnStyle, left: 16 }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.38)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        style={{ ...btnStyle, right: 16 }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.38)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8 }}>
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
              background: '#fff', transition: 'all 0.3s',
              width: i === current ? 26 : 8,
              opacity: i === current ? 1 : 0.45,
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
