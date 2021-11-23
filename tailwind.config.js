module.exports = {
  purge: ['./public/**/*.html', './src/**/*.vue'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'focus-purple': '#eb369d'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
