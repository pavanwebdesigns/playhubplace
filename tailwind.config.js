/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Colors from Figma
        primary: {
          dark: '#0a0e1a',
          blue: '#2349A3',
          light: '#2a3142',
        },
        secondary: {
          white: '#ffffff',
          gray: '#9ca3af',
          light: '#e5e7eb',
        },
        accent: {
          blue: '#2349A3',
          purple: '#6D68CC',
          pink: '#AC3BAF',
        },
        // Additional Colors from Figma
        brand: {
          'purple-dark': '#38086D',
          'purple-medium': '#302181',
          'blue-light': '#117FD0',
          'blue-bright': '#00B7FF',
          'blue-cyan': '#1FA0F0',
          'pink-dark': '#D91B9A',
          'pink-bright': '#FF0089',
        },
      },
      fontFamily: {
        'jersey': ['Jersey 15', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
