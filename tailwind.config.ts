import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#334155',
            maxWidth: '100%',
            h1: {
              color: '#0f172a',
            },
            h2: {
              color: '#0f172a',
            },
            h3: {
              color: '#0f172a',
            },
            h4: {
              color: '#0f172a',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            img: {
              borderRadius: '0.5rem',
            },
          },
        },
        lg: {
          css: {
            h1: {
              marginBottom: '1.5rem',
            },
            h2: {
              marginTop: '2.5rem',
              marginBottom: '1rem',
            },
            img: {
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            p: {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
