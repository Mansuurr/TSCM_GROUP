import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { services } from '../data/services-data'

const container = { maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }
const card = { backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }

export default function Services() {
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div style={{ width: '100%', backgroundColor: '#050505', color: '#f5f5f5', paddingTop: '140px', paddingBottom: '120px' }}>
      <div style={container}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', fontSize: '36px', fontWeight: 300, color: '#ffffff', marginBottom: '64px' }}>
          Услуги
        </motion.h1>

        <div style={grid}>
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseMove={handleCardMouseMove}
              className="spotlight-card"
              style={card}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#ffffff', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#666', marginBottom: '16px' }}>{s.desc}</p>
              <Link to={`/services/${s.slug}`} style={{ fontSize: '14px', color: '#4a9490', textDecoration: 'none' }}>Подробнее →</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}