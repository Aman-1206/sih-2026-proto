/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#F4F2EC',
        'canvas-muted': '#EBE8DF',
        'canvas-card': '#FAF9F5',
        dark: '#0D1211',
        'dark-muted': '#192220',
        'dark-card': '#131B19',
        muted: '#747A75',
        'muted-light': '#9BA29C',
        'accent-lime': '#B7FF5A',
        'accent-blue': '#3D7BFF',
        'accent-amber': '#E5A93C',
        'accent-rose': '#F25F5C',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'display-2xl': 'clamp(3.5rem, 8vw, 7.5rem)',
        'display-xl': 'clamp(2.75rem, 6vw, 5.5rem)',
        'display-lg': 'clamp(2.25rem, 4.5vw, 4rem)',
        'display-md': 'clamp(1.75rem, 3.5vw, 2.75rem)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
};
