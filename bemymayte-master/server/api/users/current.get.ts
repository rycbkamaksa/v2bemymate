import { User } from '~/server/models/user'
import { attachedLogger } from '~/server/consts/loggers'

// Возвращает основную информацию про текущего пользователя по куке
// может использоваться, чтобы, например, пропатчить юзер стейт
export default defineEventHandler((event) => {
  const { uidCookie: uid } = event.context
  attachedLogger.info(`Looking up info for the current user: id - ${uid}`)
  return User.findById(uid, 'picture email birthdate nickname locale guid').exec()
})
