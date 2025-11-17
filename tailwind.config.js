
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#111827',
        'dark-card': '#1F2937',
        'dark-card-hover': '#374151',
        'dark-border': '#4B5563',
        'sage': {
          DEFAULT: '#86A789',
          light: '#A8C4A8',
          dark: '#6B8E6B'
        },
        'text-primary': '#F9FAFB',
        'text-secondary': '#D1D5DB',
        'text-muted': '#9CA3AF'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
