import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
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
