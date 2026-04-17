import type { IApplicant } from './applicant'
import type { IChatMsg } from './chat'

export interface IPayload {
}

export type ISearchInitPayload = IPayload & Pick<IApplicant, 'guid' | 'socket'>
export type ISearchCancelPayload = IPayload & Pick<IApplicant, 'guid'>
export type IPlayerLeavePayload = IPayload & Pick<IApplicant, 'guid'>
export interface IChatOutPayload extends IPayload, Pick<IApplicant, 'guid'> {
  msg: IChatMsg
}

export enum SocketRequests {
  SEARCH_INIT = 'SEARCH_INIT',
  SEARCH_CANCEL = 'SEARCH_CANCEL',
  GAMES_TO_QUALIFY = 'GAMES_TO_QUALIFY',
  PLAYER_LEAVE = 'PLAYER_LEAVE',
  ROOM_INIT = 'ROOM_INIT',
  ROOM_STATE_CHANGE = 'ROOM_STATE_CHANGE',
  ROOM_FILLED = 'ROOM_FILLED',
  CHAT_OUT = 'CHAT_MSG_OUT',
  CHAT_IN = 'CHAT_MSG_IN',
  MATCH_ENDED = 'MATCH_ENDED',
  ROOM_CLOSED = 'ROOM_CLOSED',
  MATCH_STARTED = 'MATCH_STARTED',
  BANNED = 'BANNED',
}

