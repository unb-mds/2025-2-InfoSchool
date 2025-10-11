import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2C80FF',
        'background': '#2D2D2D',
        // ⬇️ SÓ ESTAS 3 CORES FALTANDO:
        'text': '#FFFFFF',
        'card': '#3A3A3A',
        'card-alt': '#323232',
      },
      textShadow: {
        'glow-light': '0 0 40px rgba(0, 0, 0, 0.8)',
        'glow-dark': '0 0 40px rgba(255, 255, 255, 0.3)',
      }
    },
  },
  plugins: [
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.text-glow-light': {
          textShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
        },
        '.text-glow-dark': {
          textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
  darkMode: 'class',
};

export default config;