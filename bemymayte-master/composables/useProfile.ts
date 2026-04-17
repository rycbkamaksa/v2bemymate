import type { IProfileStats } from '~/types/bemymateAPI/profileStats'
import { useUserStore } from '~/store/user'

export function useProfile() {
  const userStore = useUserStore()

  const user = userStore.getStoredUser()

  const { data: profile, pending } = useFetch<IProfileStats>(
    `/api/users/${user.guid}/data/profile`,
    { server: false }
  )

  return { profile, pending, userStore }
}
