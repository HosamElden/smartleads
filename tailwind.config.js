export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hamied Design System
        'primary': '#0F766E',
        'primary-hover': '#0D9488',
        'secondary': '#0EA5E9',
        'accent': '#F59E0B',
        'header-scrolled': '#0B2E4F',
        'header-accent': '#FFD166',
        
        // Keep existing (optional, for gradual migration)
        'primary-blue': '#1A73E8',
        'primary-green': '#009688',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
