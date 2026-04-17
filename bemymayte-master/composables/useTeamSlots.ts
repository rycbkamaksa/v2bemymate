import { useUserStore } from '~~/store/user'
import { useRoomStore } from '~/store/room'

export function useTeamSlots() {
  const user = useUserStore()
  const room = useRoomStore()
  const freeSlots = computed(() => Array(5 - room.$state.players.length))

  return { user, room, freeSlots }
}
