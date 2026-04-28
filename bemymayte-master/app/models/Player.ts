import type { MainRoleEnum, RoleEnum } from '~/types/bemymateAPI/roles'
import { MutableModel, Prop } from 'model-typescript'
import { ModelPropertiesOf } from 'model-typescript/dist/types/model-properties-of.type'

export class Player extends MutableModel<Player> {
  // добавляем в модель guid, тк он нужен для ручек в /api/matches
  @Prop public guid: string
  @Prop public nickname: string
  @Prop public img: string
  @Prop public mainRole?: MainRoleEnum
  @Prop public role?: RoleEnum
  @Prop public level?: number
  public profile: string
  constructor(data: ModelPropertiesOf<Omit<Player, 'profile'>>) {
    super(data)
    this.profile = `https://www.faceit.com/ru/players/${this.nickname}`
  }
}
