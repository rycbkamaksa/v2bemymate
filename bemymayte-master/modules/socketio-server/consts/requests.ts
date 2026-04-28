// TODO: можно вместо проксирования через бэк ходить напрямую в бд
const DB_URL_RAW = process.env.DB_URL
if (!DB_URL_RAW) {
  throw new Error(
    '[env] Missing required environment variable: DB_URL. ' +
      'Copy bemymayte-master/modules/socketio-server/.env.example to .env and fill in the value.'
  )
}

export const BASE_APP_HOST = `http://${process.env.APP_HOST || 'localhost'}:3000`
export const BASE_APP_URL = `${BASE_APP_HOST}/api`
export const DB_URL = DB_URL_RAW
