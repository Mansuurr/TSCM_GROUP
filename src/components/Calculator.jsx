import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'
import api from '../services/api'
import RequestForm from './RequestForm'

export default function Calculator() {
  const [questions, setQuestions] = useState([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [customText, setCustomText] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', messenger: 'telegram' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    api.get('/calculator/questions').then(({ data }) => setQuestions(data)).catch(() => {})
  }, [])

  const handleAnswer = (optionIndex, optionText) => {
    const isOther = optionText === 'Другое'
    if (isOther && !showCustomInput) {
      setShowCustomInput(true)
      return
    }

    const q = questions[step]
    const newAnswers = { ...answers, [q.id]: { optionIndex, customText: isOther ? customText : undefined } }
    setAnswers(newAnswers)
    setCustomText('')
    setShowCustomInput(false)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      submitCalculator(newAnswers)
    }
  }

  const submitCalculator = async (finalAnswers) => {
    setLoading(true)
    try {
      await api.post('/calculator/submit', { answers: finalAnswers })
      setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/requests', {
        name: form.name,
        phone: form.phone,
        messenger: form.messenger,
        type: 'Комплексная проверка (калькулятор)',
        source: 'calculator',
        answers: answers,
      })
      setSent(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (questions.length === 0) {
    return <p className="text-center text-sm text-[#888]">Загрузка...</p>
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-[#e3e2de] bg-white p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-[#14804f]">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-[#111]">Заявка отправлена</h3>
        <p className="mt-3 text-sm text-[#888]">Мы свяжемся с вами в ближайшее время.</p>
      </div>
    )
  }

if (done) {
  return (
    <div className="rounded-3xl border border-[#e3e2de] bg-white p-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-[#14804f]">
        <Check className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-[#111]">Анализ параметров завершен</h3>
      <p className="mb-8 text-sm text-[#5c5c58]">Смета и состав поисковой группы сформированы.</p>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="rounded-full bg-[#14804f] px-6 py-3 text-sm font-medium text-white">
          Оставить заявку
        </button>
      ) : (
        <div className="mx-auto mt-2 max-w-[400px] text-left">
          <RequestForm source="calculator" type="Комплексная проверка (калькулятор)" answers={answers} />
        </div>
      )}
    </div>
  )
}
  const q = questions[step]

  return (
    <div className="rounded-3xl border border-[#e3e2de] bg-white p-8 md:p-10">
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xs text-[#888]">Шаг {step + 1} из {questions.length}</span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-1 w-6 rounded-full ${i <= step ? 'bg-[#14804f]' : 'bg-[#e3e2de]'}`} />
              ))}
            </div>
          </div>
          <h3 className="mb-8 text-lg font-medium leading-relaxed text-[#111]">{q.question}</h3>

          {!showCustomInput ? (
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleAnswer(i, opt)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#e3e2de] bg-[#f7f7f5] px-6 py-4 text-left text-sm text-[#333] transition-all hover:border-[#14804f] hover:bg-[#14804f]/5 disabled:opacity-40"
                >
                  {opt}
                  <ChevronRight className="h-4 w-4 text-[#888]" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                autoFocus
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Уточните вариант..."
                className="w-full rounded-xl border border-[#e3e2de] bg-white px-5 py-3.5 text-sm outline-none focus:border-[#14804f]"
              />
              <button
                onClick={() => handleAnswer(q.options.length - 1, 'Другое')}
                disabled={!customText.trim()}
                className="w-full rounded-full bg-[#14804f] py-3 text-sm font-medium text-white disabled:opacity-40"
              >
                Продолжить
              </button>
            </div>
          )}
          {loading && <p className="mt-6 text-center text-xs text-[#888]">Формируем результат...</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}