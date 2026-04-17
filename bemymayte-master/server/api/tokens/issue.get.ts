import type { IUser } from '~/types/user'
import { COOKIES } from '~/consts'
import { User } from '~/server/models/user'
import { api } from '~/services/api'
import { attachedLogger, stdLogger } from '~/server/consts/loggers'
import jwtDecode from 'jwt-decode'

export default defineEventHandler(async (event) => {
  const { code } = useQuery(event)

  const { access_token, refresh_token, id_token, expires_in } = await api.requestTokens(String(code))
  const tokensData = {
    access_token,
    refresh_token,
    token_valid_until: Date.now() + 1000 * expires_in,
  }
  const data = jwtDecode(id_token) as IUser

  let reg_completed = false
  let desiredUser = await User.findOne({ email: data.email }, '_id reg_completed token_valid_until').exec()
  if (desiredUser !== null) {
    attachedLogger.info(`User with email ${data.email} already exists => skipping reg`)
    // если есть - обновляем только его токены
    reg_completed = desiredUser.reg_completed
    const res = await User.updateOne({ _id: desiredUser._id }, {
      ...tokensData,
    })

    if (!res.acknowledged) {
      stdLogger.warn(`Failed to update User, ${desiredUser._id}`)
    }
  } else {
    // иначе, добавляем нового пользователя в бд и достаем присвоенный ему id
    desiredUser = await new User({
      ...data,
      ...tokensData,
      reg_completed,
    }).save()

    attachedLogger.info(`Adding new User with id: ${desiredUser._id.toString()}`)
  }

  setCookie(event, COOKIES.uid, desiredUser._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    // неделя
    maxAge: 86400 * 7,
  })

  // TODO: add a separate interface for this response
  return {
    id_token,
    reg_completed,
  }
})
