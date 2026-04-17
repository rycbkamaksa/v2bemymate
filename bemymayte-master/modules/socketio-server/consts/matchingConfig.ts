import type { IMatchingConfig } from '../types/matching_config'

const searchConf = {
  ELO_TOLERANCE: 150,
  RATING_TOLERANCE: .5,
  QUALIFICATION_GAMES: 6,
  BEGINNER_SEARCH_DURATION: 1000 * 60 * 5,
  TOXIC_BAN_BORDER: 3,
  BAN_DURATION_MULTIPLIER: 30000,
  // 10 mins
  MATCH_SUBMIT_TIMEOUT: 10 * 60 * 1000,
} as IMatchingConfig

export {
  searchConf,
}
