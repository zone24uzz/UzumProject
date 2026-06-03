import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { X, MapPin, Phone, Navigation, CreditCard, CheckCircle } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})
const userIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34] })
const pickupIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34] })
const POINTS=[{id:1,name:'Uzum — Chilanзар',address:'ул. Катартал, 56',lat:41.2995,lng:69.2401,hours:'09:00-21:00'},{id:2,name:'Uzum — Юнусабад',address:'пр. Амира Темура, 107Б',lat:41.3375,lng:69.2877,hours:'09:00-21:00'},{id:3,name:'Uzum — Мирзо-Улугбек',address:'ул. Мустакиллик, 34',lat:41.3200,lng:69.3100,hours:'09:00-20:00'},{id:4,name:'Uzum — Сергели',address:'ул. Сергели, 12',lat:41.2450,lng:69.2650,hours:'09:00-20:00'},{id:5,name:'Uzum — Бектемир',address:'ул. Паркентская, 78',lat:41.2800,lng:69.3600,hours:'10:00-20:00'},{id:6,name:'Uzum — Яшнабад',address:'ул. Фаргона йули, 1',lat:41.3050,lng:69.3400,hours:'09:00-21:00'},{id:7,name:'Uzum — Шайхантахур',address:'ул. Навои, 23',lat:41.3150,lng:69.2600,hours:'09:00-21:00'},{id:8,name:'Uzum — Учтепа',address:'ул. Учтепа, 45',lat:41.3300,lng:69.2200,hours:'10:00-20:00'}]
function km(la1,ln1,la2,ln2){const R=6371,dL=(la2-la1)*Math.PI/180,dN=(ln2-ln1)*Math.PI/180;const a=Math.sin(dL/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dN/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}
function FlyTo({pos}){const map=useMap();useEffect(()=>{if(pos)map.flyTo(pos,14,{duration:1.2})},[pos]);return null}
const fmt=p=>new Intl.NumberFormat('ru-UZ').format(p)+' сум'
const fCard=v=>v.replace(/D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
const fExp=v=>{const d=v.replace(/D/g,'').slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d}
const fPhone=v=>{const d=v.replace(/D/g,'').slice(0,12);if(d.length<=3)return'+'+d;if(d.length<=5)return'+'+d.slice(0,3)+' '+d.slice(3);if(d.length<=7)return'+'+d.slice(0,3)+' '+d.slice(3,5)+' '+d.slice(5);if(d.length<=9)return'+'+d.slice(0,3)+' '+d.slice(3,5)+' '+d.slice(5,7)+' '+d.slice(7);return'+'+d.slice(0,3)+' '+d.slice(3,5)+' '+d.slice(5,7)+' '+d.slice(7,9)+' '+d.slice(9)}


export default function CheckoutModal({ total, onClose, onSuccess }) {
  const [step, setStep] = useState(1)
  const [pos, setPos] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locErr, setLocErr] = useState('')
  const [sel, setSel] = useState(null)
  const [phone, setPhone] = useState('')
  const [card, setCard] = useState('')
  const [exp, setExp] = useState('')
  const [cvv, setCvv] = useState('')
  const [paying, setPaying] = useState(false)

  const nearby = pos
    ? [...POINTS].map(p => ({ ...p, d: km(pos[0], pos[1], p.lat, p.lng) })).sort((a, b) => a.d - b.d)
    : POINTS

  const locate = () => {
    setLocating(true)
    setLocErr('')
    navigator.geolocation.getCurrentPosition(
      p => { setPos([p.coords.latitude, p.coords.longitude]); setLocating(false) },
      () => { setLocErr('Не удалось определить местоположение'); setLocating(false) },
      { timeout: 8000 }
    )
  }

  const pay = e => {
    e.preventDefault()
    setPaying(true)
    setTimeout(() => { setPaying(false); onSuccess() }, 1800)
  }

  const S = (base, override = {}) => ({ ...base, ...override })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 24, width: '100%', maxWidth: 900, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>

        {/* ── Stepper header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['Пункт выдачи', 'Оплата'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step > i + 1 ? '#10b981' : step === i + 1 ? '#7B2FBE' : '#e5e5e5', color: step >= i + 1 ? '#fff' : '#999', fontSize: 13, fontWeight: 700 }}>
                  {step > i + 1 ? <CheckCircle size={15} /> : i + 1}
                </div>
                <span style={{ fontSize: 14, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? '#111' : '#aaa' }}>{label}</span>
                {i < 1 && <div style={{ width: 32, height: 2, background: step > 1 ? '#7B2FBE' : '#e5e5e5', margin: '0 10px' }} />}
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        {/* ── Step 1: Map + pickup list ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

            {/* Sidebar */}
            <div style={{ width: 290, flexShrink: 0, borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5' }}>
                <button
                  onClick={locate}
                  disabled={locating}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#7B2FBE', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: locating ? 'wait' : 'pointer', opacity: locating ? 0.7 : 1, transition: 'opacity 0.2s' }}
                >
                  <Navigation size={14} />
                  {locating ? 'Определяем...' : 'Моё местоположение'}
                </button>
                {locErr && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 6, textAlign: 'center' }}>{locErr}</p>}
              </div>

              <div style={{ overflowY: 'auto', flex: 1 }}>
                {nearby.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSel(p)}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 14px', background: sel?.id === p.id ? '#f8f5ff' : 'none', border: 'none', borderBottom: '1px solid #f5f5f5', borderLeft: sel?.id === p.id ? '3px solid #7B2FBE' : '3px solid transparent', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (sel?.id !== p.id) e.currentTarget.style.background = '#fafafa' }}
                    onMouseLeave={e => { if (sel?.id !== p.id) e.currentTarget.style.background = 'none' }}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <MapPin size={13} color="#7B2FBE" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: '#888' }}>{p.address}</p>
                        <p style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{p.hours}</p>
                        {p.d != null && (
                          <p style={{ fontSize: 11, color: '#7B2FBE', fontWeight: 600, marginTop: 3 }}>
                            {p.d < 1 ? `${Math.round(p.d * 1000)} м` : `${p.d.toFixed(1)} км`}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Map */}
            <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
              <MapContainer center={[41.2995, 69.2401]} zoom={12} style={{ width: '100%', height: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                {pos && (
                  <>
                    <Marker position={pos} icon={userIcon}><Popup>Вы здесь</Popup></Marker>
                    <Circle center={pos} radius={1500} pathOptions={{ color: '#7B2FBE', fillColor: '#7B2FBE', fillOpacity: 0.07, weight: 1.5 }} />
                    <FlyTo pos={pos} />
                  </>
                )}
                {POINTS.map(p => (
                  <Marker key={p.id} position={[p.lat, p.lng]} icon={pickupIcon} eventHandlers={{ click: () => setSel(p) }}>
                    <Popup>
                      <strong>{p.name}</strong><br />{p.address}<br />
                      <span style={{ color: '#888' }}>{p.hours}</span>
                    </Popup>
                  </Marker>
                ))}
                {sel && <FlyTo pos={[sel.lat, sel.lng]} />}
              </MapContainer>
            </div>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
            <form onSubmit={pay} style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {sel && (
                <div style={{ background: '#f8f5ff', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <MapPin size={16} color="#7B2FBE" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{sel.name}</p>
                    <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{sel.address} · {sel.hours}</p>
                  </div>
                </div>
              )}

              {/* Phone */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Номер телефона</label>
                <div style={{ display: 'flex', border: '2px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = '#7B2FBE'}
                  onBlurCapture={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                >
                  <div style={{ padding: '12px 14px', background: '#f8f8f8', borderRight: '1px solid #e5e5e5', display: 'flex', alignItems: 'center' }}>
                    <Phone size={16} color="#7B2FBE" />
                  </div>
                  <input type="tel" value={phone} onChange={e => setPhone(fPhone(e.target.value))} placeholder="+998 90 123 45 67" required style={{ flex: 1, padding: '12px 14px', border: 'none', outline: 'none', fontSize: 14, background: '#fff' }} />
                </div>
              </div>

              {/* Card */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Номер карты</label>
                <div style={{ display: 'flex', border: '2px solid #e5e5e5', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = '#7B2FBE'}
                  onBlurCapture={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                >
                  <div style={{ padding: '12px 14px', background: '#f8f8f8', borderRight: '1px solid #e5e5e5', display: 'flex', alignItems: 'center' }}>
                    <CreditCard size={16} color="#7B2FBE" />
                  </div>
                  <input type="text" value={card} onChange={e => setCard(fCard(e.target.value))} placeholder="0000 0000 0000 0000" required style={{ flex: 1, padding: '12px 14px', border: 'none', outline: 'none', fontSize: 14, letterSpacing: '1px', background: '#fff' }} />
                </div>
              </div>

              {/* Expiry + CVV */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Срок действия</label>
                  <input type="text" value={exp} onChange={e => setExp(fExp(e.target.value))} placeholder="MM/YY" required
                    style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, outline: 'none', fontSize: 14, transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#7B2FBE'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>CVV</label>
                  <input type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="•••" required
                    style={{ width: '100%', padding: '12px 14px', border: '2px solid #e5e5e5', borderRadius: 12, outline: 'none', fontSize: 14, transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#7B2FBE'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>
              </div>

              {/* Total */}
              <div style={{ background: '#f8f5ff', borderRadius: 14, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#555' }}>К оплате</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#7B2FBE' }}>{fmt(total)}</span>
              </div>

              <button type="submit" disabled={paying}
                style={{ width: '100%', padding: '15px 0', borderRadius: 14, border: 'none', background: paying ? '#9b4fd4' : '#7B2FBE', color: '#fff', fontSize: 16, fontWeight: 700, cursor: paying ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!paying) e.currentTarget.style.background = '#5a1f8a' }}
                onMouseLeave={e => { if (!paying) e.currentTarget.style.background = '#7B2FBE' }}
              >
                {paying ? 'Обработка...' : `Оплатить ${fmt(total)}`}
              </button>
            </form>
          </div>
        )}

        {/* ── Footer nav ── */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          {step === 2
            ? <button onClick={() => setStep(1)} style={{ background: 'none', border: '2px solid #e5e5e5', borderRadius: 10, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#555' }}>← Назад</button>
            : <div />
          }
          {step === 1 && (
            <button
              onClick={() => { if (sel) setStep(2) }}
              disabled={!sel}
              style={{ background: sel ? '#7B2FBE' : '#e5e5e5', color: sel ? '#fff' : '#aaa', border: 'none', borderRadius: 10, padding: '10px 28px', fontSize: 14, fontWeight: 700, cursor: sel ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
            >
              Выбрать пункт →
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
