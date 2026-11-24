/** @type {import('tailwindcss').Config} */
// Colors are CSS variables (src/index.css) so light/dark flips without touching components.
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
const scale = (name, shades) => Object.fromEntries(shades.map((s) => [s, v(`${name}-${s}`)]));

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        white: v('ink'),
        slate: scale('slate', [100, 200, 300, 400, 500, 600, 700, 800]),
        dark: scale('dark', [600, 700, 800, 850, 900, 950]),
        cyan: scale('cyan', [300, 400, 500, 950]),
        purple: scale('purple', [300, 400, 500, 600]),
        indigo: scale('indigo', [400, 500, 600, 950]),
        emerald: scale('emerald', [300, 400, 500]),
        amber: scale('amber', [300, 400, 500]),
        rose: scale('rose', [300, 400, 500]),
        blue: scale('blue', [300, 400, 500, 600]),
        grid: v('grid'),
        brand: { orange: '#FF7A3D', pink: '#FF5D8F', violet: '#8B5CF6', mint: '#34D399', sun: '#FFC83D', sky: '#60A5FA' }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace']
      },
      // fluid editorial type scale
      fontSize: {
        display: ['clamp(3.5rem, 13vw, 12rem)', { lineHeight: '0.86', letterSpacing: '-0.045em', fontWeight: '800' }],
        title: ['clamp(2.25rem, 7vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.035em', fontWeight: '800' }],
        label: ['0.7rem', { lineHeight: '1', letterSpacing: '0.24em', fontWeight: '600' }]
      },
      letterSpacing: { tightest: '-0.06em', wideish: '0.12em', ultra: '0.32em' },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)'
      },
      transitionDuration: { 600: '600ms', 900: '900ms' },
      borderWidth: { 3: '3px' },
      keyframes: {
        marquee: { to: { transform: 'translateX(-100%)' } },
        flicker: { '0%,100%': { opacity: '1' }, '45%': { opacity: '0.55' }, '50%': { opacity: '1' }, '80%': { opacity: '0.8' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        caret: { '50%': { opacity: '0' } },
        rise: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'none' } }
      },
      animation: {
        flicker: 'flicker 3s steps(1) infinite',
        scan: 'scan 4s linear infinite',
        caret: 'caret 1s steps(1) infinite',
        rise: 'rise 0.8s cubic-bezier(0.16,1,0.3,1) both'
      }
    }
  },
  plugins: []
};
