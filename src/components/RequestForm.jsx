import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

export default function RequestForm({ source = 'direct', type = 'Общая заявка', onSuccess, answers = null }) {
  const [form, setForm] = useState({ name: '', phone: '', messenger: 'telegram' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading || sent) return
    setLoading(true)
    setError(null)
    try {
      const payload = { ...form, type, source }
      if (answers) payload.answers = answers
      await api.post('/requests', payload)
      setSent(true)
      onSuccess?.()
    } catch (err) {
      setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center">
        <p className="text-[#111]">Заявка отправлена. Мы скоро свяжемся с вами.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#888]">Как к вам обращаться</label>
        <input
          required
          value={form.name}
          onChange={handleChange('name')}
          className="w-full rounded-xl border border-[#e3e2de] bg-white px-5 py-3.5 text-sm text-[#111] outline-none transition-colors placeholder:text-[#bbb] focus:border-[#14804f]"
          placeholder="Иван"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#888]">Мессенджер для связи</label>
        <div className="flex gap-3">
          {['telegram', 'whatsapp'].map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setForm({ ...form, messenger: m })}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm capitalize transition-colors ${
                form.messenger === m ? 'border-[#14804f] bg-[#14804f]/5 text-[#14804f]' : 'border-[#e3e2de] text-[#333]'
              }`}
            >
              {m === 'telegram' ? 'Telegram' : 'WhatsApp'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#888]">Номер телефона</label>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={handleChange('phone')}
          className="w-full rounded-xl border border-[#e3e2de] bg-white px-5 py-3.5 text-sm text-[#111] outline-none transition-colors placeholder:text-[#bbb] focus:border-[#14804f]"
          placeholder="+7 999 000-00-00"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#14804f] py-4 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-[#0e5c39] disabled:opacity-50"
      >
        {loading ? 'Отправляем...' : 'Оставить заявку'}
      </button>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
      <p className="text-center text-[11px] text-[#aaa]">Все обращения строго конфиденциальны. Данные не передаются третьим лицам.</p>
    </form>
  )
}