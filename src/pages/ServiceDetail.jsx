import { motion } from 'framer-motion'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { services } from '../data/services-data'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return <Navigate to="/services" replace />
  }

  return (
    <div style={{ width: '100%', backgroundColor: '#050505', color: '#f5f5f5', paddingTop: '140px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888', textDecoration: 'none', marginBottom: '40px' }}>
          <ArrowLeft size={16} /> Все услуги
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '32px', fontWeight: 300, color: '#ffffff', marginBottom: '24px' }}
        >
          {service.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '16px', lineHeight: 1.8, color: '#999' }}
        >
          {service.fullDesc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginTop: '48px' }}
        >
          <Link
            to="/request"
            style={{ display: 'inline-block', backgroundColor: '#ffffff', color: '#000000', padding: '14px 32px', borderRadius: '9999px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
          >
            Заказать проверку
          </Link>
        </motion.div>
      </div>
    </div>
  )
}