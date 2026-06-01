import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Heart, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', color: '#aaa', marginTop: 'auto' }}>
      <div className="container grid-footer" style={{ padding: '48px 24px' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: '#7B2FBE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>U</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>uzum</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Крупнейший маркетплейс Узбекистана. Миллионы товаров с доставкой по всей стране.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Heart, Send].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa',
                textDecoration: 'none', transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#7B2FBE'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Buyers */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Покупателям</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Как сделать заказ', 'Доставка и оплата', 'Возврат товара', 'Программа лояльности', 'Отзывы'].map(l => (
              <li key={l}>
                <Link to="#" style={{ color: '#888', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9b4fd4'}
                  onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sellers */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Продавцам</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Стать продавцом', 'Личный кабинет', 'Условия работы', 'Реклама на Uzum', 'Помощь'].map(l => (
              <li key={l}>
                <Link to="#" style={{ color: '#888', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9b4fd4'}
                  onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Контакты</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { Icon: Phone, text: '+998 71 200-00-00' },
              { Icon: Mail, text: 'support@uzum.uz' },
              { Icon: MapPin, text: 'г. Ташкент, ул. Амира Темура, 107Б' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                <Icon size={15} color="#7B2FBE" style={{ marginTop: 1, flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px', textAlign: 'center', fontSize: 12, color: '#555' }}>
        © 2024 Uzum Market. Все права защищены.
      </div>
    </footer>
  )
}
