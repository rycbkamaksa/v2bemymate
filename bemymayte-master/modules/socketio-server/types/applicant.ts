import type { MainRoleEnum, RoleEnum } from './roles'
import type { Socket } from 'socket.io'

// все же в рантайме ошибки вылетают при создании экземпляров класса Player,
// поэтому берем ток поля из него
export interface PlayerProps {
  guid: string
  nickname: string
  img: string
  mainRole: MainRoleEnum
  role: RoleEnum
  level: number
}

export interface IApplicant {
  guid: string
  playerRef: PlayerProps,
  role: RoleEnum
  mainRole: MainRoleEnum
  elo: number
  ignoreRating: boolean
  rating: number
  toxicRate: number
  roomId: string
  socket: Socket | string
  /**
   * id последнего таймаута на функцию поиска, нужен для отмены поиска
   * для данного игрока
   */
  lastTimeoutId: ReturnType<typeof setTimeout> | undefined
  searchStarted: number
}
