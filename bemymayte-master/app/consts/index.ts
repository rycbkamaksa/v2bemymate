const LS_KEYS = {
  jwt: 'jwt',
}

const COOKIES = {
  uid: 'db_uid',
}

const ROUTES = {
  withDbAccess: [
    /\/api\/send_email.*/,
    /\/api\/tokens.*/,
    /\/api\/users.*/,
    /\/api\/dataset.*/,
  ],

  authFree: [
    /\/login*./,
  ],

  regFree: [
    /\/login*./,
    /\/reg*./,
  ],
}

const MATCH_REG_LIMIT = 500
const RECENT_MATCHES_COUNT = 4
const QUALIFICATION_GAMES = 6

export {
  LS_KEYS,
  COOKIES,
  ROUTES,
  MATCH_REG_LIMIT,
  RECENT_MATCHES_COUNT,
  QUALIFICATION_GAMES,
}
