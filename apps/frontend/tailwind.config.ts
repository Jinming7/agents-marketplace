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
        // NexusFlow Design System - Apple/Stripe Inspired
        primary: {
          DEFAULT: '#007AFF',
          50: '#E5F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#007AFF',
          600: '#0066CC',
          700: '#004C99',
          800: '#003366',
          900: '#001933',
        },
        secondary: {
          DEFAULT: '#5856D6',
          50: '#EDEDFA',
          100: '#DBDBF5',
          200: '#B7B7EB',
          300: '#9393E1',
          400: '#6F6FD7',
          500: '#5856D6',
          600: '#4645AB',
          700: '#353480',
          800: '#232055',
          900: '#12102B',
        },
        success: {
          DEFAULT: '#34C759',
          50: '#E8F9EC',
          100: '#D1F3D9',
          200: '#A3E7B3',
          300: '#75DB8D',
          400: '#47CF67',
          500: '#34C759',
          600: '#2A9F47',
          700: '#207735',
          800: '#164F23',
          900: '#0B2711',
        },
        warning: {
          DEFAULT: '#FF9500',
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE399',
          300: '#FFD566',
          400: '#FFC733',
          500: '#FF9500',
          600: '#CC7700',
          700: '#995900',
          800: '#663C00',
          900: '#331E00',
        },
        error: {
          DEFAULT: '#FF3B30',
          50: '#FFEBEA',
          100: '#FFD7D5',
          200: '#FFAFAB',
          300: '#FF8781',
          400: '#FF5F57',
          500: '#FF3B30',
          600: '#CC2F26',
          700: '#99231C',
          800: '#661713',
          900: '#330B09',
        },
        // Semantic colors
        ink: '#111827',
        slate: '#6B7280',
        mist: '#F7F8FA',
        cloud: '#FFFFFF',
        void: '#0a0a0a',
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display': ['5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'headline': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subhead': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
        '50': '12.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        'capsule': '9999px',
      },
      boxShadow: {
        'soft': `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.02),
          0 8px 16px rgba(0, 0, 0, 0.04)
        `,
        'soft-md': `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 4px 8px rgba(0, 0, 0, 0.04),
          0 16px 32px rgba(0, 0, 0, 0.06)
        `,
        'soft-lg': `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 8px 16px rgba(0, 0, 0, 0.06),
          0 32px 64px rgba(0, 0, 0, 0.08)
        `,
        'glow': '0 0 60px rgba(0, 122, 255, 0.15)',
        'glow-md': '0 0 80px rgba(0, 122, 255, 0.2)',
        'glow-lg': '0 0 120px rgba(0, 122, 255, 0.25)',
        'card': `
          0 0 0 1px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.02),
          0 8px 16px rgba(0, 0, 0, 0.04),
          0 24px 48px rgba(0, 0, 0, 0.06),
          0 0 80px rgba(0, 122, 255, 0.08)
        `,
        'card-hover': `
          0 0 0 1px rgba(0, 122, 255, 0.08),
          0 4px 8px rgba(0, 0, 0, 0.04),
          0 16px 32px rgba(0, 0, 0, 0.08),
          0 32px 64px rgba(0, 0, 0, 0.1),
          0 0 120px rgba(0, 122, 255, 0.15)
        `,
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'gentleFloat 6s ease-in-out infinite',
        'breathe': 'breatheGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        breatheGlow: {
          '0%, 100%': { boxShadow: '0 0 60px rgba(0, 122, 255, 0.1)' },
          '50%': { boxShadow: '0 0 80px rgba(0, 122, 255, 0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}

export default config