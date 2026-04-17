import type { RemapToSnakeKeys } from '~/types/utils'
import type { AuthResponse } from '~/types/faceitAPI/authResponse'
import type { IPlayerData } from '~/types/faceitAPI/data/player'
import type { IPlayerStats } from '~/types/faceitAPI/data/playerStats'
import type { IMatch, IMatchStats } from '~/types/faceitAPI/data/match'
import { RemapObjectToSnakeKeys, wrapError } from '~/utils'
import qs from 'qs'
import { $fetch } from 'ohmyfetch'
import { attachedLogger } from '~/server/consts/loggers'

const config = useRuntimeConfig()

const authApiRequest = $fetch.create({
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(config.public.clientId + ':' + config.clientSecret, 'binary').toString('base64')}`,
  },
  baseURL: 'https://api.faceit.com/auth/v1/oauth',
})

const dataApiRequest = $fetch.create({
  headers: {
    Authorization: `Bearer ${config.api_key}`,
  },
  baseURL: 'https://open.faceit.com/data/v4',
})

export const api = {
  async requestTokens(code: string): Promise<AuthResponse> {
    const body = qs.stringify({
      grant_type: 'authorization_code',
      code,
    })

    return await authApiRequest<AuthResponse>('/token', { body })
  },

  async refreshTokens(refresh_token: string): Promise<AuthResponse> {
    const body = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    })

    return await authApiRequest<AuthResponse>('/token', { body })
  },

  async getPlayersData(playerId: string): Promise<IPlayerData> {
    return await dataApiRequest<IPlayerData>(`/players/${playerId}`)
  },

  // топ 1 по кс на faceit)) чтобы точно проходить лимит по матчам, если что
  async getPlayersStats(playerId: string = '4cd0d638-8cf3-4770-8b44-d6576f69d2a5'): Promise<RemapToSnakeKeys<IPlayerStats>> {
    const { lifetime: stats } = await dataApiRequest<{ lifetime: IPlayerStats }>(`/players/${playerId}/stats/csgo`)
    // в интерфейсе числа, а приходят строки => конвертируем
    return RemapObjectToSnakeKeys(stats, (val) => Number(val))
  },

  async getPlayersMatches(playerId: string, count: number): Promise<IMatch[]> {
    // можно брать дату регистрации пользователя через createdAt
    const { items } = await wrapError(dataApiRequest<{ items: IMatch[] }>(`/players/${playerId}/history?game=csgo&offset=0&limit=${count}`), (err) => {
      attachedLogger.warn(`Failed to load player's matches: ${err}`)
      return {
        items: []
      }
    })
    return items
  },

  async getMatchStats(matchId: string): Promise<IMatchStats[]> {
    const { rounds } = await dataApiRequest<{ rounds: IMatchStats[] }>(`/matches/${matchId}/stats`)
    return rounds
  },
}
