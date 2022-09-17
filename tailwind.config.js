/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,html,css}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: '#1e293b',
      secondary: '#64748b',
      light: '#e2e8f0',
    },
    fontFamily: {
      sans: [
        'Atkinson', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif',
      ]
    },
    extend: {},
  },
  plugins: [],
}
