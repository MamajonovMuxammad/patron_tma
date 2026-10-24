/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#09090B',
        cardDark: '#141418',
        cardBorder: 'rgba(139, 92, 246, 0.22)',
        neonPurple: '#7C3AED',
        neonPurpleHover: '#9333EA',
        neonPurpleLight: '#C084FC',
        textPrimary: '#FAFAFA',
        textSecondary: '#A1A1AA',
        textMuted: '#71717A',
        statusGreen: '#10B981',
        statusYellow: '#F59E0B',
        statusRed: '#EF4444',
      },
      boxShadow: {
        'glow-purple': '0 0 25px rgba(124, 58, 237, 0.35)',
        'glow-purple-lg': '0 0 40px rgba(147, 51, 234, 0.45)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
