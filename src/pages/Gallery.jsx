import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const galleryItems = [
  { video: '/Specialist_sweeping_detector_aloΓÇª_202608182353.mp4', label: 'Поиск скрытых устройств ручным детектором' },
  { video: '/Monitoring_dashboard_screen_dispΓÇª_202608201847.mp4', label: 'Мониторинг и анализ сигналов' },
  { video: '/Inspecting_car_door_sill_202608212035.mp4', label: 'Осмотр автомобиля на скрытые устройства' },
  { video: '/Docking_station_circuit_board_viΓÇª_202608200525.mp4', label: 'Диагностика электронной платы' },
  { video: '/Gloved_hands_holding_smoke_detector_202608212035.mp4', label: 'Детальный осмотр дымового датчика' },
  { video: '/Gloved_hands_sweeping_detector_oΓÇª_202608182155.mp4', label: 'Сканирование объекта детектором' },
  { video: '/Hand_removing_smoke_detector_cover_202608172145.mp4', label: 'Вскрытие и проверка корпуса датчика' },
]

const loopedGalleryItems = [...galleryItems, ...galleryItems, ...galleryItems]

export default function Gallery() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const getCardSpan = () => {
      const firstCard = track.firstElementChild
      if (!firstCard) return 0

      const styles = window.getComputedStyle(track)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      return firstCard.getBoundingClientRect().width + gap
    }

    const alignToMiddleBlock = () => {
      const cardSpan = getCardSpan()
      if (!cardSpan) return
      track.scrollLeft = cardSpan * galleryItems.length
    }

    const handleScroll = () => {
      const cardSpan = getCardSpan()
      if (!cardSpan) return

      const blockWidth = cardSpan * galleryItems.length
      const leftEdge = blockWidth * 0.5
      const rightEdge = blockWidth * 2.5

      if (track.scrollLeft <= leftEdge) {
        track.scrollLeft += blockWidth
      } else if (track.scrollLeft >= rightEdge) {
        track.scrollLeft -= blockWidth
      }
    }

    alignToMiddleBlock()
    track.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', alignToMiddleBlock)

    return () => {
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', alignToMiddleBlock)
    }
  }, [])

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const scrollTrack = (direction) => {
    const track = trackRef.current
    if (!track) return

    const amount = Math.min(track.clientWidth * 0.9, 420)
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="relative w-full bg-[#050807] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-center text-4xl text-white">
          Галерея
        </motion.h1>
        <p className="mt-4 text-center text-white/70">Видео процесса работы и технических проверок</p>
        <div className="mt-12 flex items-center justify-center gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => scrollTrack(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1110] text-white/75 transition-colors hover:border-[#79f2bf] hover:text-white"
            aria-label="Прокрутить галерею влево"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1110] text-white/75 transition-colors hover:border-[#79f2bf] hover:text-white"
            aria-label="Прокрутить галерею вправо"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div
          ref={trackRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loopedGalleryItems.map((item, i) => (
            <motion.div
              key={`${item.video}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % galleryItems.length) * 0.06 }}
              onMouseMove={handleCardMouseMove}
              className="spotlight-card w-[85vw] min-w-[85vw] snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#0d1110] sm:w-[420px] sm:min-w-[420px]"
            >
              <video
                src={item.video}
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={item.label}
              />
              <div className="p-6">
                <p className="text-sm text-white/70">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}