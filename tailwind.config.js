/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // German Autumn - Warm oranges and deep blues (current theme)
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8ba6d',
          400: '#f59433',
          500: '#f2750a',
          600: '#e35a05',
          700: '#bc4308',
          800: '#96350e',
          900: '#792d0f',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Bavarian Forest - Deep greens and warm browns
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Rhine River - Cool blues and silvers
        rhine: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Black Forest - Rich purples and deep grays
        blackforest: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Alpine Snow - Clean whites and cool grays
        alpine: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // German Flag - Black, red, and gold
        flag: {
          black: '#000000',
          red: '#dd0000',
          gold: '#ffce00',
        }
      },
      backgroundImage: {
        // Current theme gradients
        'gradient-warm': 'linear-gradient(135deg, #fef7ff 0%, #f3fbff 50%, #f2fff6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #34d399 0%, #14b8a6 50%, #6366f1 100%)',
        'gradient-hero': 'linear-gradient(135deg, #fef7ff 0%, #eef9ff 50%, #f2fff6 100%)',
        
        // Bavarian Forest gradients
        'gradient-forest': 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
        'gradient-forest-accent': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        
        // Rhine River gradients
        'gradient-rhine': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
        'gradient-rhine-accent': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        
        // Black Forest gradients
        'gradient-blackforest': 'linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #7c3aed 100%)',
        'gradient-blackforest-accent': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        
        // Alpine Snow gradients
        'gradient-alpine': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-alpine-accent': 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        
        // German Flag gradients
        'gradient-flag': 'linear-gradient(135deg, #000000 0%, #dd0000 50%, #ffce00 100%)',
        'gradient-flag-accent': 'linear-gradient(135deg, #dd0000 0%, #ffce00 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
