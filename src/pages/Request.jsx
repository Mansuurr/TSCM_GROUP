import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'

const initialForm = { name: '', phone: '', type: 'Квартира', description: '' }

export default function Request() {
  const [form, setForm] = useState(initialForm)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/requests', form)
      setSent(true)
    } catch (err) {
      setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-32">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-4xl font-light text-white">
        Заявка на проверку
      </motion.h1>
      <p className="mt-4 text-center text-[#666]">Опишите ситуацию — мы свяжемся в течение 10 минут</p>

      {sent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 rounded-2xl border border-[#333] bg-[#0f0f0f] p-8 text-center">
          <p className="text-white">Заявка отправлена. Мы скоро свяжемся с вами.</p>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-[#555]">Имя или псевдоним</label>
            <input
              required
              value={form.name}
              onChange={handleChange('name')}
              className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 text-white outline-none transition-colors focus:border-[#444]"
              placeholder="Иван"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-[#555]">Телефон</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 text-white outline-none transition-colors focus:border-[#444]"
              placeholder="+7 999 000-00-00"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-[#555]">Что нужно проверить</label>
            <select
              value={form.type}
              onChange={handleChange('type')}
              className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 text-white outline-none transition-colors focus:border-[#444]"
            >
              <option>Квартира</option>
              <option>Офис</option>
              <option>Автомобиль</option>
              <option>Другое</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-[#555]">Описание ситуации</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={handleChange('description')}
              className="w-full rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 text-white outline-none transition-colors focus:border-[#444]"
              placeholder="Кратко опишите..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-4 text-sm font-medium text-black transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Отправляем...' : 'Отправить запрос'}
          </button>
          {error && <p className="text-center text-xs text-red-400">{error}</p>}
          <p className="text-center text-xs text-[#333]">Все обращения строго конфиденциальны</p>
        </motion.form>
      )}
    </div>
  )
}