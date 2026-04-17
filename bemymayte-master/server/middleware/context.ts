import { COOKIES } from '~/consts'
import { attachedLogger } from '~/server/consts/loggers'
import { useCookie } from 'h3'

// мидлвэр используется для задания общего контекста для запросов,
// чтобы избежать выполнения одинаковых действия внутри самих эндпоинтов, куда направляется запрос
// например, выставляем тут куку с id пользователя
export default defineEventHandler((event) => {
  event.context.uidCookie = useCookie(event, COOKIES.uid) || null
  if (!event.context.uidCookie) {
    attachedLogger.warn('No uid cookie specified: it is either expired or not set yet')
  }
})
