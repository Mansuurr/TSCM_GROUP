import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Contacts() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-4xl font-light text-white">
        Контакты
      </motion.h1>
      <div className="mt-20 space-y-8">
        {[
          { icon: Phone, label: 'Телефон', value: '+7 (XXX) XXX-XX-XX' },
          { icon: Mail, label: 'Email', value: 'info@tscm-group.ru' },
          { icon: MapPin, label: 'Адрес', value: 'Москва, ул. Примерная, 1' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-6 rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] p-6"
          >
            <item.icon className="h-5 w-5 text-[#666]" />
            <div>
              <p className="text-xs uppercase tracking-wider text-[#555]">{item.label}</p>
              <p className="mt-1 text-lg text-white">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}