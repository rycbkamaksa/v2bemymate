import { attachedLogger } from '../consts/loggers'
import { Email } from '../models/mails'
import { wrapError } from '~/utils'

export default defineEventHandler(async (event) => {
  const { email } = getQuery(event)

  const res = await wrapError(new Email({ email }).save(), (err) => {
    attachedLogger.warn(`Failed to save email ${email}: ${err}`)
    return null
  })

  if (res) {
    attachedLogger.info(`Saved mail ${email}`)
  }

  return {
    success: Boolean(res),
  }
})
