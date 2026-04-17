import type { IRateMatchPayload } from '~/types/bemymateAPI/matches'
import { Match } from '~/server/models/match'
import { attachedLogger } from '~/server/consts/loggers'
import { wrapError } from '~/utils'
import type { H3Error } from 'h3'
import { StatusCodes } from 'http-status-codes'
import { createError, getQuery, readBody } from 'h3'

/**
 * Ручка для оценивания матчей;
 * В тело запроса кладутся оценки данным юзером других игроков (см. IRateMatchPayload)
 * в параметр запроса guid кладется guid игрока, совершающего оценку
 */
export default defineEventHandler(async (event): Promise<void | H3Error> => {
  const playerRates = await readBody<IRateMatchPayload>(event)
  const { guid } = getQuery(event)
  const { matchId } = event.context.params

  const { players: matchPlayerStats } = await wrapError(Match.findOne({ faceitId: matchId }, 'players').exec(), (err) => {
    attachedLogger.warn(`Specified match ${matchId} not found: ${err}`)
    return { players: null }
  })

  if (!matchPlayerStats) {
    attachedLogger.warn(`Match with the specified id has not been found`)
    return createError({
      statusCode: StatusCodes.NOT_FOUND,
      statusMessage: 'Match with the specified id has not been found',
    })
  }

  if (!matchPlayerStats.has(String(guid))) {
    attachedLogger.warn(`There is no user with such guid in the specified match: ${guid}`)
    return createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'There is no user with such guid in the specified match',
    })
  }

  const votingPlayer = matchPlayerStats.get(String(guid))
  if (votingPlayer.voted) {
    return createError({
      statusCode: StatusCodes.FORBIDDEN,
      statusMessage: 'This user has already rated the specified match',
    })
  }

  for (const [playerGuid, rates] of Object.entries(playerRates)) {
    const evaluatedPlayer = matchPlayerStats.get(playerGuid)
    if (!evaluatedPlayer) {
      continue
    }

    evaluatedPlayer.roleEvaluations.push(rates.roleRate)
    evaluatedPlayer.toxicEvaluations.push(rates.toxicRate)
    matchPlayerStats.set(playerGuid, evaluatedPlayer)
  }

  votingPlayer.voted = true
  matchPlayerStats.set(String(guid), votingPlayer)

  try {
    await Match.updateOne({ faceId: matchId }, {
      players: matchPlayerStats,
    })
  } catch (err) {
    attachedLogger.warn(`Failed to update rating for match ${matchId}: ${err}`)
  }
})
