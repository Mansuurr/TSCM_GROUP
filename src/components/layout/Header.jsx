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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-[#1d3d3a]/40' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="TSCM Group" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[13px] font-medium tracking-wide transition-colors ${
                location.pathname === link.to ? 'text-[#4a9490]' : 'text-[#666] hover:text-[#4a9490]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 text-[13px] text-[#888] transition-colors hover:text-[#4a9490]">
            <Phone className="h-3.5 w-3.5" />
            {phone}
          </a>
          <Link
            to="/request"
            className="rounded-full bg-gradient-to-r from-[#1a3d3a] to-[#2d5f5a] px-5 py-2 text-[13px] font-medium text-white transition-transform hover:scale-105"
          >
            Заявка
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[#1d3d3a]/40 bg-[#050505] md:hidden"
          >
            <div className="flex flex-col gap-6 px-6 py-8">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="text-lg text-[#888] transition-colors hover:text-[#4a9490]">
                  {link.label}
                </Link>
              ))}
              <Link to="/request" className="mt-2 rounded-full bg-gradient-to-r from-[#1a3d3a] to-[#2d5f5a] py-3 text-center text-sm font-medium text-white">
                Оставить заявку
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}