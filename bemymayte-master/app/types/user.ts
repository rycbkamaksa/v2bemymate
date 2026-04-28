import type { MainRoleEnum, RoleEnum } from '~/types/bemymateAPI/roles'

export interface IUser {
  picture: string
  email: string
  birthdate: string
  nickname: string
  locale: string
  memberships: string[]
  guid: string
  given_name: string
  family_name: string
  email_verified: boolean
  iss: string
  aud: string
}

/**
 * IUser используется для взаимодействия с faceit api и бд,
 * но для приложения нужны некоторые дополнительные поля (например, authenticated),
 * другие (например, iss, aud), наоборот, - не нужны
 * поэтому заводим отдельный интерфейс для менеджмента стейта юзера
 */
export interface IUserState extends Pick<IUser, 'picture' | 'email' | 'birthdate' | 'nickname' | 'locale' | 'guid'> {
  authenticated: boolean,
  registered: boolean,
}

export interface IUserRegData {
  main_role: MainRoleEnum
  secondary_roles: RoleEnum[]
  gender: 'male' | 'female' | 'unknown'
  city: string
  jwt: string,
}
