/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,html,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // dark: '#000',
        // light: '#fff',
        // primary: '#1e293b',
        // secondary: '#64748b',
        // night: '#312E81',
        // day: '#EFF6FF',
        // twilight: '#A5B4FC',
        // 'disabled-overlay': '#888888',
      },
    },
    fontFamily: {
      sans: [
        'Abel', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif',
      ]
    }
  },
  plugins: [],
}
