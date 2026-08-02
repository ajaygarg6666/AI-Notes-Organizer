/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Study-focused palette: deep indigo (focus/depth) + warm amber (highlight/energy)
        ink: '#1B1B2F',
        surface: '#FFFFFF',
        'surface-dark': '#14141F',
        primary: {
          50: '#EEF0FF',
          100: '#D9DDFF',
          400: '#6C6BF0',
          500: '#4F4CDE',
          600: '#3E3BC2',
          700: '#302E99',
        },
        accent: {
          400: '#F5A623',
          500: '#E8920C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
