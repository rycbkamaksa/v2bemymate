import { ROUTES } from '~/consts'
import { useUserStore } from '~/store/user'
import { RouteMatches } from '~/utils'

export default defineNuxtPlugin((nuxt) => {
  const userStore = useUserStore(nuxt.$pinia)

  addRouteMiddleware('redirect', async (to) => {
    const config = useRuntimeConfig()
    if (config.public.landing_mode) {
      if (!RouteMatches(to.path, [/\/landing*./])) {
        return navigateTo('/landing')
      }

      return
    }

    const matchesAuthFree = RouteMatches(to.path, ROUTES.authFree)
    const matchesRegFree = RouteMatches(to.path, ROUTES.regFree)
    const { authenticated, registered } = userStore.$state

    if (!authenticated && !matchesAuthFree) {
      return navigateTo('/login')
    }

    if (!registered && !matchesRegFree) {
      return navigateTo('/reg')
    }

    if (registered && matchesRegFree) {
      return navigateTo('/')
    }
  }, { global: true })
})
