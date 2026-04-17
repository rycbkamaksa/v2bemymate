import { api } from '~/services/api'
import { wrapError } from '~/utils'
import { attachedLogger } from '~/server/consts/loggers'

export default defineEventHandler(async (event) => {
  const { faceitId } = event.context.params

  const { matches } = await wrapError(api.getPlayersStats(faceitId), (err) => {
    attachedLogger.warn(`Couldn't fetch player's matches count: ${err}`)
    return { matches: 0 }
  })

  return matches
})
