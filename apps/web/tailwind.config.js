/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian dark theme
        background: '#07080a',
        surface: '#0e1117',
        'surface-hover': '#161b24',
        border: '#1f2530',
        'border-focus': '#3b82f6',
        accent: {
          indigo: '#5c6bc0',
          purple: '#ab47bc',
          emerald: '#66bb6a',
          rose: '#ef5350',
          blue: '#29b6f6',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px rgba(92, 107, 192, 0.25)',
        'glow-emerald': '0 0 25px rgba(102, 187, 106, 0.25)',
        'glow-purple': '0 0 25px rgba(171, 71, 188, 0.25)',
      }
    },
  },
  plugins: [],
}
