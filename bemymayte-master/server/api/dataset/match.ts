import { RoleEnum } from '~/types/bemymateAPI/roles'
import { api } from '~/services/api'

export default defineEventHandler(async (event) => {
  const [lastMatch] = await api.getPlayersMatches('4cd0d638-8cf3-4770-8b44-d6576f69d2a5', 1)
  const [{ teams }] = await api.getMatchStats(lastMatch.match_id)

  const rolesMapping = {
    0: RoleEnum.IGL,
    1: RoleEnum.Support,
    2: RoleEnum.Anchor,
    3: RoleEnum.Entry,
    4: RoleEnum.Lurker,
  }

  const teamInd = teams[0].players.some(({ player_id }) => player_id === '4cd0d638-8cf3-4770-8b44-d6576f69d2a5') ? 0 : 1
  return teams[teamInd].players.map((player, index) => ({ playerGuid: player.player_id, role: rolesMapping[index % 5] }))
})
