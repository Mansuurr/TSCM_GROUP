import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Radio, Car, Building, Video, ClipboardCheck, ChevronRight, Check } from 'lucide-react'
import api from '../services/api'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }),
}

const services = [
  { icon: Radio, title: 'Поиск жучков', desc: 'Радиомикрофоны, GSM-жучки, проводные микрофоны' },
  { icon: Car, title: 'Проверка авто', desc: 'GPS-трекеры, маячки, скрытые камеры в салоне' },
  { icon: Building, title: 'Помещения', desc: 'Офисы, переговорные, квартиры' },
  { icon: Video, title: 'Видеокамеры', desc: 'Микрокамеры, пинхол-объективы' },
  { icon: ClipboardCheck, title: 'Аудит', desc: 'Оценка защищённости пространства' },
]

const galleryItems = [
  { image: '/1a.jpg', label: 'Нелинейный локатор в работе' },
  { image: '/1b.png', label: 'Сканирование радиочастотного эфира' },
  { image: '/1c.png', label: 'Проверка автомобиля на GPS-маяки' },
  { image: '/1d.png', label: 'Поиск замаскированных микрокамер' },
]

const quizQuestions = [
  { id: 1, question: 'Проводили ли вы проверку помещения на прослушку за последний год?', options: ['Да', 'Нет', 'Не помню'] },
  { id: 2, question: 'Есть ли у вас конфиденциальные переговоры в офисе?', options: ['Да, регулярно', 'Иногда', 'Нет'] },
  { id: 3, question: 'Замечали ли вы посторонние шумы или эхо в телефоне?', options: ['Да, часто', 'Бывало', 'Нет'] },
  { id: 4, question: 'Есть ли у вас подозрения на слежку за автомобилем?', options: ['Да', 'Не уверен', 'Нет'] },
  { id: 5, question: 'Меняли ли вы пароли Wi-Fi и доступы за последние 6 месяцев?', options: ['Да', 'Нет', 'Не помню'] },
]

export default function Home() {
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizDone, setQuizDone] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState(null)

  const handleQuizAnswer = async (optionIndex) => {
    const currentQuestion = quizQuestions[quizStep]
    const newAnswers = { ...quizAnswers, [currentQuestion.id]: optionIndex }
    setQuizAnswers(newAnswers)

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
      return
    }

    // последний вопрос — отправляем результат на бэк
    setQuizLoading(true)
    setQuizError(null)
    try {
      const { data } = await api.post('/quiz/submit', { answers: newAnswers })
      setQuizResult({
        score: data.score,
        risk: data.riskLevel,
        text: data.riskLevelText,
        checklist: data.checklist,
      })
      setQuizDone(true)
    } catch (err) {
      setQuizError('Не удалось отправить результаты. Попробуйте ещё раз.')
    } finally {
      setQuizLoading(false)
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizAnswers({})
    setQuizDone(false)
    setQuizResult(null)
    setQuizError(null)
  }

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div className="relative w-full">
      {/* Фон */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '60px 60px' }} />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        {/* HERO */}
        <section className="flex w-full flex-col items-center justify-center px-6 pb-32 pt-36 text-center md:pt-44">
          <motion.p custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-6 text-xs font-medium tracking-[0.3em] text-[#555] uppercase">
            Физическая безопасность
          </motion.p>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="max-w-[800px] text-[clamp(2rem,5vw,4rem)] font-light leading-[1.1] tracking-tight text-white">
            Профессиональный поиск жучков и защита от слежки
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="mt-8 max-w-[500px] text-base leading-relaxed text-[#777]">
            Проверка помещений, автомобилей и офисов сертифицированным оборудованием. Полная конфиденциальность.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/request" className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-transform hover:scale-105">
              Оставить заявку
            </Link>
            <a href="#quiz" className="flex items-center justify-center gap-2 rounded-full border border-[#333] px-8 py-3.5 text-sm text-white transition-all hover:border-[#555] hover:bg-[#111]">
              Пройти тест <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </section>

        {/* УТП */}
        <section className="w-full px-6 py-32 md:py-40">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-20 text-center text-xs font-medium tracking-[0.25em] text-[#555] uppercase">
              Почему нам доверяют
            </motion.h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Экспертное оборудование', desc: 'Анализаторы спектра, нелинейные локаторы, тепловизоры' },
                { title: 'Полная конфиденциальность', desc: 'NDA, анонимный выезд, авто без опознавательных знаков' },
                { title: 'Сложные угрозы', desc: 'Цифровые диктофоны, мини-камеры, трекеры' },
                { title: 'Комплексная защита', desc: 'Помещения, автомобили, гаджеты и каналы связи' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  onMouseMove={handleCardMouseMove}
                  className="spotlight-card rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] p-6 transition-all duration-500 hover:border-[#333] hover:bg-[#111]"
                >
                  <div className="mb-5 h-px w-10 bg-[#333]" />
                  <h3 className="mb-2 text-base font-medium text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#666]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* УСЛУГИ */}
        <section className="w-full px-6 py-32 md:py-40">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20 text-center text-xs font-medium tracking-[0.25em] text-[#555] uppercase">
              Услуги
            </motion.h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  onMouseMove={handleCardMouseMove}
                  className="spotlight-card group cursor-pointer rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] p-8 transition-all duration-500 hover:border-[#333] hover:bg-[#111]"
                >
                  <s.icon className="mb-6 h-6 w-6 text-[#444] transition-colors duration-500 group-hover:text-white" strokeWidth={1.5} />
                  <h3 className="mb-2 text-lg font-medium text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[#666] transition-colors group-hover:text-[#888]">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ГАЛЕРЕЯ */}
        <section className="w-full px-6 py-32 md:py-40">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20 text-center text-xs font-medium tracking-[0.25em] text-[#555] uppercase">
              Галерея
            </motion.h2>

            <div className="grid gap-8 sm:grid-cols-2">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onMouseMove={handleCardMouseMove}
                  className="spotlight-card overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c]"
                >
                  <img src={item.image} alt={item.label} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  <div className="p-6">
                    <p className="text-sm text-[#777]">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* КВИЗ */}
        <section id="quiz" className="w-full px-6 py-32 md:py-40">
          <div className="mx-auto w-full max-w-[600px]">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="mb-4 text-center text-xs font-medium tracking-[0.25em] text-[#555] uppercase">Тест на защищённость</h2>
              <p className="mb-12 text-center text-[#777]">Пройдите короткий тест из 5 вопросов и узнайте уровень защищённости вашего бизнеса</p>

              <div className="rounded-3xl border border-[#1a1a1a] bg-[#0c0c0c] p-8 md:p-10">
                {!quizDone ? (
                  <AnimatePresence mode="wait">
                    <motion.div key={quizStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <div className="mb-8 flex items-center justify-between">
                        <span className="text-xs text-[#444]">Вопрос {quizStep + 1} из {quizQuestions.length}</span>
                        <div className="flex gap-1">
                          {quizQuestions.map((_, i) => (
                            <div key={i} className={`h-1 w-6 rounded-full ${i <= quizStep ? 'bg-white' : 'bg-[#222]'}`} />
                          ))}
                        </div>
                      </div>
                      <h3 className="mb-8 text-lg font-medium leading-relaxed text-white">{quizQuestions[quizStep].question}</h3>
                      <div className="space-y-3">
                        {quizQuestions[quizStep].options.map((opt, i) => (
                          <button
                            key={i}
                            disabled={quizLoading}
                            onClick={() => handleQuizAnswer(i)}
                            className="flex w-full items-center justify-between rounded-xl border border-[#222] bg-[#111] px-6 py-4 text-left text-sm text-[#aaa] transition-all hover:border-[#444] hover:bg-[#161616] hover:text-white disabled:opacity-40"
                          >
                            {opt}
                            <ChevronRight className="h-4 w-4 text-[#444]" />
                          </button>
                        ))}
                      </div>
                      {quizLoading && (
                        <p className="mt-6 text-center text-xs text-[#555]">Считаем результат...</p>
                      )}
                      {quizError && (
                        <p className="mt-6 text-center text-xs text-red-400">{quizError}</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${quizResult.risk === 'high' ? 'bg-red-500/10 text-red-400' : quizResult.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-medium text-white">{quizResult.text}</h3>
                    <p className="mb-8 text-sm text-[#666]">Баллов: {quizResult.score} из 10</p>

                    <div className="mb-8 rounded-2xl border border-[#222] bg-[#111] p-6 text-left">
                      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[#555]">Чек-лист признаков прослушки</p>
                      <ul className="space-y-2">
                        {quizResult.checklist.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm text-[#888]">
                            <span className="h-1 w-1 rounded-full bg-[#555]" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Link to="/request" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black">Заказать проверку</Link>
                      <button onClick={resetQuiz} className="rounded-full border border-[#333] px-6 py-3 text-sm text-white hover:bg-[#111]">Пройти заново</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ФОРМА ЗАЯВКИ */}
        <section className="w-full px-6 py-32 md:py-40">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-[#1a1a1a] bg-[#0c0c0c] p-8 md:p-16">
              <div className="mx-auto w-full max-w-[500px]">
                <h2 className="text-center text-2xl font-light text-white md:text-3xl">Заказать конфиденциальную проверку</h2>
                <p className="mt-4 text-center text-sm text-[#666]">Опишите ситуацию. Мы свяжемся с вами в защищённом канале связи в течение 10 минут.</p>

                <form className="mt-12 space-y-5">
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#444]">Ваше имя или псевдоним</label>
                    <input required className="w-full rounded-xl border border-[#222] bg-[#111] px-5 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#333] focus:border-[#444]" placeholder="Иван" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#444]">Телефон для связи</label>
                    <input required type="tel" className="w-full rounded-xl border border-[#222] bg-[#111] px-5 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#333] focus:border-[#444]" placeholder="+7 999 000-00-00" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#444]">Что нужно проверить</label>
                    <select className="w-full rounded-xl border border-[#222] bg-[#111] px-5 py-3.5 text-sm text-white outline-none transition-colors focus:border-[#444]">
                      <option>Квартира</option>
                      <option>Офис</option>
                      <option>Автомобиль</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#444]">Краткое описание ситуации</label>
                    <textarea rows={4} className="w-full rounded-xl border border-[#222] bg-[#111] px-5 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-[#333] focus:border-[#444]" placeholder="Подозреваю прослушку в переговорной..." />
                  </div>
                  <button type="submit" className="w-full rounded-full bg-white py-4 text-sm font-medium text-black transition-transform hover:scale-[1.02]">
                    Вызвать специалистов
                  </button>
                  <p className="text-center text-[11px] text-[#333]">Все обращения строго конфиденциальны. Данные не передаются третьим лицам и удаляются сразу после выполнения заказа.</p>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}