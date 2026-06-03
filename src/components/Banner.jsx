import { useState, useEffect, useRef } from 'react'
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
  transition: 'background 0.2s, transform 0.2s',
}

export default function Banner() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const bannerRef = useRef(null)
  const mousePos = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => goNext(), 4500)
    return () => clearInterval(t)
  }, [current])

  // Parallax mouse tracking (throttled via rAF)
  useEffect(() => {
    const el = bannerRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          const orbs = el.querySelectorAll('[data-orb]')
          orbs.forEach((orb, i) => {
            const depth = (i + 1) * 18
            const dx = (mousePos.current.x - 0.5) * depth
            const dy = (mousePos.current.y - 0.5) * depth
            orb.style.transform = `translate(${dx}px, ${dy}px)`
          })
          rafRef.current = null
        })
      }
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    return () => { el.removeEventListener('mousemove', onMove); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const goPrev = () => {
    setPrev(current)
    setCurrent(p => (p - 1 + banners.length) % banners.length)
  }

  const goNext = () => {
    setPrev(current)
    setCurrent(p => (p + 1) % banners.length)
  }

  return (
    <div
      ref={bannerRef}
      style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}
      className="banner-height"
    >
      {banners.map((b, i) => {
        const isActive = i === current
        return (
          <div
            key={b.id}
            style={{
              position: 'absolute', inset: 0, zIndex: 1,
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(1.03)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
              background: b.gradient,
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <img
              src={b.img}
              alt={b.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.2 }}
            />

            {/* Parallax orbs */}
            <div
              data-orb="1"
              style={{
                position: 'absolute', right: -40, top: -40,
                width: 300, height: 300, borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
                transition: 'transform 0.1s linear',
                animation: isActive ? 'orbFloat1 8s ease-in-out infinite' : 'none',
              }}
            />
            <div
              data-orb="2"
              style={{
                position: 'absolute', right: 60, bottom: -80,
                width: 360, height: 360, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                transition: 'transform 0.1s linear',
                animation: isActive ? 'orbFloat2 10s ease-in-out infinite' : 'none',
              }}
            />
            <div
              data-orb="3"
              style={{
                position: 'absolute', left: '40%', top: '10%',
                width: 120, height: 120, borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                transition: 'transform 0.1s linear',
                animation: isActive ? 'orbFloat1 6s ease-in-out infinite 1s' : 'none',
              }}
            />

            <div className="banner-content" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.2)', color: '#fff',
                  fontSize: 11, fontWeight: 700, padding: '5px 14px',
                  borderRadius: 20, marginBottom: 16, letterSpacing: '0.5px', width: 'fit-content',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0) rotateX(0deg)' : 'translateY(20px) rotateX(20deg)',
                  transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
                }}
              >
                <b.BadgeIcon size={13} />
                {b.badge}
              </span>
              <h2
                className="banner-title"
                style={{
                  color: '#fff', fontWeight: 900, lineHeight: 1.1, marginBottom: 12,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0) rotateX(0deg)' : 'translateY(30px) rotateX(15deg)',
                  transition: 'opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s',
                  textShadow: '0 4px 24px rgba(0,0,0,0.25)',
                }}
              >
                {b.title}
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.75)', fontSize: 16, marginBottom: 24,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.55s ease 0.3s, transform 0.55s ease 0.3s',
                }}
              >
                {b.subtitle}
              </p>
              <button
                style={{
                  background: '#fff', color: '#7B2FBE', fontWeight: 700, fontSize: 14,
                  padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  width: 'fit-content',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                  transition: 'opacity 0.55s ease 0.4s, transform 0.55s ease 0.4s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)' }}
              >
                {b.cta}
              </button>
            </div>
          </div>
        )
      })}

      {/* Prev arrow */}
      <button
        onClick={goPrev}
        style={{ ...btnStyle, left: 16 }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.38)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next arrow */}
      <button
        onClick={goNext}
        style={{ ...btnStyle, right: 16 }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.38)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 8 }}>
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i) }}
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
