const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        prodigy: '#a3e635'
      }
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities, theme }) {
      const prodigyColor = theme('colors.prodigy')

      addBase({
        ':root': {
          '--color-prodigy': theme('colors.prodigy'),
        }
      })

      addUtilities({
        '.prodigy': {
          color: prodigyColor,
          filter: `drop-shadow(0 0 10px ${prodigyColor})`,
        }
      })
    })
  ],
}