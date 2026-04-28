import type { MainRoleEnum, RoleEnum } from '~/types/bemymateAPI/roles'

export interface PlayerData {
  guid: string
  nickname: string
  img: string
  mainRole?: MainRoleEnum
  role?: RoleEnum
  level?: number
}

export class Player {
  guid: string
  nickname: string
  img: string
  mainRole?: MainRoleEnum
  role?: RoleEnum
  level?: number
  profile: string

  constructor(data: PlayerData) {
    this.guid = data.guid
    this.nickname = data.nickname
    this.img = data.img
    this.mainRole = data.mainRole
    this.role = data.role
    this.level = data.level
    this.profile = `https://www.faceit.com/ru/players/${data.nickname}`
  }

  clone(): Player {
    return new Player({
      guid: this.guid,
      nickname: this.nickname,
      img: this.img,
      mainRole: this.mainRole,
      role: this.role,
      level: this.level,
    })
  }
}
