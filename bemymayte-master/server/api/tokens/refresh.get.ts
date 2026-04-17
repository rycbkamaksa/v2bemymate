import { User } from '~/server/models/user'
import { api } from '~/services/api'
import { attachedLogger, stdLogger } from '~/server/consts/loggers'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

export default defineEventHandler(async (event) => {
  const { uidCookie: uid } = event.context
  if (!mongoose.Types.ObjectId.isValid(String(uid))) {
    return createError({
      statusCode: StatusCodes.BAD_REQUEST,
      statusMessage: 'Invalid uid',
    })
  }

  try {
    const { refresh_token, reg_completed, token_valid_until } = await User.findById(uid, 'refresh_token reg_completed token_valid_until').exec()
    if (token_valid_until > Date.now()) {
      attachedLogger.info(`User with id ${uid} has yet unexpired tokens`)
      return {
        reg_completed,
      }
    }

    const { access_token, refresh_token: upd_refresh_token, expires_in } = await api.refreshTokens(refresh_token)

    const { acknowledged } = await User.updateOne(
      { _id: String(uid) },
      {
        access_token,
        refresh_token: upd_refresh_token,
        token_valid_until: Date.now() + 1000 * expires_in,
      }
    )

    if (!acknowledged) {
      return createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Specified user wasn't found",
      })
    }

    return {
      reg_completed,
    }
  } catch (e) {
    stdLogger.warn(`Failed to update access token ${e}`)
    return createError({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: 'Server encountered an auth error',
    })
  }
})
