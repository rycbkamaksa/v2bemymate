import type { IApplicant, PlayerProps } from '../types/applicant'
import { DB_URL } from '../consts/requests'
import { searchConf } from '../consts/matchingConfig'
import { Config } from '../models/config'
import { stdLogger } from '../consts/logging'
import mongoose from 'mongoose'

export function formPlayerRefs(applicantList: IApplicant[]): PlayerProps[] {
  const res = [] as PlayerProps[]
  applicantList.forEach((applicant) => {
    res.push(applicant.playerRef)
  })

  return res
}

export function wrapError<T extends Promise<any> | any>(fn: (() => T) | T, handler: (err: any) => any): T {
  if (fn instanceof Promise) {
    // @ts-ignore
    return fn.catch(handler)
  }

  try {
    // @ts-ignore
    return fn()
  } catch (err) {
    return handler(err)
  }
}

export async function readConfig() {
  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    await mongoose.connect(DB_URL)
  }

  const dbConf = await wrapError(Config.findOne({}).exec(), (err) => {
    stdLogger.error(`Failed to read config: ${err}`)
    return null
  })

  if (!dbConf) {
    return
  }

  searchConf.ELO_TOLERANCE = dbConf.eloTolerance || searchConf.ELO_TOLERANCE
  searchConf.RATING_TOLERANCE = dbConf.ratingTolerance || searchConf.RATING_TOLERANCE
  searchConf.QUALIFICATION_GAMES = dbConf.qualificationGames || searchConf.QUALIFICATION_GAMES
  searchConf.BEGINNER_SEARCH_DURATION = dbConf.beginnerSearchDuration || searchConf.BEGINNER_SEARCH_DURATION
  searchConf.TOXIC_BAN_BORDER = dbConf.toxicBanBorder || searchConf.TOXIC_BAN_BORDER
  searchConf.BAN_DURATION_MULTIPLIER = dbConf.banDuration || searchConf.BAN_DURATION_MULTIPLIER
  searchConf.MATCH_SUBMIT_TIMEOUT = dbConf.matchSubmitTimeout || searchConf.MATCH_SUBMIT_TIMEOUT
}
