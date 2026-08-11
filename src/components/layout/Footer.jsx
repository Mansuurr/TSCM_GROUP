import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #e3e2de', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <img src="/logo.png" alt="TSCM Group" style={{ height: '32px', width: 'auto', opacity: 0.85 }} />
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#14804f', fontWeight: 500 }}>
            Работаем по всему Казахстану
          </p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#888886' }}>
            Все обращения строго конфиденциальны. Данные не передаются третьим лицам.
          </p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <Link to="/services" style={{ color: '#5c5c58', textDecoration: 'none', transition: 'color 0.3s' }}>Услуги</Link>
            <Link to="/contacts" style={{ color: '#5c5c58', textDecoration: 'none', transition: 'color 0.3s' }}>Контакты</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}