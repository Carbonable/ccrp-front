import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0AF2AD',
          dark: '#087353',
          light: '#A9FCE4',
        },
        neutral: {
          100: '#D0D1D6',
          200: '#A8ABB3',
          300: '#878A94',
          400: '#555861',
          500: '#363840',
          600: '#2B2E36',
          700: '#1F2128',
          800: '#13151C',
          900: '#0B0D13',
        },
        greenish: {
          100: '#DDF6EB',
          200: '#BAEED7',
          300: '#75D9AD',
          400: '#47C48E',
          500: '#29A46F',
          600: '#22875B',
          700: '#1B6B49',
          800: '#145136',
          900: '#0E3725',
          1000: '#082015',
        },
        opacityLight: {
          5: 'rgba(208, 209, 214, 0.05)',
          10: 'rgba(208, 209, 214, 0.1)',
          20: 'rgba(208, 209, 214, 0.2)',
          30: 'rgba(208, 209, 214, 0.3)',
          60: 'rgba(208, 209, 214, 0.6)',
          70: 'rgba(208, 209, 214, 0.7)',
          80: 'rgba(208, 209, 214, 0.8)',
          90: 'rgba(208, 209, 214, 0.9)',
        },
        opacityDark: {
          40: 'rgba(11, 13, 19, 0.4)',
          50: 'rgba(11, 13, 19, 0.5)',
          60: 'rgba(11, 13, 19, 0.6)',
          70: 'rgba(11, 13, 19, 0.7)',
          80: 'rgba(11, 13, 19, 0.8)',
          90: 'rgba(11, 13, 19, 0.9)',
        },
      },
      backgroundImage: {
        planification:
          "linear-gradient(50.39deg, rgba(11, 13, 19, 0.5) 15.27%, rgba(19, 21, 28, 0.5) 46.91%, rgba(31, 33, 40, 0.5) 91.42%), url('/assets/images/backgrounds/bg-planification.png');",
        'project-info':
          'linear-gradient(166.49deg, #13151C 32.69%, rgba(0, 0, 0, 0) 170.72%), linear-gradient(270deg, rgba(168, 196, 239, 0.4) 23.44%, rgba(10, 242, 173, 0.4) 48.44%);',
        'project-header':
          'linear-gradient(270deg, rgba(168, 196, 239, 0.1) 39.58%, rgba(10, 242, 173, 0.1) 100%);',
        'project-header-border':
          'linear-gradient(270deg, rgba(168, 196, 239, 0.1) 39.58%, rgba(10, 242, 173, 0.1) 100%);',
        'beta-button':
          'linear-gradient(180deg, rgba(11, 255, 138, 0.4) 0%, rgba(113, 170, 255, 0.4) 100%);',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
