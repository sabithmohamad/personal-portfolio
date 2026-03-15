import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#e8ecff',
        slate: '#91a0c6',
        mist: '#cad3f5',
        shell: '#09111f',
        panel: '#0f1728',
        line: 'rgba(160, 174, 208, 0.18)',
        accent: '#7dd3fc',
        accentWarm: '#f59e0b',
      },
      boxShadow: {
        soft: '0 20px 50px rgba(2, 6, 23, 0.35)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(160, 174, 208, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(160, 174, 208, 0.08) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 16px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        fadeUp: 'fadeUp 500ms ease forwards',
        pulseLine: 'pulseLine 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
