const prisma = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')

const QUESTIONS = [
  {
    id: 1,
    question: 'Проводили ли вы проверку помещения на прослушку за последний год?',
    options: ['Да', 'Нет', 'Не помню'],
    risk: [0, 2, 1],
  },
  {
    id: 2,
    question: 'Есть ли у вас конфиденциальные переговоры в офисе?',
    options: ['Да, регулярно', 'Иногда', 'Нет'],
    risk: [2, 1, 0],
  },
  {
    id: 3,
    question: 'Замечали ли вы посторонние шумы или эхо в телефоне?',
    options: ['Да, часто', 'Бывало', 'Нет'],
    risk: [2, 1, 0],
  },
  {
    id: 4,
    question: 'Есть ли у вас подозрения на слежку за автомобилем?',
    options: ['Да', 'Не уверен', 'Нет'],
    risk: [2, 1, 0],
  },
  {
    id: 5,
    question: 'Меняли ли вы пароли Wi-Fi и доступы за последние 6 месяцев?',
    options: ['Да', 'Нет', 'Не помню'],
    risk: [0, 2, 1],
  },
]

const CHECKLIST = [
  'Неожиданные звуки или щелчки в телефоне',
  'Быстрая разрядка батареи телефона',
  'Посторонние шумы в помещении',
  'Неизвестные устройства в розетках',
  'Странное поведение электроники',
  'Признаки вскрытия дверей/окон',
  'Обнаружение незнакомых предметов',
]

const quizController = {
  getQuestions: asyncHandler(async (req, res) => {
    
    const safeQuestions = QUESTIONS.map(({ id, question, options }) => ({
      id,
      question,
      options,
    }))
    res.json(safeQuestions)
  }),

  submit: asyncHandler(async (req, res) => {
    const { email, answers } = req.body

    let score = 0
    for (const q of QUESTIONS) {
      const answerIndex = answers[q.id]
      if (answerIndex !== undefined && q.risk[answerIndex] !== undefined) {
        score += q.risk[answerIndex]
      }
    }

    let riskLevel = 'low'
    if (score >= 7) riskLevel = 'high'
    else if (score >= 4) riskLevel = 'medium'

    const result = await prisma.quizResult.create({
      data: {
        email: email || null,
        answers: JSON.stringify(answers),
        score,
        riskLevel,
        checklist: JSON.stringify(CHECKLIST),
      },
    })

    res.json({
      score,
      riskLevel,
      riskLevelText:
        riskLevel === 'high'
          ? 'Высокий риск. Рекомендуем срочную проверку.'
          : riskLevel === 'medium'
          ? 'Средний риск. Рекомендуем профилактический аудит.'
          : 'Низкий риск. Вы в безопасности, но профилактика не помешает.',
      checklist: CHECKLIST,
      resultId: result.id,
    })
  }),

  getResults: asyncHandler(async (req, res) => {
    const results = await prisma.quizResult.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(results)
  }),
}

module.exports = quizController