import type { IUserState, IUserRegData, IUser } from '~/types/user'
import { LS_KEYS } from '~/consts'
import { wrapError } from '~/utils'
import jwtDecode from 'jwt-decode'
import { defineStore } from 'pinia'
import { Player } from '~/models'

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    picture: '',
    email: '',
    birthdate: '',
    nickname: '',
    locale: '',
    guid: '',
    authenticated: false,
    registered: false,
  }),

  actions: {
    async logout() {
      await useFetch('/api/users/logout', { method: 'post' })
      this.removeStoredUser()
      this.$reset()
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

    // Удаляет jwt из localStorage и сбрасывает in-memory state до дефолтов
    // (чтобы поля предыдущего пользователя не утекали в новую сессию)
    removeStoredUser() {
      localStorage.removeItem(LS_KEYS.jwt)
      this.$reset()
    },
  },
})

export const useRegDataStore = defineStore('regData', {
  state: (): IUserRegData => ({
    // main_role остаётся unset до выбора пользователем — опционально по типу
    secondary_roles: [],
    gender: 'unknown',
    city: '',
    jwt: '',
  }),
})
