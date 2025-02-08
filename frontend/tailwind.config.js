/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
          light: '#8b5cf6',
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212'
        },
        text: {
          light: '#1F2937',
          dark: '#F3F4F6'
        }
      }
    }
  },
  plugins: [],
} 