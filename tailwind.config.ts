import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hertford: {
          green: '#2d5016',
          gold: '#d4a843',
          cream: '#faf8f0',
          dark: '#1a1a2e',
          blue: '#16213e',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
