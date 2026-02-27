import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lego: {
          yellow: '#FFCF00',
          red: '#E3000B',
          blue: '#0055BF',
          green: '#237841',
          black: '#1B1B1B',
        }
      }
    },
  },
  plugins: [],
}
export default config
