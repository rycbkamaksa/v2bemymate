import type { IPlayerMatchStats } from '~/types/faceitAPI/data/playerStats'
import type { IGame } from '~/types/faceitAPI/data/game'

export interface IPlayerMatchData {
  player_id: string
  nickname: string
  player_stats: IPlayerMatchStats
}

export interface IPlayerData {
  nickname: string
  avatar: string
  country: string
  games: Record<string, IGame>
}
