const bcrypt = require('bcryptjs')
const prisma = require('../config/db')
const tokenService = require('./token.service')
const { z } = require('zod')

const registerSchema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const authService = {
  async register(data) {
    const parsed = registerSchema.parse(data)
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } })
    if (existing) {
      const err = new Error('Пользователь уже существует')
      err.status = 409
      throw err
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10)
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashedPassword,
        name: parsed.name,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    const tokens = tokenService.generateTokens({ userId: user.id, email: user.email, role: user.role })
    await tokenService.saveRefreshToken(user.id, tokens.refreshToken)

    return { user, ...tokens }
  },

  async login(data) {
    const parsed = loginSchema.parse(data)
    const user = await prisma.user.findUnique({ where: { email: parsed.email } })
    if (!user) {
      const err = new Error('Неверный email или пароль')
      err.status = 401
      throw err
    }

    const isValid = await bcrypt.compare(parsed.password, user.password)
    if (!isValid) {
      const err = new Error('Неверный email или пароль')
      err.status = 401
      throw err
    }

    const tokens = tokenService.generateTokens({ userId: user.id, email: user.email, role: user.role })
    await tokenService.saveRefreshToken(user.id, tokens.refreshToken)

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    }
  },

  async logout(refreshToken) {
    if (!refreshToken) return
    await tokenService.removeRefreshToken(refreshToken)
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      const err = new Error('Не авторизован')
      err.status = 401
      throw err
    }

    const tokenData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findRefreshToken(refreshToken)

    if (!tokenData || !tokenFromDb) {
      const err = new Error('Не авторизован')
      err.status = 401
      throw err
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenData.userId },
      select: { id: true, email: true, name: true, role: true },
    })

    const tokens = tokenService.generateTokens({ userId: user.id, email: user.email, role: user.role })
    await tokenService.saveRefreshToken(user.id, tokens.refreshToken)

    return { user, ...tokens }
  },
}

module.exports = authService