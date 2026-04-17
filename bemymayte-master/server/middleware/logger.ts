import { stdLogger } from '~/server/consts/loggers'

export default defineEventHandler((e) => {
  stdLogger.info({
    method: e.req.method,
    message: ` --  ${e.req.url}`,
  })
})
