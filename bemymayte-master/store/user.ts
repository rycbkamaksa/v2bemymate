import type { IUserState, IUserRegData, IUser } from '~/types/user'
import { LS_KEYS } from '~/consts'
import { wrapError } from '~/utils'
import jwtDecode from 'jwt-decode'
import { defineStore } from 'pinia'
import { Player } from '~~/models'

export const useUserStore = defineStore('user', {
  state: () => ({} as IUserState),

  actions: {
    async logout() {
      await useFetch('/api/users/logout', { method: 'post' })
      this.$state.registered = false
      await useRouter().push('/login')
    },

    getPlayer() {
      return new Player({
        guid: this.$state.guid,
        nickname: this.$state.nickname,
        img: this.$state.picture,
      })
    },

    // Декодирует jwt из localStorage
    getStoredUser(): IUser | null {
      // при отсутствии jwt или битом jwt, jwtDecode кидает исключение, ловим его при помощи обертки
      return wrapError(
        () => jwtDecode(localStorage.getItem(LS_KEYS.jwt)),
        (err) => {
          console.warn(`Failed to decode jwt: ${err.message}`)
          return null
        }
      )
    },

    //Удаляет jwt из localStorage
    removeStoredUser() {
      localStorage.removeItem(LS_KEYS.jwt)
    },
  },
})

export const useRegDataStore = defineStore('regData', {
  state: () => ({} as IUserRegData),
})
