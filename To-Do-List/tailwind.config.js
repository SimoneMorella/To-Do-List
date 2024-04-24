/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass-blue': '#05293D',
        'azure-comp': '#6DA1BD',
        'bg-complementary': '#BDA46D50',
        'alt-text': '#BDA46D',
        'main-bg': '#F0EBDF',
      },
      keyframes: {
        spawnRight: {
          '0%' : {opacity: 0, transform: 'translateX(5rem)'},
          '100%': {opacity: 1, transform: 'translateX(0)'},
        },
        floatLeft: {
          '0%': {transform: 'translateX(0)'},
          '50%': {transform: 'translateX(6px)'},
          '100%': {transform: 'translateX(0)'},
        },
        coolRotation: {
          '0%': {transform: 'rotateY(0)'},
          '50%': {transform: 'rotateY(120deg)'},
          '100%': {transform: 'rotateY(0)'},
        },
        spawnScaling: {
          '0%': {opacity: 0, transform: 'scale(0)'},
          '100%': {opacity: 1, transform: 'scale(1)'}
        }
      },
      animation: {
        spawnRight: 'spawnRight 0.7s ease-out',
        floatLeft: 'floatLeft 1.5s infinite',
        coolRotation: 'coolRotation 0.7s ease-in-out',
        spawnScale: 'spawnScaling 0.3s ease-in-out',
      },
      boxShadow: {
        'asideRight': '8px 0px 8px -7px #05293D',
      }
    },
    fontFamily: {
      'lobster': ['Lobster', 'system-ui'],
    }
  },
  plugins: [],
}

