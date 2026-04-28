import { io } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  if (config.public.landing_mode) {
    return
  }

  const socket = io(config.public.searchHost, {
    withCredentials: true,
    secure: true,
  })

  return {
    provide: {
      socket,
    }
  }
})
