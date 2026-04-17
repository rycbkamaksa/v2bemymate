import { useUserStore } from '~~/store/user'
import type { IUser, IUserState } from '~/types/user'
import { wrapError } from '~/utils'
import type { H3Error } from 'h3'

type IPartialUserState = Omit<IUserState, 'authenticated' | 'registered'>

export default defineNuxtPlugin((nuxt) => {
  const userStore = useUserStore(nuxt.$pinia)

  addRouteMiddleware('auth_check', async () => {
    const config = useRuntimeConfig()
    if (config.public.landing_mode || userStore.$state.registered) {
        return
      }

      // FIXME: если мы попытались обновить токен на исходе его действия, он инвалидируется в течение сессии
      //  upd: не используем эти токены по итогу...
      const resp = await wrapError(
        $fetch<{ reg_completed: boolean }>('/api/tokens/refresh', {
          retry: false,
        }),
        (err: H3Error) => Error(err.data.statusMessage)
      )

      if (resp instanceof Error) {
        console.warn(`Error: ${resp.message}`)
        return
      }

      let userData: IUser | IPartialUserState = userStore.getStoredUser()

      // крайний случай, когда у зарегистрированного пользователя, почему-то не оказывается jwt в localStorage
      // => запрашиваем данные прямо с нашей бд
      if (!userData && resp.reg_completed) {
        userData = await wrapError(
          $fetch<IPartialUserState>('/api/users/current'),
          () => {
            // вообще патовая ситуация, которая может происходить только при падении бд по идее
            console.error("Current user hasn't been found")
            return null
          }
        )
      }

      userStore.$patch({
        authenticated: true,
        registered: resp.reg_completed,
        ...userData,
      })
  }, { global: true })
})
