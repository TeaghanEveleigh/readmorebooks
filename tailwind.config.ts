import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          primary: '#faf7f2',
          secondary: '#f4f0e8',
          card: '#ffffff',
          text: {
            primary: '#2d2926',
            secondary: '#6b6762',
            muted: '#9a958e',
          },
          accent: '#8b6914',
          'accent-hover': '#a17c1a',
          border: '#e6dfd4',
        },
        // Dark theme colors
        dark: {
          primary: '#1a1f2e',
          secondary: '#242b3d',
          card: '#2a3142',
          text: {
            primary: '#e2e8f0',
            secondary: '#94a3b8',
            muted: '#64748b',
          },
          accent: '#3b82f6',
          'accent-hover': '#2563eb',
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config