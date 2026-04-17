import type { IUser } from '~/types/user'
import { COOKIES } from '~/consts'
import { User } from '~/server/models/user'
import { Stat } from '~/server/models/stat'
import jwt from 'jsonwebtoken'
import { faker } from '@faker-js/faker'
import { getQuery } from 'h3'
import { wrapError } from '~/utils'
import { attachedLogger } from '~/server/consts/loggers'

// Добавляет замоканного пользователя в базу, как будто он зареган
// через параметры AWP, role можно задать роли юзера
export default defineEventHandler(async (event) => {
  const { mainRole, role, wins, guid } = getQuery(event)

  const data = {
    picture: faker.internet.avatar(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate().toDateString(),
    nickname: faker.random.word() + faker.random.alphaNumeric(15),
    locale: 'ru',
    memberships: ['free'],
    // guid: '4cd0d638-8cf3-4770-8b44-d6576f69d2a5',
    guid: guid ? String(guid) : faker.random.alphaNumeric(36),
    given_name: faker.name.firstName(),
    family_name: faker.name.lastName(),
    email_verified: true,
    iss: 'http://bemymate-app/',
    aud: '',
  } as IUser

  const newUser = await wrapError(new User({
    ...data,
    token_valid_until: Date.now() + 604800000,
    main_role: mainRole ? mainRole : 'Rifler',
    secondary_roles: role ? [role] : faker.helpers.arrayElements(['IGL', 'Entry', 'Support', 'Anchor', 'Lurker'], 2),
    city: faker.address.city(),
    gender: faker.helpers.arrayElement(['male', 'female']),
    reg_completed: true,
  }).save(), (err) => {
    attachedLogger.warn(`Failed to create mock user: ${err}`)
    return null
  })

  if (!newUser) {
    return null
  }

  const roleStats = {}
  newUser.secondary_roles.forEach((role) => {
    roleStats[role] = {
      wins: wins? Number(wins) : 10,
      loses: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      rating: 0,
    }
  })

  await wrapError(new Stat({guid: newUser.guid, ...roleStats}).save(), (err) => {
    attachedLogger.warn(`Failed to create mock stat for user ${newUser._id}: ${err}`)
  })

  setCookie(event, COOKIES.uid, newUser._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 86400 * 7,
  })

  const generatedJWT = jwt.sign(data, 'AL60AMMiRduMp2OrcAMXXQEnr2OBIdbwOaOhJEaBsJqG0WmecbPBGM_WaCyz91ooSP7B1OfXKZb7YmSuE4REpv9GUBNyV3DNwD5z2nr9o0B6etme3Vt1xiD5_e68H9Jvv2SAAQyEI1zHOdFQwCAkVA6Byeh5ziyKX30TNegCM_ix')
  return {
    jwt: generatedJWT,
  }
})
