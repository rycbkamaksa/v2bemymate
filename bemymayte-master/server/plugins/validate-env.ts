export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const missing: string[] = []

  if (!config.clientSecret) missing.push('NUXT_CLIENT_SECRET')
  if (!config.api_key) missing.push('NUXT_API_KEY')
  if (!config.dbUrl) missing.push('NUXT_DB_URL')
  if (!config.public.clientId) missing.push('NUXT_PUBLIC_CLIENT_ID')
  if (!config.public.searchHost) missing.push('NUXT_PUBLIC_SEARCH_HOST')

  if (missing.length) {
    throw new Error(
      `[env] Missing required environment variables: ${missing.join(', ')}. ` +
        `Copy bemymayte-master/.env.example to .env and fill in the values.`
    )
  }
})
