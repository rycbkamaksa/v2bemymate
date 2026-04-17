import { COOKIES } from '~/consts'
import { deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  // удаляем куку, чтобы юзер не выполнял автоматический вход
  deleteCookie(event, COOKIES.uid)
  return {
    msg: 'Successfully logged out',
  }
})
