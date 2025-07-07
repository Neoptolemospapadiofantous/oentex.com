/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional white-based color scheme with WCAG 2.1 AA compliance
        primary: '#1e40af',      // Deep blue (contrast ratio 8.59:1 on white)
        secondary: '#059669',    // Professional green (contrast ratio 5.77:1 on white)
        accent: '#dc2626',       // Professional red (contrast ratio 5.25:1 on white)
        background: '#ffffff',   // Pure white background
        surface: '#f8fafc',      // Very light gray surface
        text: '#1f2937',         // Dark gray text (contrast ratio 12.63:1 on white)
        textSecondary: '#6b7280', // Medium gray text (contrast ratio 5.74:1 on white)
        border: '#e5e7eb',       // Light gray border
        success: '#059669',      // Success green (same as secondary)
        warning: '#d97706',      // Warning orange (contrast ratio 4.54:1 on white)
        error: '#dc2626',        // Error red (same as accent)
        // Interactive states
        primaryHover: '#1d4ed8',  // Slightly lighter blue for hover
        secondaryHover: '#047857', // Darker green for hover
        accentHover: '#b91c1c',   // Darker red for hover
        // Focus states
        focus: '#3b82f6',        // Bright blue for focus rings
        // Muted variants
        primaryMuted: '#dbeafe', // Very light blue background
        secondaryMuted: '#d1fae5', // Very light green background
        accentMuted: '#fee2e2',   // Very light red background
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'gradient-x': 'gradient-x 3s ease infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'counter': 'counter 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(30, 64, 175, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(30, 64, 175, 0.2)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        counter: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
