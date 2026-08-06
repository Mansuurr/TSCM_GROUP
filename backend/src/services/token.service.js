const jwt = require('jsonwebtoken')
const prisma = require('../config/db')

const tokenService = {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    })
    return { accessToken, refreshToken }
  },

  async saveRefreshToken(userId, token) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await prisma.refreshToken.deleteMany({ where: { userId } })
    return prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    })
  },

  async removeRefreshToken(token) {
    return prisma.refreshToken.deleteMany({ where: { token } })
  },

  async findRefreshToken(token) {
    return prisma.refreshToken.findUnique({ where: { token } })
  },

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch {
      return null
    }
  },

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch {
      return null
    }
  },
}

module.exports = tokenService