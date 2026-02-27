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
        ones: {
          primary: '#1890ff',
          success: '#52c41a',
          warning: '#faad14',
          error: '#ff4d4f',
        },
      },
    },
  },
  plugins: [],
}

export default config