import type {
  IChatOutPayload,
  IPayload,
  IPlayerLeavePayload,
  ISearchCancelPayload,
  ISearchInitPayload
} from '../types/requests'
import type { IRoleStats } from '../types/roles'
import type { IApplicant } from '../types/applicant'
import { SocketRequests } from '../types/requests'
import { RoleEnum } from '../types/roles'
import { searchConf } from '../consts/matchingConfig'
import { LoggerCmds, stdLogger } from '../consts/logging'
import { formPlayerRefs, wrapError } from './utils'
import { applicants, rooms } from './sharedState'
import { startMatching } from './matching'
import type { Server } from 'socket.io'
import { $fetch } from 'ohmyfetch'
import { BASE_APP_URL } from '../consts/requests'

const findMatch = (applicant: IApplicant, io: Server) => {
  startMatching(applicant).then(() => {
    const { roomId } = applicant
    //@ts-ignore
    stdLogger.log({
      level: 'info',
      cmd: LoggerCmds.PlayerAdd,
      guid: applicant.guid,
      role: applicant.role,
      room: roomId,
    })
    const room = rooms.get(roomId)
    if (room && room.isFull()) {
      //@ts-ignore
      stdLogger.log({
        level: 'info',
        cmd: LoggerCmds.RoomFull,
        room: roomId,
        players: room.applicants.map((x) => x.guid),
      })
      io.to(roomId).emit(SocketRequests.ROOM_FILLED, { roomId, players: formPlayerRefs(room.applicants) })
    }
  })
}

const leaveRoom = (applicant: IApplicant, io: Server) => {
  const room = rooms.get(applicant.roomId)
  if (!room) {
    return
  }

  room.removeApplicant(applicant)
  if (typeof applicant.socket !== 'string') {
    applicant.socket.to(room.id).emit(SocketRequests.ROOM_STATE_CHANGE, formPlayerRefs(room.applicants))
  }

  if (room.toBeRemoved()) {
    const danglingApplicant = room.applicants[0]
    if (!danglingApplicant) {
      return
    }

    danglingApplicant.roomId = ''
    // распускаем комнату
    rooms.delete(room.id)
    // начинаем повторный поиск комнаты
    findMatch(danglingApplicant, io)
  }
}

interface ISearchProps {
  nickname: string
  picture: string
  main_role: string
  secondary_roles: string[]
  faceitLevel: number
  elo: number
}

// хендлер инициализации поиска команды игроком
async function onSearchInit({ guid, socket }: ISearchInitPayload, io: Server) {
  if (applicants.has(guid)) {
    stdLogger.log({
      level: 'error',
      message: 'This player is already in the search',
    })

    return
  }

  const searchProps = await wrapError($fetch<ISearchProps>(`/users/${guid}/data/search_props`, { baseURL: BASE_APP_URL }), (err) => {
    stdLogger.log({
      level: 'error',
      message: "Error while fetching player's search params",
      err,
    })
    return null
  })

  if (!searchProps) {
    return
  }

  const pickedRole = searchProps.secondary_roles[Math.floor(Math.random() * searchProps.secondary_roles.length)]

  //@ts-ignore
  stdLogger.log({
    level: 'info',
    cmd: LoggerCmds.SearchInit,
    guid,
    role: pickedRole,
  })

  const roleStats = await wrapError($fetch<Record<RoleEnum, IRoleStats>>(`/users/${guid}/stats/roles?only=${pickedRole}`, { baseURL: BASE_APP_URL }), (err) => {
    stdLogger.error({
      message: `Failed to fetch player's stats for role ${pickedRole}`,
      err,
    })
    return null
  })

  if (!roleStats || !roleStats[pickedRole]) {
    stdLogger.error({
      message: `Cancelling search for ${guid}`,
      err: 'role stats are missing',
    })
    return
  }

  const { rating, toxicRate, wins, loses, lastGames, banCnt, updatedAt} = roleStats[pickedRole]

  const banDelta = Date.now() - Date.parse(updatedAt)

  if (lastGames.length === 5) {
    if (toxicRate < searchConf.TOXIC_BAN_BORDER && lastGames[4] < toxicRate && banDelta < banCnt * searchConf.BAN_DURATION_MULTIPLIER) {
      if (typeof socket !== 'string') {
        socket.emit(SocketRequests.BANNED, Math.round((banCnt * searchConf.BAN_DURATION_MULTIPLIER - banDelta) / 60000))
      }

      return
    }
  }

  if (lastGames.length === 2 && lastGames.every((el) => el < 3) && banDelta < 30) {
    if (typeof socket !== 'string') {
      socket.emit(SocketRequests.BANNED, 30)
    }

    return
  }

  if (lastGames.length === 3 && lastGames.every((el) => el < 3)) {
    if (typeof socket !== 'string') {
      socket.emit(SocketRequests.BANNED, -1)
    }

    return
  }

  const playerRef = {
    guid,
    nickname: searchProps.nickname,
    img: searchProps.picture,
    mainRole: searchProps.main_role,
    role: pickedRole,
    level: searchProps.faceitLevel,
  }

  const gamesToQualify = searchConf.QUALIFICATION_GAMES - wins - loses
  // добавляем нового игрока в мапу
  const applicant = {
    guid,
    playerRef,
    role: pickedRole,
    mainRole: searchProps.main_role,
    elo: searchProps.elo,
    ignoreRating: gamesToQualify > 0,
    rating,
    toxicRate,
    socket,
    roomId: '',
    searchStarted: Date.now(),
  } as IApplicant
  applicants.set(guid, applicant)

  if (typeof socket !== 'string') {
    socket.emit(SocketRequests.ROOM_INIT, {
      players: [playerRef],
      gamesToQualify,
      applicants: applicants.size
    })
  }

  // начинаем подбор комнаты
  findMatch(applicant, io)
}

// хендлер отмены поиска команды игроком
function onSearchCancel({ guid }: ISearchCancelPayload, io: Server) {
  const applicant = applicants.get(guid)
  if (!applicant) {
    return
  }
  stdLogger.info(`Cancelling search for ${guid}`)

  clearTimeout(applicant.lastTimeoutId)
  // случай, когда игрока уже успели определить в комнату до отмены
  if (applicant.roomId) {
    leaveRoom(applicant, io)
  }

  applicants.delete(guid)
}

// хендлер выхода из уже сформированной команды
function onPlayerLeave({ guid }: IPlayerLeavePayload, io: Server) {
  const applicant = applicants.get(guid)
  if (!applicant) {
    return
  }

  leaveRoom(applicant, io)
  findMatch(applicant, io)
}

function onChatOut({ msg, guid }: IChatOutPayload, io: Server) {
  const applicant = applicants.get(guid)
  if (!applicant) {
    return
  }
  stdLogger.info(`Message in chat from ${guid}`)

  if (typeof applicant.socket !== 'string') {
    applicant.socket.to(applicant.roomId).emit(SocketRequests.CHAT_IN, msg)
  } else {
    io.to(applicant.roomId).emit(SocketRequests.CHAT_IN, msg)
  }
}

function onChatIn({ guid }, io: Server) {
  const applicant = applicants.get(guid)
  if (!applicant) {
    return
  }

  io.to(applicant.roomId).emit(SocketRequests.CHAT_IN, {
    initiator: 'SomeUser',
    content: 'Привет',
  })
}

export default {
  [SocketRequests.SEARCH_INIT]: onSearchInit,
  [SocketRequests.SEARCH_CANCEL]: onSearchCancel,
  [SocketRequests.PLAYER_LEAVE]: onPlayerLeave,
  [SocketRequests.CHAT_OUT]: onChatOut,
  // FOR TESTING ONLY
  [SocketRequests.CHAT_IN]: onChatIn,
  // ts fix
  [SocketRequests.ROOM_FILLED]: () => null,
  [SocketRequests.ROOM_STATE_CHANGE]: () => null,
  [SocketRequests.GAMES_TO_QUALIFY]: () => null,
  [SocketRequests.MATCH_ENDED]: () => null,
  [SocketRequests.MATCH_STARTED]: () => null,
  [SocketRequests.ROOM_CLOSED]: () => null,
  [SocketRequests.BANNED]: () => null,
  [SocketRequests.ROOM_INIT]: () => null,
} as { [key in SocketRequests]: <T extends IPayload>(payload: T, io: Server) => void }
