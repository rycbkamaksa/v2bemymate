import { COOKIES } from '~/consts'
import { User } from '~/server/models/user'
import { stdLogger } from '~/server/consts/loggers'
import { useQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const { email } = useQuery(event)
  let acknowledged = false

  try {
    let { _id } = await User.findOne({ email }, '_id').exec()
    setCookie(event, COOKIES.uid, _id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      // неделя
      maxAge: 86400 * 7,
    })
    acknowledged = true
  } catch (e) {
    stdLogger.warn(`Failed to find user with email ${email}: ${e}`)
  }

  return {
    acknowledged,
  }
})
