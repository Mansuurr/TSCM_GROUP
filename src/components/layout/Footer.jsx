import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1f1f1f', backgroundColor: '#050505' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <img src="/logo.png" alt="TSCM Group" style={{ height: '28px', width: 'auto', opacity: 0.7 }} />
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#404040' }}>
            Все обращения строго конфиденциальны. Данные не передаются третьим лицам.
          </p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <Link to="/services" style={{ color: '#737373', textDecoration: 'none', transition: 'color 0.3s' }}>Услуги</Link>
            <Link to="/contacts" style={{ color: '#737373', textDecoration: 'none', transition: 'color 0.3s' }}>Контакты</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}