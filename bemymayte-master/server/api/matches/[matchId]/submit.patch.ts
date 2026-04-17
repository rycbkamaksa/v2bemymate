// эта ручка будет добавлять матч в рейтинги

import { wrapError } from '~/utils'
import { Match } from '~/server/models/match'
import { attachedLogger, stdLogger } from '~/server/consts/loggers'
import { createError } from 'h3'
import { StatusCodes } from 'http-status-codes'
import { RoleRates } from '~/types/bemymateAPI/matches'
import { Stat } from '~/server/models/stat'

export default defineEventHandler(async (event) => {
  const { matchId = null } = event.context.params

  const { players: playersMatchStats } = await wrapError(Match.findOne({ faceitId: matchId }, 'players').exec(), (err) => {
    attachedLogger.warn(`Specified match ${matchId} not found: ${err}`)
    return { players: null }
  })

  if (!playersMatchStats) {
    return createError({
      statusCode: StatusCodes.NOT_FOUND,
      statusMessage: 'Match with the specified id has not been found',
    })
  }

  let modified = false
  for (const [guid, playerRates] of playersMatchStats.entries()) {
    if (playerRates.voted) {
      continue
    }

    for (const [mateGuid, matePlayerRates] of playersMatchStats.entries()) {
      if (mateGuid === guid) {
        continue
      }

      matePlayerRates.roleEvaluations.push(RoleRates.Ok)
      matePlayerRates.toxicEvaluations.push(RoleRates.Ok)
    }

    playerRates.voted = true
    modified = true
  }

  if (modified) {
    const { matchedCount } = await Match.updateOne({ faceitId: matchId }, {
      players: playersMatchStats,
    })

    if (matchedCount === 0) {
      attachedLogger.warn(`Failed to update match ${matchId}`)
    }
  }

  const statsUpdatePromises = []
  for (const [playerGuid, stats] of playersMatchStats.entries()) {
    statsUpdatePromises.push(async () => {
      const { [stats.role]: prevStats } = await wrapError(Stat.findOne({ guid: playerGuid }, `${stats.role}`).exec(), (err) => {
        stdLogger.error(`Failed to update ${playerGuid} player's stats after match ${matchId}: ${err}`)
        return {
          [stats.role]: null
        }
      })

      const curMeanRate = stats.roleEvaluations.reduce((ovSum, curVal) => ovSum + curVal, 0) / stats.roleEvaluations.length
      const curMeanToxicRate = stats.toxicEvaluations.reduce((ovSum, curVal) => ovSum + curVal, 0) / stats.toxicEvaluations.length

      prevStats.rating = (prevStats.rating * (prevStats.wins + prevStats.loses - 1) + curMeanRate) / (prevStats.wins + prevStats.loses)
      prevStats.toxicRate = (prevStats.toxicRate * (prevStats.wins + prevStats.loses - 1) + curMeanToxicRate) / (prevStats.wins + prevStats.loses)

      if (prevStats.toxicRate < 3 && curMeanRate < prevStats.rating) {
        prevStats.banCnt++
      }

      if (prevStats.lastGames.length >= 5) {
        prevStats.lastGames.shift()
      }

      prevStats.lastGames.push(curMeanToxicRate)

      Stat.updateOne({ guid: playerGuid }, {
        [stats.role]: prevStats,
      })
        .then(() => {
          stdLogger.info(`Successfully updated ${playerGuid} player's stats after match ${matchId}`)
        })
        .catch((err) => {
          stdLogger.error(`Failed to update ${playerGuid} player's stats after match ${matchId}: ${err}`)
        })
    })
  }

  // нам не нужно ждать исполнение этих промисов в данном хендлере, достаточно просто их запустить
  statsUpdatePromises.map(updater => updater())
})
