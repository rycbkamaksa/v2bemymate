import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'app/',

  runtimeConfig: {
    clientSecret: '',
    api_key: '',
    dbUrl: '',
    public: {
      searchHost: '',
      clientId: '',
      landing_mode: false,
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // ./modules/socketio-server is our standalone Express + Socket.IO server, NOT a Nuxt module.
  // Point Nuxt's modules auto-discovery to a non-existent directory to skip scanning.
  dir: {
    modules: '_nuxt-modules',
  },

  css: ['@/assets/css/main.css'],

  ssr: false,

  app: {
    head: {
      script: [
        { src: '/js/lottie.js' },
        ...process.env.NODE_ENV === 'production' ? [
          { src: '/js/metric-tags.js' },
          {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-4B74J0SXGK',
            async: true,
          },
          ] : [],
      ],
    }
  }
})
