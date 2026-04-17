import type { RoleEnum } from '~/types/bemymateAPI/roles'

export interface ICheckStatusPayload {
  players: {
    playerGuid: string
    role: RoleEnum
  }[]
}

export enum RoleRates {
  Terrible = 1,
  Bad,
  Ok,
  Good,
  Great,
}

interface IPlayerRate {
  roleRate: RoleRates,
  toxicRate: RoleRates,
}

export type IRateMatchPayload = Record<string, IPlayerRate>
