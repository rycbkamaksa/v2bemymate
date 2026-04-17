import { User } from '~/server/models/user'
import { wrapError } from '~/utils'
import { api } from '~/services/api'

export default defineEventHandler(async (event) => {
  const { faceitId } = event.context.params
  let [searchProps, gamesData] = await Promise.all([
    User.findOne({ guid: faceitId }, 'nickname picture main_role secondary_roles').exec(),
    wrapError(api.getPlayersData(faceitId), () => ({ games: null })),
  ])

  // костыль для тестов для подтягивания данных с фейсита
  if (!gamesData.games) {
    gamesData = await api.getPlayersData('4cd0d638-8cf3-4770-8b44-d6576f69d2a5')
  }

  return {
    nickname: searchProps.nickname,
    picture: searchProps.picture,
    main_role: searchProps.main_role,
    secondary_roles: searchProps.secondary_roles,
    faceitLevel: gamesData.games?.csgo?.skill_level,
    elo: gamesData.games?.csgo?.faceit_elo,
  }
})
