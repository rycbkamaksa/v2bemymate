import type { IRoomState } from '~/types/room'
import { Player } from '~/models'
import { defineStore } from 'pinia'

export const useRoomStore = defineStore('room', {
  state: () => ({roomId: '', matchId: '', players: []} as IRoomState),

  actions: {
    addPlayer(p: Player) {
      this.$state.players.push(p)
    },

    getPlayer(nickname: string) {
      return this.$state.players.find((player) => player.nickname === nickname)
    },

    clearPlayers() {
      this.$state.players.splice(0)
    },

    filterPlayer(guidToFilter: string): Player[] {
      return this.$state.players.filter(({ guid }) => guid !== guidToFilter)
    },
  },
})
