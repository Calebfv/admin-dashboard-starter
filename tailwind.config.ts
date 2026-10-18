import type { Config } from 'tailwindcss'

const withAlpha = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      boxShadow: {
        popover: '0 16px 40px -20px hsl(var(--foreground) / 0.3)',
      },
      keyframes: {
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'view-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 240ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'toast-in': 'toast-in 280ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'view-in': 'view-in 320ms cubic-bezier(0.16, 1, 0.3, 1) backwards',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: withAlpha('--background'),
        foreground: withAlpha('--foreground'),
        card: withAlpha('--card'),
        muted: withAlpha('--muted'),
        'muted-foreground': withAlpha('--muted-foreground'),
        border: withAlpha('--border'),
        ring: withAlpha('--ring'),
        primary: withAlpha('--primary'),
        'primary-foreground': withAlpha('--primary-foreground'),
        accent: withAlpha('--accent'),
        success: withAlpha('--success'),
        warning: withAlpha('--warning'),
        destructive: withAlpha('--destructive'),
      },
    },
  },
  plugins: [],
} satisfies Config
