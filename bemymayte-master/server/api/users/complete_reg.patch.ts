import type { IUserRegData } from '~/types/user'
import type { IRoleStats } from '~/types/bemymateAPI/roles'
import { User } from '~/server/models/user'
import { Stat } from '~/server/models/stat'
import { attachedLogger } from '~/server/consts/loggers'
import { wrapError } from '~/utils'
import { useBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { uidCookie: uid } = event.context
  const regData = await useBody<IUserRegData>(event)

  const prevUser = await User.findByIdAndUpdate(String(uid), {
      ...regData,
      reg_completed: true,
  })

  if (prevUser) {
    const roleStats = {}
    // при создании AWP нам приходит всего одна роль вне массива
    if (typeof regData.secondary_roles === 'string') {
      regData.secondary_roles = [regData.secondary_roles]
    }

    regData.secondary_roles.forEach((role) => {
      roleStats[role] = {
        wins: 0,
        loses: 0,
        kda: '',
        rating: 0,
        toxicRate: 5,
      } as Omit<IRoleStats, 'title'>
    })

    await wrapError(new Stat({ guid: prevUser.guid, ...roleStats }).save(), (err) => {
      attachedLogger.warn(`Failed to add stats for user ${uid}: ${err}`)
    })
  }

  return {
    acknowledged: Boolean(prevUser),
  }
})
