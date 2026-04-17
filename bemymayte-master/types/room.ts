import { Player } from '~/models'

export interface IRoomState {
  roomId: string
  matchId: string
  players: Player[]
}
