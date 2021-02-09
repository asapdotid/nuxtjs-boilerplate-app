module.exports = {
  purge: {
    // enable remove unused CSS only in production
    enabled: process.env.NODE_ENV === 'production',
    // any file that contain the reference of CSS styles by the class
    content: [
      './components/**/*.{vue,js}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
