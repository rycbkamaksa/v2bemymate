import type { IRoleStats } from '~/types/bemymateAPI/roles'

export interface IGameStats {
  map: string
  role: string
  result: 'Win' | 'Lose'
  kills: number
  roleRate: string
}

// делаем такой финт, чтобы иметь возможность итерироваться по ролям в рантайме
export const StatTitles = ['Сыграно Игр', 'ELO', 'Win Rate', 'K/D', 'Headshot rate', 'Дружелюбность'] as const

export interface IProfileStats {
  roleStat: Omit<IRoleStats, 'rating' | 'toxicRate'>[]
  lastGames: IGameStats[]
  stat: {title: typeof StatTitles[number], value: string}[]
  faceitLevel: number
  bemymateLevel: number
}

