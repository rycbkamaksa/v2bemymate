import type { IPlayerMatchData } from '~/types/faceitAPI/data/player'

export enum MatchStatus {
  Aborted = 'aborted',
  Cancelled = 'cancelled',
  Configuring = 'configuring',
  Finished = 'finished',
  Ready = 'ready',
}

interface IRoundStats {
  Rounds: string
  Score: string
  Region: string
  Map: string
  Winner: string
}

interface ITeamStats {
  team_id: string
  players: IPlayerMatchData[]
}

export interface IMatchStats {
  round_stats: IRoundStats
  teams: ITeamStats[]
}

export interface IMatch {
  match_id: string
  status: MatchStatus
  started_at: string
  finished_at: string
  playing_players: string[]
}

