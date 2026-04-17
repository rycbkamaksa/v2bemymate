import { ROUTES } from '~/consts'
import { attachedLogger, stdLogger } from '~/server/consts/loggers'
import { RouteMatches, wrapError } from '~/utils'
import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  // мидлвэр должен отрабатывать для рутов, требующих взаимодействия с бд
  if (!RouteMatches(event.req.url, ROUTES.withDbAccess)) {
    attachedLogger.info('Requested endpoint is not listed among db-interacting routes')
    return
  }

  // если соединение уже установлено / устанавливается => просто выйти
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return
  }

  const { dbUrl } = useRuntimeConfig()
  await wrapError(mongoose.connect(dbUrl), (err) => {
    stdLogger.warn(`Error connecting to mongodb ${err}`)
    // TODO: render an error page as its a critical error
  })
  attachedLogger.info(`Mongo connection status: ${mongoose.ConnectionStates[mongoose.connection.readyState]}`)
})
