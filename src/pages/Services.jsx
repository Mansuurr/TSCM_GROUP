import { Link } from 'react-router-dom'
import { services } from '../data/services-data'

const container = { maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }
const card = { backgroundColor: '#0d1110', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px' }
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }

export default function Services() {
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div style={{ position: 'relative', width: '100%', backgroundColor: '#050807', color: '#f5f5f5' }}>
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }} />
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '140px', paddingBottom: '120px' }}>
        <div style={container}>
          <h1 style={{ textAlign: 'center', fontFamily: "'Bebas Neue', 'Onest', sans-serif", fontSize: '40px', fontWeight: 400, color: '#f5f5f5', marginBottom: '64px' }}>
            Услуги
          </h1>

          <div style={grid}>
          {services.map((s, i) => (
            <div
              key={s.slug}
              onMouseMove={handleCardMouseMove}
              className="spotlight-card"
              style={card}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#f5f5f5', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>{s.desc}</p>
              <Link to={`/services/${s.slug}`} style={{ fontSize: '14px', color: '#14804f', textDecoration: 'none', fontWeight: 500 }}>Подробнее →</Link>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
