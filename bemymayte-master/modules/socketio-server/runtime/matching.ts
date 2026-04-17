import type { IApplicant } from '../types/applicant'
import { Room } from '../types/room'
import { searchConf } from '../consts/matchingConfig'
import { applicants, rooms } from './sharedState'
import { readConfig } from './utils'

function match(applicant: IApplicant, resolver: Function, rejecter: Function) {
  // зануляем id последнего таймаута, чтобы при случайном совпадении id старого и одного из новых таймаутов
  // не отменить поиск другому случайному игроку
  applicant.lastTimeoutId = undefined

  if(!applicants.has(applicant.guid)) {
    rejecter()
    return
  }

  if (applicant.roomId) {
    resolver()
    return
  }

  // позволяем админу менять конфиг подбора через бд
  readConfig().finally(() => {
    // сначала пробуем добавить игрока в одну из существующих комнат
    // перебираем от большой к меньшей

    const sortedRooms = [...rooms.values()].sort((lhs, rhs) => rhs.applicants.length - lhs.applicants.length)
    for (const room of sortedRooms) {
      if (room.toBeRemoved()) {
        rooms.delete(room.id)
        continue
      }

      // игнорируем комнаты, в которых уже идут матчи,
      // так как иначе не получится поставить нормальную оценки
      if (room.matchInProgress) {
        continue
      }

      if (room.applicantFits(applicant)) {
        applicant.roomId = room.id
        resolver()
        return
      }
    }

    // если ни одна из комнат не подошла - пробуем найти пару среди свободных игроков
    let newRoom: Room | null = new Room(applicant)
    for (const otherApplicant of applicants.values()) {
      if (otherApplicant.roomId) {
        continue
      }

      if (applicant.guid !== otherApplicant.guid) {
        if (newRoom.applicantFits(otherApplicant)) {
          otherApplicant.roomId = newRoom.id
          applicant.roomId = newRoom.id

          rooms.set(newRoom.id, newRoom)
          resolver()
          return
        }
      }
    }

    // убираем референс
    newRoom = null

    applicant.lastTimeoutId = setTimeout(match, 5000, applicant, resolver, rejecter)
  })
}

export function startMatching(applicant: IApplicant): Promise<void> {
  return new Promise((resolve, reject) => {
    match(applicant, resolve, reject)
  })
}
