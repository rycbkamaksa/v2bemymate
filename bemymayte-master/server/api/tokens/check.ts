import { User } from '~~/server/models/user'
import { stdLogger } from '~~/server/consts/loggers'
import { getQuery } from 'h3'
import mongoose from 'mongoose'

// Проверяет, жива ли текущая сессия (кука db_uid) — для кнопки «Продолжить как…».
// Сессию не выдаёт: новая кука ставится только после входа через FACEIT (tokens/issue)
export default defineEventHandler(async (event) => {
  const { uidCookie: uid } = event.context
  const { email } = getQuery(event)
  let acknowledged = false

  if (uid && mongoose.isValidObjectId(uid)) {
    try {
      const user = await User.findById(uid, 'email').exec()
      // e-mail из кэша клиента должен совпадать с владельцем сессии
      acknowledged = user !== null && (!email || user.email === String(email))
    } catch (e) {
      stdLogger.warn(`Failed to check session ${uid}: ${e}`)
    }
  }

  return {
    acknowledged,
  }
})
