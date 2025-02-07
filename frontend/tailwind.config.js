/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
        },
        secondary: {
          DEFAULT: '#EC4899',
          dark: '#DB2777',
          light: '#F472B6',
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