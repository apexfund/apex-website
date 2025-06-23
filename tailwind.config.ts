import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        backgroundLight: '#F1EDEE',
        backgroundDark: '#121212',
        navLight: '#F1EDEE',
        navDark: '#121212',
        accent: '#96BFCF'
      }
    }
  },
  plugins: []
}

export default config