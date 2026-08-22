/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#101c30',
        'navy-2': '#182a45',
        saffron: '#df8a3f',
        'saffron-deep': '#c96e26',
        gold: '#c8a45e',
        cream: '#f6efe1',
        ink: '#1c2333',
      },
      fontFamily: {
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at 50% 30%, rgba(223,138,63,0.18), transparent 60%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        fadeIn: 'fadeIn 1.2s ease forwards',
        softPulse: 'softPulse 4s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        scaleIn: 'scaleIn 1s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
};
