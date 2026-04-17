import {MainRoleEnum, RoleEnum} from './roles'
import type {IApplicant} from './applicant'
import { searchConf } from '../consts/matchingConfig'
import uniqid from 'uniqid'
import {formPlayerRefs, wrapError} from '../runtime/utils'
import {SocketRequests} from "./requests"
import {$fetch} from "ohmyfetch";
import {BASE_APP_URL} from "../consts/requests";
import {stdLogger} from "../consts/logging";

export interface IRoom {
  readonly id: string
  /**
   * массив ролей, которые еще нужно добрать в комнату
   */
  missingRoles: string[]
  /**
   * первое число - нижний порог elo для вступления в комнату,
   * второе - верхний
   */
  awpRole: string
  /**
   * массив IApplicant игроков в комнате
   */
  applicants: IApplicant[]
  /**
   * начался ли матч в этой комнате
   */
  matchInProgress: boolean,
  /**
   * id чата, прикрепленного к комнате (нужен для бэкапов)
   */
  readonly chatRoomId: string

  // methods
  /**
   * Проверяет, удовлетворяет ли игрок комнате
   */
  applicantFits(applicant: IApplicant): boolean
  /**
   * Проверяет, заполнена ли комната
   */
  isFull(): boolean
  /**
   * Проверяет, нужно ли распускать комнату
   */
  toBeRemoved(): boolean
  /**
   * Удаляет игрока из комнаты
   */
  removeApplicant(applicant: IApplicant)
}

export class Room implements IRoom {
  readonly id: string = uniqid.process()
  missingRoles: string[] = Object.keys(RoleEnum)
  awpRole: string = ''
  applicants: IApplicant[] = []
  matchInProgress: boolean = false
  readonly chatRoomId: string = uniqid.process()
  private lastStatusUpdateTimeout: ReturnType<typeof setTimeout> | undefined = undefined

  constructor(applicant: IApplicant) {
    this.addApplicant(applicant)
  }

  addApplicant = (applicant: IApplicant) => {
    this.missingRoles = this.missingRoles.filter((role) => role !== applicant.role)
    this.applicants.push(applicant)
    if (applicant.mainRole === MainRoleEnum.AWP) {
      this.awpRole = applicant.role
    }

    if (typeof applicant.socket !== 'string') {
      applicant.socket.join(this.id)
    }

    for (const apl of this.applicants) {
      if (typeof apl.socket !== 'string') {
        apl.socket.emit(SocketRequests.ROOM_STATE_CHANGE, formPlayerRefs(this.applicants))
      }
    }

    // если уже был запланирован таймаут проверки состояния, мы не хотим планировать еще один
    // (кейс, когда человек ливнул, и его место занял другой в течении 15-ти секундного окна)
    if (this.applicants.length === 5 && this.lastStatusUpdateTimeout === undefined) {
      this.updateMatchStatus()
    }
  }

  applicantFits = (applicant: IApplicant): boolean => {
    const { role: aplRole, mainRole } = applicant

    // проверяем соответствие роли комнате
    let roleFits = false
    const filteredRoles = this.missingRoles.filter((role) => role !== aplRole)
    const awpSlotTaken = Boolean(this.awpRole)
    if (this.missingRoles.includes(aplRole)) {
      if (mainRole === MainRoleEnum.AWP) {
        roleFits = !awpSlotTaken
      } else {
        roleFits = (awpSlotTaken) ? true : filteredRoles.some((role) => role === 'Entry' || role === 'IGL')
      }
    }

    if (!roleFits) {
      return false
    }

    const isApplicantBeginner = applicant.ignoreRating
    const isApplicantBeginnerSearching = Date.now() - applicant.searchStarted < searchConf.BEGINNER_SEARCH_DURATION && isApplicantBeginner

    for (const otherApplicant of this.applicants) {
      const eloDelta = Math.abs(applicant.elo - otherApplicant.elo)
      const ratingDelta = Math.abs(applicant.rating - otherApplicant.rating)
      const isOtherBeginner = otherApplicant.ignoreRating
      const isOtherBeginnerSearching = Date.now() - otherApplicant.searchStarted < searchConf.BEGINNER_SEARCH_DURATION && isOtherBeginner

      if (eloDelta > searchConf.ELO_TOLERANCE) {
        return false
      }

      if (isApplicantBeginnerSearching && !isOtherBeginner) {
        return false
      }

      if (isOtherBeginnerSearching && !isApplicantBeginner) {
        return false
      }

      if (!isApplicantBeginner && !isOtherBeginner && ratingDelta > searchConf.RATING_TOLERANCE) {
        return false
      }
    }

    this.addApplicant(applicant)
    return true
  }

  isFull = (): boolean => this.missingRoles.length === 0

  toBeRemoved = (): boolean => this.applicants.length <= 1

  removeApplicant = (applicant: IApplicant) => {
    this.applicants = this.applicants.filter(({ guid }) => guid !== applicant.guid)

    for (const apl of this.applicants) {
      if (typeof apl.socket !== 'string') {
        apl.socket.emit(SocketRequests.ROOM_STATE_CHANGE, formPlayerRefs(this.applicants))
      }
    }

    if (typeof applicant.socket !== 'string') {
      applicant.socket.leave(this.id)
    }
    stdLogger.info(`Removed ${applicant.guid} from room ${this.id}`)
  }

  async updateMatchStatus() {
    if (this.applicants.length !== 5) {
      this.lastStatusUpdateTimeout = undefined
      return
    }

    const applicants = this.applicants.map((applicant) => ({ playerGuid: applicant.guid, role: applicant.role}))
    const isTestCall = this.applicants.some(({ socket }) => typeof socket === 'string')
    const matchStatus = await wrapError($fetch<string>(`/matches/check_status?${isTestCall && 'test'}`, {
          baseURL: BASE_APP_URL,
          method: 'POST',
          body: {
            players: applicants,
          }
    }), (err) => {
      stdLogger.error({
        message: `Failed to check match status for room ${this.id}`,
        err,
      })

      return ''
    })

    if (!matchStatus) {
      this.lastStatusUpdateTimeout = setTimeout(this.updateMatchStatus, 15000)
    } else if (matchStatus === 'start' && !this.matchInProgress) {
      for (const apl of this.applicants) {
        if (typeof apl.socket !== 'string') {
          apl.socket.emit(SocketRequests.MATCH_STARTED, matchStatus)
          stdLogger.info(`Match started in room ${this.id}`)
        }
      }

      this.matchInProgress = true
      this.lastStatusUpdateTimeout = setTimeout(this.updateMatchStatus, 15000)
    } else {
      for (const apl of this.applicants) {
        if (typeof apl.socket !== 'string') {
          apl.socket.emit(SocketRequests.MATCH_ENDED, matchStatus)
          stdLogger.info(`Match ${matchStatus} ended in room ${this.id}`)
        }
      }
      setTimeout(this.closeRoom, searchConf.MATCH_SUBMIT_TIMEOUT, matchStatus)
    }
  }

  closeRoom = (matchId) => {
    // участники комнаты постепенно удаляются при получении roomClosed
    for (const apl of this.applicants) {
      if (typeof apl.socket !== 'string') {
        apl.socket.emit(SocketRequests.ROOM_CLOSED)
      }
    }

    stdLogger.info(`Room ${this.id} closed`)

    $fetch(`/matches/${matchId}/submit`, {
      baseURL: BASE_APP_URL,
      method: 'PATCH',
    })
    .catch((err) => {
      stdLogger.error({
        message: `Failed to submit room closure ${this.id}`,
        err: err.toString(),
      })
    })
  }
}
