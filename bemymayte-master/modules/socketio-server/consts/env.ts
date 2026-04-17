const REQUIRED_ENV = ['DB_URL'] as const

const missing = REQUIRED_ENV.filter((key) => !process.env[key])

if (missing.length) {
  console.error(`[env] Missing required environment variables: ${missing.join(', ')}`)
  console.error('[env] Copy bemymayte-master/modules/socketio-server/.env.example to .env and fill in the values.')
  process.exit(1)
}
