export enum MainRoleEnum {
  AWP = 'AWP',
  Rifler = 'Rifler',
}

export enum RoleEnum {
  IGL = 'IGL',
  Entry = 'Entry',
  Anchor = 'Anchor',
  Lurker = 'Lurker',
  Support = 'Support',
}

export interface IRoleStats {
  title: RoleEnum
  wins: number
  loses: number
  kda: string
  rating: number
  toxicRate: number
  lastGames: number[]
  banCnt: number
  updatedAt: string
}
