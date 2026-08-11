import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, ChevronDown, Check, ShieldCheck, Award, Users, Lock, Cpu } from 'lucide-react'
import api from '../services/api'
import Calculator from '../components/Calculator'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }),
}

const services = [
  { slug: 'cybersecurity', title: 'Кибербезопасность для бизнеса', desc: 'Защита цифрового периметра и предотвращение утечек данных' },
  { slug: 'car', title: 'Проверка автомобилей на слежку', desc: 'GPS-трекеры, маячки, скрытые камеры в салоне и под кузовом' },
  { slug: 'room', title: 'Проверка помещения', desc: 'Офисы, переговорные, квартиры и резиденции (TSCM)' },
  { slug: 'audit', title: 'Аудит технической защиты (ТЗИ)', desc: 'Комплексный анализ рисков и каналов утечки информации' },
]

const trustFactors = [
  {
    title: 'Принцип «Шредингера» для электроники: находим устройства в глубоком спящем режиме',
    subtitle: 'Поисковые работы нелинейными локаторами последнего поколения и тепловизорами высокого разрешения.',
    text: 'Большинство современных закладок работают импульсно: включаются на 3 секунды в сутки для передачи пакета данных, всё остальное время «спят» и не излучают радиосигнал. Обычные детекторы поля их не видят. Наш инженерный комплекс использует метод нелинейной локации. Мы посылаем зондирующий сигнал высокого уровня, который вызывает ответный отклик от любых полупроводников. Нам не важно, включено устройство или обесточено, вытащена ли батарейка — мы находим физическую электронную структуру внутри стен, мебели или бытовых приборов.',
  },
  {
    title: 'Полный спектральный анализ: радиоэфир под абсолютным контролем',
    subtitle: 'Непрерывный мониторинг частот от 0 до 24 ГГц с помощью программно-аппаратных комплексов.',
    text: 'Шпионские устройства давно вышли за пределы стандартных частот Wi-Fi или GSM. Для передачи информации применяются нестандартные протоколы, широкополосные сигналы (UWB), скачкообразное перестроение частоты и проводные каналы. Мы применяем профессиональные анализаторы спектра, которые фиксируют мельчайшие всплески радиоэфира в реальном времени и сравнивают каждый сигнал с локальным фоном помещения — это исключает ложные срабатывания и гарантирует обнаружение любых замаскированных передатчиков.',
  },
  {
    title: 'Строжайший протокол анонимности и юридический NDA',
    subtitle: 'Никакой маркировки на авто, выезд под видом IT-специалистов или клининга, подписание NDA до входа на объект.',
    text: 'Самый главный риск при проверке — дать понять злоумышленнику, что его закладку ищут. Если организатор атаки узнает о проверке, он дистанционно отключит устройство или удалит следы. Мы соблюдаем полный маскировочный протокол: специалисты прибывают на обычных гражданских автомобилях без брендинга, оборудование перевозится в незаметных кейсах. До начала любых манипуляций мы подписываем соглашение о неразглашении. Информацию о выезде знают только двое: вы и наш ведущий инженер.',
  },
  {
    title: 'Мультидисциплинарный опыт: инженеры, а не просто операторы приборов',
    subtitle: 'Комплексный бэкграунд сотрудников в сфере радиотехники, защиты информации и микроэлектроники.',
    text: 'Купить дорогой прибор может любой, но прибор не ищет — ищет инженер. Наша команда состоит из специалистов с профильным академическим образованием в области радиотехники и технической защиты информации. Мы понимаем физику распространения сигналов, акустические утечки через вентиляцию и металлоконструкции, схемы запитки от слаботочных сетей 220V и автомобильных бортовых компьютеров. Это позволяет находить закладки там, где остальные завершают осмотр.',
  },
  {
    title: 'Физический и оптический аудит скрытых объективов',
    subtitle: 'Применение оптических обнаружников с эффектом световозврата и досмотровых эндоскопов.',
    text: 'Миниатюрная пинхол-камера может быть вмонтирована в шляпку самореза, датчик дыма или интерьерную картину. Её невозможно обнаружить по радиоизлучению, если она пишет на внутреннюю карту памяти. Мы используем оптические поисковые приборы, работающие по принципу световозврата: прибор излучает световой поток, который отражается от матрицы видеокамеры независимо от её состояния. Дополнительно проводится досмотр подвесных потолков, вентиляционных шахт и кабель-каналов гибкими поворотными эндоскопами.',
  },
  {
    title: 'Исследование каналов акустической утечки (виброакустика)',
    subtitle: 'Защита от лазерных микрофонов, стетоскопов и утечек по технологическим пустотам.',
    text: 'Разговор в переговорной можно снять, не заходя в здание — например, с помощью лазерного микрофона, считывающего вибрацию оконного стекла, или через стетоскоп на инженерных трубах. Наш аудит включает оценку звукоизоляции помещения и проверку на виброакустические каналы утечки. Мы замеряем уровень прохождения звука через стены, перекрытия, окна и трубы. В случае обнаружения слабых мест мы не просто фиксируем факт, но и проектируем системы генерации акустических и виброакустических помех для нейтрализации съёма.',
  },
  {
    title: 'Проверка бортовых систем и электроники автотранспорта',
    subtitle: 'Полный демонтаж обшивки (при необходимости), поиск GPS-трекеров, спящих маяков и микрофонов.',
    text: 'Автомобиль — наиболее уязвимая точка для съёма информации и отслеживания перемещений. Простая проверка под капотом не даёт результатов. Мы проводим детальный осмотр авто: сканирование CAN-шины, досмотр пространства под торпедой, бамперами, подкрылками, сиденьями и в элементах освещения. Используются нелинейные локаторы для поиска отключённых GPS-трекеров и специализированные сканеры, выявляющие устройства, питающиеся от штатной электропроводки автомобиля.',
  },
  {
    title: 'Итоговый инженерный отчёт со статусом юридического документа',
    subtitle: 'Выдача официального акта, карты уязвимостей и пошагового регламента по техзащите.',
    text: 'По окончании работ вы получаете не просто устное «всё чисто», а подробный технический отчёт. В нём фиксируется карта проверенных частот, результаты оптического и нелинейного сканирования, обнаруженные уязвимости в инфраструктуре и список извлечённых устройств (если таковые были). Документ содержит рекомендации по модернизации системы безопасности, регламенту работы персонала и настройке режимов конфиденциальности для предотвращения повторных атак.',
  },
]

const checkTags = ['Кабинеты руководства', 'Переговорные комнаты', 'Корпоративные автомобили', 'Инженерные сети', 'Освещение и розетки', 'Мебель и предметы интерьера', 'Бизнес-подарки']

const detectList = ['Скрытые видеокамеры', 'Микрофоны и диктофоны', 'GPS-трекеры', 'Радио- и GSM-закладки', 'Несанкционированные передатчики данных']

const processSteps = [
  { n: '01', title: 'Подписание NDA', text: 'Согласование деталей и подписание соглашения о неразглашении' },
  { n: '02', title: 'Выезд в нерабочее время', text: 'Инженеры прибывают в удобное для вас время, чтобы соблюсти тишину и анонимность' },
  { n: '03', title: 'Инструментальное обследование', text: 'Полная проверка объекта сертифицированным оборудованием' },
  { n: '04', title: 'Фиксация результатов', text: 'Аномалии и результаты радиомониторинга документируются' },
]

const standards = [
  { icon: Award, text: 'Сертифицированные специалисты' },
  { icon: ShieldCheck, text: 'Лицензированная деятельность' },
  { icon: Users, text: 'Опыт работы с крупным B2B-сегментом' },
  { icon: Lock, text: 'Абсолютная конфиденциальность' },
  { icon: Cpu, text: 'Профессиональные аппаратные комплексы' },
]

const stats = [
  { value: '10+ лет', label: 'Средний опыт инженеров', text: 'Все специалисты имеют профильное высшее радиотехническое образование и практический бэкграунд в сфере технической защиты информации.' },
  { value: '1 200+', label: 'Обследованных объектов и авто', text: 'Защищённых переговорных комнат, офисов топ-менеджмента, частных резиденций и представительских автомобилей.' },
  { value: '100%', label: 'Засечка полупроводников', text: 'Нелинейные локаторы находят любые микросхемы и транзисторы — даже если устройство сломано, выключено или в спящем режиме.' },
  { value: '2 часа', label: 'Время экстренного выезда', text: 'Готовность мобильной группы к выезду 24/7, под видом IT-специалистов или технической службы.' },
  { value: '120 мин', label: 'Глубокий аудит на 100 м²', text: 'Реальный инженерный норматив: радиомониторинг эфира, нелинейная локация, тепловизионный и оптический анализ.' },
]

const faqItems = [
  { q: 'Как быстро вы можете выехать на объект?', a: 'Мобильная группа готова к выезду 24/7. При наличии обоснованных подозрений на слежку экстренный выезд организуется в течение 2 часов.' },
  { q: 'Узнает ли кто-то о том, что проводится проверка?', a: 'Нет. Мы соблюдаем полный маскировочный протокол: гражданские автомобили без брендинга, оборудование в незаметных кейсах, выезд под видом IT-специалистов или клининга. Информацию о выезде знаете только вы и ведущий инженер.' },
  { q: 'Можно ли найти выключенное или неактивное устройство?', a: 'Да. Метод нелинейной локации находит физическую электронную структуру устройства независимо от того, включено оно, обесточено или в спящем режиме.' },
  { q: 'Что я получаю по итогам проверки?', a: 'Официальный технический отчёт с картой проверенных частот, результатами сканирования, списком обнаруженных уязвимостей (если таковые были) и рекомендациями по защите.' },
  { q: 'Работаете ли вы за пределами Астаны?', a: 'Да, мы работаем по всему Казахстану. Уточните ваш город при оформлении заявки.' },
  { q: 'Как оформляются отношения — есть ли договор?', a: 'Перед началом работ мы подписываем соглашение о неразглашении (NDA). Все обращения строго конфиденциальны, данные не передаются третьим лицам.' },
]

const galleryItems = [
  { image: '/1a.jpg', label: 'Нелинейный локатор в работе' },
  { image: '/1b.png', label: 'Сканирование радиочастотного эфира' },
  { image: '/1c.png', label: 'Проверка автомобиля на GPS-маяки' },
  { image: '/1d.png', label: 'Поиск замаскированных микрокамер' },
]

export default function Home() {
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizDone, setQuizDone] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState(null)
  const [openFactor, setOpenFactor] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    api.get('/quiz/questions').then(({ data }) => setQuizQuestions(data)).catch(() => {})
  }, [])

  const handleQuizAnswer = async (optionIndex) => {
    const currentQuestion = quizQuestions[quizStep]
    const newAnswers = { ...quizAnswers, [currentQuestion.id]: optionIndex }
    setQuizAnswers(newAnswers)

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
      return
    }

    setQuizLoading(true)
    setQuizError(null)
    try {
      const { data } = await api.post('/quiz/submit', { answers: newAnswers })
      setQuizResult(data)
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
    <div className="relative w-full bg-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid absolute inset-0" />
        <div className="glow-orb" />
      </div>

      <div className="relative z-10 w-full">
        {/* HERO */}
        <section className="flex w-full flex-col items-center justify-center px-6 pb-28 pt-20 text-center md:pt-28">
          <motion.p custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-6 text-xs font-medium tracking-[0.3em] text-[#5c5c58] uppercase">
            Физическая безопасность
          </motion.p>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="font-display max-w-[820px] text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.05] tracking-tight text-[#111]">
            Профессиональный поиск жучков и защита от слежки
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="mt-8 max-w-[520px] text-base leading-relaxed text-[#5c5c58]">
            Проверка помещений, автомобилей и офисов сертифицированным оборудованием. Гарантируем конфиденциальность и выявление любых каналов утечки информации.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/request" className="rounded-full bg-[#14804f] px-8 py-3.5 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-[#0e5c39]">
              Оставить заявку
            </Link>
            <a href="#quiz" className="flex items-center justify-center gap-2 rounded-full border border-[#d9d8d3] px-8 py-3.5 text-sm text-[#111] transition-all hover:border-[#14804f] hover:text-[#14804f]">
              Пройти тест <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </section>

        {/* О НАС */}
        <section className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[900px] text-center">
            <p className="mb-6 text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">О нас</p>
            <p className="text-lg leading-relaxed text-[#333] md:text-xl">
              Мы — специализированная команда инженеров, радиотехников и специалистов по кибербезопасности. Наша миссия — исключить любые формы промышленного шпионажа, несанкционированного съёма информации и цифровых атак на ваш бизнес и личную жизнь.
            </p>
            <p className="mt-6 text-base leading-relaxed text-[#5c5c58]">
              В отличие от компаний, использующих бытовые детекторы поля, мы подходим к защите информации как к сложному физико-техническому процессу. В нашем распоряжении — программно-аппаратные комплексы экспертного уровня, нелинейные локаторы последней серии, анализаторы спектра и оптические системы обнаружения. Мы не просто находим шпионские устройства — мы выявляем и перекрываем каналы утечки данных ещё до того, как они нанесут ущерб.
            </p>
            <p className="mt-8 text-sm font-medium uppercase tracking-wider text-[#14804f]">Работаем по всему Казахстану</p>
          </div>
        </section>

        {/* ПОЧЕМУ НАМ ДОВЕРЯЮТ — 8 факторов, аккордеон */}
        <section className="w-full bg-[#f7f7f5] px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[900px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-4 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Почему нам доверяют
            </motion.h2>
            <p className="mb-14 text-center font-display text-2xl text-[#111] md:text-3xl">8 ключевых факторов</p>

            <div className="space-y-3">
              {trustFactors.map((f, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-[#e3e2de] bg-white">
                  <button
                    onClick={() => setOpenFactor(openFactor === i ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  >
                    <div>
                      <span className="text-xs font-medium text-[#14804f]">0{i + 1}</span>
                      <h3 className="mt-1 text-base font-medium text-[#111]">{f.title}</h3>
                      {openFactor !== i && <p className="mt-1 text-sm text-[#888]">{f.subtitle}</p>}
                    </div>
                    <ChevronDown className={`mt-1 h-5 w-5 flex-shrink-0 text-[#888] transition-transform ${openFactor === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFactor === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="px-6 pb-6">
                          <p className="mb-3 text-sm font-medium text-[#5c5c58]">{f.subtitle}</p>
                          <p className="text-sm leading-relaxed text-[#5c5c58]">{f.text}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* УСЛУГИ */}
        <section className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Услуги
            </motion.h2>

            <div className="grid gap-8 sm:grid-cols-2">
              {services.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  onMouseMove={handleCardMouseMove}
                  className="spotlight-card group rounded-2xl border border-[#e3e2de] bg-white p-8 transition-all duration-500 hover:border-[#14804f]/40"
                >
                  <h3 className="mb-2 text-lg font-medium text-[#111]">{s.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-[#5c5c58]">{s.desc}</p>
                  <Link to={`/services/${s.slug}`} className="text-sm font-medium text-[#14804f] hover:underline">
                    Подробнее →
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="mb-6 text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">Что проверяем</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {checkTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#e3e2de] bg-[#f7f7f5] px-4 py-2 text-sm text-[#333]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="mb-6 text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">Что выявляем</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {detectList.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#14804f]/10 px-4 py-2 text-sm font-medium text-[#0e5c39]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* КАК ПРОХОДИТ РАБОТА */}
        <section className="w-full bg-[#f7f7f5] px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1000px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Как проходит работа
            </motion.h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <motion.div key={step.n} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <span className="font-display text-4xl text-[#14804f]">{step.n}</span>
                  <h3 className="mt-3 mb-2 text-base font-medium text-[#111]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5c5c58]">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* СТАТИСТИКА */}
        <section className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Мы накопили серьёзный опыт
            </motion.h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onMouseMove={handleCardMouseMove}
                  className="spotlight-card rounded-2xl border border-[#e3e2de] bg-white p-6"
                >
                  <p className="font-display text-3xl text-[#14804f]">{s.value}</p>
                  <p className="mt-2 text-sm font-medium text-[#111]">{s.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#888]">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* СТАНДАРТЫ */}
        <section className="w-full bg-[#0e5c39] px-6 py-14">
          <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {standards.map((s) => (
              <div key={s.text} className="flex items-center gap-2 text-sm text-white/90">
                <s.icon className="h-4 w-4 text-white/70" />
                {s.text}
              </div>
            ))}
          </div>
        </section>

        {/* ОБОРУДОВАНИЕ */}
        <section className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Работаем с современным оборудованием
            </motion.h2>
            <p className="mb-16 text-center text-[#5c5c58] md:text-lg">
              Наша техническая оснащённость позволяет выявлять любые виды закладок, маяков и каналов утечки информации — от аналоговых устройств до цифровых инструментов.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center"
              >
                <p className="text-sm font-medium text-[#14804f]">Нелинейные локаторы</p>
                <p className="mt-3 text-xs leading-relaxed text-[#5c5c58]">Обнаружение любых полупроводников независимо от состояния питания</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center"
              >
                <p className="text-sm font-medium text-[#14804f]">Анализаторы спектра</p>
                <p className="mt-3 text-xs leading-relaxed text-[#5c5c58]">Мониторинг диапазона 0–24 ГГц для выявления радиопередатчиков</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center"
              >
                <p className="text-sm font-medium text-[#14804f]">Оптические системы</p>
                <p className="mt-3 text-xs leading-relaxed text-[#5c5c58]">Обнаружение скрытых видеокамер и оптических каналов съёма</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center"
              >
                <p className="text-sm font-medium text-[#14804f]">Тепловизоры</p>
                <p className="mt-3 text-xs leading-relaxed text-[#5c5c58]">Поиск активных устройств по тепловому излучению</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center"
              >
                <p className="text-sm font-medium text-[#14804f]">Виброакустические датчики</p>
                <p className="mt-3 text-xs leading-relaxed text-[#5c5c58]">Оценка защиты от лазерных микрофонов и съёма по трубам</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center"
              >
                <p className="text-sm font-medium text-[#14804f]">Сканеры CAN-шины</p>
                <p className="mt-3 text-xs leading-relaxed text-[#5c5c58]">Диагностика электроники автомобилей на предмет закладок</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* СЕРТИФИКАТЫ И ЛИЦЕНЗИИ */}
        <section className="w-full bg-[#f7f7f5] px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Сертификаты и лицензии
            </motion.h2>
            <p className="mb-16 text-center text-sm text-[#5c5c58]">Наша деятельность соответствует требованиям законодательства Республики Казахстан в области технической защиты информации.</p>
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="rounded-2xl border border-[#e3e2de] bg-white p-8 text-center">
                <p className="text-sm font-medium text-[#111]">Лицензия на проведение TSCM-аудитов</p>
                <p className="mt-2 text-xs text-[#888]">В процессе получения</p>
              </div>
              <p className="text-xs text-[#666]">Дополнительные сертификаты будут добавлены после получения документов от органов сертификации</p>
            </div>
          </div>
        </section>

        {/* ГАЛЕРЕЯ */}
        <section className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[1200px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Галерея
            </motion.h2>

            <div className="grid gap-8 sm:grid-cols-2">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onMouseMove={handleCardMouseMove}
                  className="spotlight-card overflow-hidden rounded-2xl border border-[#e3e2de] bg-white"
                >
                  <img src={item.image} alt={item.label} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  <div className="p-6">
                    <p className="text-sm text-[#5c5c58]">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* КАЛЬКУЛЯТОР */}
        <section id="calculator" className="w-full bg-[#f7f7f5] px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[600px]">
            <h2 className="mb-4 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">Предварительный аудит</h2>
            <p className="mb-12 text-center text-[#5c5c58]">Ответьте на 5 вопросов, чтобы мы сформировали состав поисковой группы под вашу задачу</p>
            <Calculator />
          </div>
        </section>

        {/* КВИЗ */}
        <section id="quiz" className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[600px]">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="mb-4 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">Экспресс-аудит безопасности</h2>
              <p className="mb-2 text-center text-lg font-medium text-[#111]">Есть ли за вами или вашим офисом наблюдение?</p>
              <p className="mb-12 text-center text-[#5c5c58]">Ответьте "Да" или "Нет" на 10 контрольных вопросов, чтобы оценить риск утечки информации и наличие скрытых закладок.</p>

              <div className="rounded-3xl border border-[#e3e2de] bg-white p-8 md:p-10">
                {quizQuestions.length === 0 ? (
                  <p className="text-center text-sm text-[#888]">Загрузка...</p>
                ) : !quizDone ? (
                  <AnimatePresence mode="wait">
                    <motion.div key={quizStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                      <div className="mb-8 flex items-center justify-between">
                        <span className="text-xs text-[#888]">Вопрос {quizStep + 1} из {quizQuestions.length}</span>
                        <div className="flex gap-1">
                          {quizQuestions.map((_, i) => (
                            <div key={i} className={`h-1 w-4 rounded-full ${i <= quizStep ? 'bg-[#14804f]' : 'bg-[#e3e2de]'}`} />
                          ))}
                        </div>
                      </div>
                      <h3 className="mb-8 text-lg font-medium leading-relaxed text-[#111]">{quizQuestions[quizStep].question}</h3>
                      <div className="space-y-3">
                        {quizQuestions[quizStep].options.map((opt, i) => (
                          <button
                            key={i}
                            disabled={quizLoading}
                            onClick={() => handleQuizAnswer(i)}
                            className="flex w-full items-center justify-between rounded-xl border border-[#e3e2de] bg-[#f7f7f5] px-6 py-4 text-left text-sm text-[#333] transition-all hover:border-[#14804f] hover:bg-[#14804f]/5 disabled:opacity-40"
                          >
                            {opt}
                            <ChevronRight className="h-4 w-4 text-[#888]" />
                          </button>
                        ))}
                      </div>
                      {quizLoading && <p className="mt-6 text-center text-xs text-[#888]">Считаем результат...</p>}
                      {quizError && <p className="mt-6 text-center text-xs text-red-500">{quizError}</p>}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${quizResult.riskLevel === 'high' ? 'bg-red-50 text-red-500' : quizResult.riskLevel === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-[#14804f]'}`}>
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl font-medium text-[#111]">
                      {quizResult.riskLevel === 'high' ? '🔴' : quizResult.riskLevel === 'medium' ? '🟠' : '🟢'} {quizResult.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-[#5c5c58]">{quizResult.text}</p>

                    {quizResult.warning && (
                      <p className="mb-8 rounded-xl bg-red-50 px-5 py-3 text-xs font-medium text-red-600">{quizResult.warning}</p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Link to="/request" className="rounded-full bg-[#14804f] px-6 py-3 text-sm font-medium text-white">{quizResult.cta}</Link>
                      <button onClick={resetQuiz} className="rounded-full border border-[#e3e2de] px-6 py-3 text-sm text-[#333] hover:border-[#14804f]">Пройти заново</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ФОРМА ЗАЯВКИ */}
        {/* ФОРМА ЗАЯВКИ */}
<section className="w-full px-6 py-24 md:py-28">
  <div className="mx-auto w-full max-w-[1200px]">
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[#e3e2de] bg-[#f7f7f5] p-8 text-center md:p-16">
      <div className="mx-auto w-full max-w-[500px]">
        <h2 className="text-center text-2xl font-light text-[#111] md:text-3xl">Заказать конфиденциальную проверку</h2>
        <p className="mt-4 text-center text-sm text-[#5c5c58]">Опишите ситуацию. Мы свяжемся с вами в защищённом канале связи в течение 10 минут.</p>
        <Link to="/request" className="mt-10 inline-block rounded-full bg-[#14804f] px-10 py-4 text-sm font-medium text-white transition-transform hover:scale-[1.02] hover:bg-[#0e5c39]">
          Оставить заявку
        </Link>
        <p className="mt-6 text-center text-[11px] text-[#aaa]">Все обращения строго конфиденциальны. Данные не передаются третьим лицам.</p>
      </div>
    </motion.div>
  </div>
</section>

        {/* FAQ */}
        <section className="w-full px-6 py-24 md:py-28">
          <div className="mx-auto w-full max-w-[800px]">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 text-center text-xs font-medium tracking-[0.25em] text-[#5c5c58] uppercase">
              Частые вопросы
            </motion.h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-[#e3e2de]">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-medium text-[#111]">{item.q}</span>
                    <ChevronDown className={`h-4 w-4 flex-shrink-0 text-[#888] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <p className="px-6 pb-5 text-sm leading-relaxed text-[#5c5c58]">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}