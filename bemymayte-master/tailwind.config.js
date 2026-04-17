/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    screens: {
      'mobile': '375px',
      'vtablet': '895px',
      'tablet': '1170px',
    },

    extend: {
      colors: {
        background: 'rgba(255, 255, 255, 0.08)',
        dark: '#212224',
        'deep-dark': '#0E0F11',
        purple: '#9557FF',
        'grey-20': '#323232',
        'light-grey': '#BFBFBF',
        'soft-grey': '#4D4D4D',
        'grey-56': '#8F8F8F',
        'dirty-grey': '#636465',

        toxic: '#1F492F',
        'on-toxic': '#03D34A',

        fail: '#492632',
        'on-fail': '#EC396B',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
