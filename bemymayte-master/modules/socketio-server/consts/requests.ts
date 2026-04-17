// TODO: можно вместо проксирования через бэк ходить напрямую в бд
export const BASE_APP_HOST = `http://${process.env.APP_HOST || 'localhost'}:3000`
export const BASE_APP_URL = `${BASE_APP_HOST}/api`
export const DB_URL = process.env.DB_URL as string
