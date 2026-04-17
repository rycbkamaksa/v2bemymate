import type { ICheckStatusPayload } from '~/types/bemymateAPI/matches'
import type { IBemyMateMatchStat } from '~/server/models/match'
import { MatchStatus } from '~/types/faceitAPI/data/match'
import { Match } from '~/server/models/match'
import { Stat } from '~/server/models/stat'
import { attachedLogger, stdLogger } from '~/server/consts/loggers'
import { api } from '~/services/api'
import { wrapError } from '~/utils'
import { StatusCodes } from 'http-status-codes'
import { getQuery, readBody, createError, H3Error } from 'h3'

/**
 * Ручка для проверки показа оценки;
 * Eсли возвращается непустая строка (id матча, его нужно будет сохранить на клиенте), то можно показывать оценку,
 * иначе - матч еще не состоялся;
 * В тело запроса кладется массив игроков команды (см. ICheckStatusPayload)
 * в параметр запроса guid кладется guid игрока, запросившего проверку
 */
export default defineEventHandler(async (event): Promise<string | H3Error> => {
  const { players } = await readBody<ICheckStatusPayload>(event)
  const { test } = getQuery(event)
  attachedLogger.info(`Checking match status for players: ${[...players.map(pl => pl.playerGuid)]}`)

  if (players.length === 0) {
    return createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'No players specified in the body',
    })
  }

  const testMode = test !== undefined
  const testedGuid = testMode ? '4cd0d638-8cf3-4770-8b44-d6576f69d2a5' : players[0].playerGuid
  let items = await api.getPlayersMatches(testedGuid, 1)
  if (items.length === 0) {
    // @ts-ignore
    items = [{ match_id: null, status: null, playing_players: null }]
  }

  const [{ match_id, status, playing_players }] = items

  const isInDb = await wrapError(Match.findOne({ faceitId: match_id }, 'faceitId status').exec(), (err) => {
    attachedLogger.warn(`Failed to find match ${match_id}: ${err}`)
    return null
  })

  if (!isInDb && (status === MatchStatus.Configuring || status === MatchStatus.Ready)) {
    const newMatch = new Match({
      faceitId: match_id,
      status: 'started',
      map: '',
      players: {},
    })

    for (const { playerGuid } of players) {
      if (!playing_players.includes(playerGuid)) {
        return null
      }
    }

    const savedMatch = await wrapError(newMatch.save(), (err) => {
      attachedLogger.warn(`Failed to add new match to db: ${err}`)
      return null
    })

    // TODO: refactor
    if (savedMatch) {
      return 'start'
    }
  } else if (testMode || (isInDb.status === 'started' && status === MatchStatus.Finished)) {
    const [matchStats] =  await wrapError(api.getMatchStats(match_id), (err) => {
      attachedLogger.warn(`Failed to fetch ${match_id} stats: ${err}`)
      return [null]
    })

    if (!matchStats) {
      return createError({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        statusMessage: 'Associated match stats from faceit are unavailable',
      })
    }

    const playerTeam =
      matchStats.teams[0].players.some(({ player_id }) => player_id === players[0].playerGuid) ?
      matchStats.teams[0] :
      matchStats.teams[1]

    const playersMatchStats = {} as Record<string, IBemyMateMatchStat>
    players.forEach(({ playerGuid, role }) => {
      const associatedStats = playerTeam.players.find(({ player_id }) => player_id === playerGuid)?.player_stats
      if (!associatedStats) {
        return
      }

      playersMatchStats[playerGuid] = {
        winner: associatedStats.Result === '1',
        role: role,
        kills: Number(associatedStats.Kills),
        deaths: Number(associatedStats.Deaths),
        assists: Number(associatedStats.Assists),
        toxicEvaluations: [],
        roleEvaluations: [],
        voted: false,
      }
    })

    if (testMode) {
      await wrapError(new Match({
        faceitId: match_id,
        status: 'started',
        players: {},
      }).save(), (err) => {
        attachedLogger.warn(`Failed to save mock match ${match_id}: ${err}`)
      })
    }

    const { matchedCount } = await Match.updateOne({ faceitId: match_id }, {
      status: 'finished',
      map: matchStats.round_stats.Map,
      players: playersMatchStats,
    })

    if (matchedCount === 0) {
      attachedLogger.warn(`Failed to update match ${match_id}`)
    }

    if (testMode || matchedCount > 0) {
      const statsUpdatePromises = []
      Object.entries(playersMatchStats).forEach(([playerGuid, stats]) => {
        statsUpdatePromises.push(async () => {
          const { [stats.role]: prevStats } = await wrapError(Stat.findOne({ guid: playerGuid }, `${stats.role}`).exec(), (err) => {
            stdLogger.error(`Failed to update ${playerGuid} player's stats after match ${match_id}: ${err}`)
            return {
              [stats.role]: null
            }
          })

          if (!prevStats) {
            return
          }

          stats.winner ? prevStats.wins++ : prevStats.loses++
          prevStats.kills += stats.kills
          prevStats.deaths += stats.deaths
          prevStats.assists += stats.assists

          Stat.updateOne({ guid: playerGuid }, {
            [stats.role]: prevStats,
          })
            .then(() => {
              stdLogger.info(`Successfully updated ${playerGuid} player's stats after match ${match_id}`)
            })
            .catch((err) => {
              stdLogger.error(`Failed to update ${playerGuid} player's stats after match ${match_id}: ${err}`)
            })
        })
      })

      // нам не нужно ждать исполнение этих промисов в данном хендлере, достаточно просто их запустить
      statsUpdatePromises.map(updater => updater())
      return match_id
    }
  } else if (isInDb && MatchStatus.Cancelled) {
    // в случае отмены матча, удаляем его из нашей бд
    await wrapError(Match.deleteOne({ faceitId: match_id }), (err) => {
      attachedLogger.warn(`Failed to delete match ${match_id}: ${err}`)
    })
  }

  return ''
})
