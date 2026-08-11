import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../../hooks/useSettings'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги' },
  { to: '/pricing', label: 'Тарифы' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { data: settings } = useSettings()
  const phone = settings?.phone || '+7 (999) 000-00-00'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <>
      {/* Тонкая полоса-анонс сверху */}
      <div className="w-full bg-[#14804f] py-1.5 text-center text-[11px] font-medium tracking-wide text-white">
        Работаем по всему Казахстану
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'border-b border-[#e3e2de] bg-white/90 backdrop-blur-xl' : 'border-b border-transparent bg-white'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="TSCM Group" className="h-9 w-auto" />
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[13px] font-medium tracking-wide transition-colors ${
                  location.pathname === link.to ? 'text-[#14804f]' : 'text-[#444] hover:text-[#14804f]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-[13px] text-[#444] transition-colors hover:text-[#14804f]">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
            <Link
              to="/request"
              className="rounded-full bg-[#14804f] px-5 py-2 text-[13px] font-medium text-white transition-transform hover:scale-105 hover:bg-[#0e5c39]"
            >
              Заявка
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5 text-[#111]" /> : <Menu className="h-5 w-5 text-[#111]" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-[#e3e2de] bg-white md:hidden"
            >
              <div className="flex flex-col gap-6 px-6 py-8">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-lg text-[#333] transition-colors hover:text-[#14804f]">
                    {link.label}
                  </Link>
                ))}
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-sm text-[#444]">
                  <Phone className="h-4 w-4" /> {phone}
                </a>
                <Link to="/request" className="mt-2 rounded-full bg-[#14804f] py-3 text-center text-sm font-medium text-white">
                  Оставить заявку
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}