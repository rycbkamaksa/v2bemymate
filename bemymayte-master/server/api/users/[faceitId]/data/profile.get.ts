import type { RoleEnum } from '~/types/bemymateAPI/roles'
import type { IGameStats, IProfileStats } from '~/types/bemymateAPI/profileStats'
import { StatTitles } from '~/types/bemymateAPI/profileStats'
import { RECENT_MATCHES_COUNT, QUALIFICATION_GAMES } from '~/consts'
import { attachedLogger } from '~/server/consts/loggers'
import { Match } from '~/server/models/match'
import { api } from '~/services/api'
import { wrapError } from '~/utils'

export default defineEventHandler(async (event) => {
  const { faceitId } = event.context.params
  const profileFormingPromises = []
  const res = {
    roleStat: [],
    stat: [],
    bemymateLevel: 0,
  } as IProfileStats

  const overallStats = {
    toxicity: 0,
  }

  const placeholderVal = '-'
  let overallGames = 0

  // подтягиваем статистику по ролям
  profileFormingPromises.push((async () => {
    const idNStats = await wrapError($fetch(`/api/users/${faceitId}/stats/roles`), (err) => {
      attachedLogger.warn(`Failed to fetch role stats for player ${faceitId}: ${err}`)
      return null
    })

    if (!idNStats) {
      return
    }

    const { _id, ...roleStats } = idNStats
    let rolesCnt = 0
    Object.entries(roleStats).forEach(([role, stats]) => {
      ++rolesCnt
      const kdaNumeric = (stats.kills + stats.assists ) / stats.deaths
      res.roleStat.push({
        title: role as RoleEnum,
        wins: stats.wins,
        loses: stats.loses,
        kda: String(Number.isNaN(kdaNumeric) ? placeholderVal : kdaNumeric).slice(0, 4),
      })

      overallGames += stats.wins + stats.loses
      res.bemymateLevel += stats.rating
      res.bemymateLevel += stats.toxicRate

      overallStats.toxicity += stats.toxicRate
    })

    overallStats.toxicity /= rolesCnt
    // учитываем только для игроков, прошедших квалификацию
    res.bemymateLevel = (overallGames >= QUALIFICATION_GAMES) ? res.bemymateLevel : 0
    // две статы на каждую роль, поэтому делим на удвоенное количество ролей
    res.bemymateLevel = Number(String(res.bemymateLevel / (rolesCnt * 2)).slice(0, 4))
  })())

  profileFormingPromises.push((async () => {
    // заполняем основные данные игрока
    const { games: playerFaceitGames } = await wrapError(api.getPlayersData(faceitId), (err) => {
      attachedLogger.warn(`Couldn't fetch player's games data: ${err}`)
      return { games: null }
    })

    const playerStats = await wrapError(api.getPlayersStats(faceitId), (err) => {
      attachedLogger.warn(`Couldn't fetch player's stats data: ${err}`)
      return null
    })

    res.faceitLevel = playerFaceitGames?.csgo?.skill_level || 1

    const statsValues = {
      'Сыграно Игр': playerStats?.matches,
      'ELO': playerFaceitGames?.csgo?.faceit_elo,
      'Win Rate': playerStats?.['win_rate_%'],
      'K/D': playerStats?.['average_k/d_ratio'],
      'Headshot rate': playerStats?.['average_headshots_%'],
      'Дружелюбность': String(overallStats.toxicity).slice(0, 4),
    }

    StatTitles.forEach((title) => {
      // вложенный тернарник выглядит совсем не оч (но все еще короче ифа),
      // если будут идеи получше, как добавить '%' - дай знать)
      const value = statsValues[title] ? String(statsValues[title]) + (title === 'Win Rate' || title === 'Headshot rate' ? '%' : '') : placeholderVal
      res.stat.push({ title, value })
    })
  })())

  // собираем информацию о последних матчах
  const matches = await wrapError(Match.find({ status: 'finished', [`players.${faceitId}`]: {$exists: true} }, 'map players', {
    limit: RECENT_MATCHES_COUNT,
  }).sort({ updatedAt: -1 }).exec(), (err) => {
    attachedLogger.warn(`Couldn't fetch match data: ${err}`)
    return []
  })

  res.lastGames = new Array(matches.length)
  let i = 0
  for (const { map: matchMap, players } of matches) {
    profileFormingPromises.push((async (matchIndex) => {
      const playerMatchStats = players.get(faceitId)
      const match = {} as IGameStats
      match.map = matchMap
      match.result = (playerMatchStats.winner) ? 'Win' : 'Lose'
      match.kills = playerMatchStats.kills
      match.role = playerMatchStats.role
      const averageRoleEval = playerMatchStats.roleEvaluations
        .reduce((prev, cur) => prev + cur, 0) / playerMatchStats.roleEvaluations.length
      match.roleRate = String(Number.isNaN(averageRoleEval) ? placeholderVal : averageRoleEval).slice(0, 3)

      res.lastGames[matchIndex] = match
    })(i++))
  }

  await Promise.all(profileFormingPromises)
  return res
})
