// src/styles/theme/hero.ts - Optimized HeroUI Theme (centered + sharper + accent)
// 
// 🎨 PADDING SYSTEM USAGE:
// 
// Base Padding Classes:
// - .p-xs, .p-sm, .p-md, .p-lg, .p-xl, .p-2xl, .p-3xl, .p-4xl, .p-5xl, .p-6xl
// - .px-xs, .px-sm, .px-md, .px-lg, .px-xl, .px-2xl, .px-3xl, .px-4xl, .px-5xl, .px-6xl
// - .py-xs, .py-sm, .py-md, .py-lg, .py-xl, .py-2xl, .py-3xl, .py-4xl, .py-5xl, .py-6xl
//
// Section Padding Classes (for page sections):
// - .section-p-xs, .section-p-sm, .section-p-md, .section-p-lg, .section-p-xl, .section-p-2xl, .section-p-3xl, .section-p-4xl
// - .section-px-xs, .section-px-sm, .section-px-md, .section-px-lg, .section-px-xl, .section-px-2xl, .section-px-3xl, .section-px-4xl
// - .section-py-xs, .section-py-sm, .section-py-md, .section-py-lg, .section-py-xl, .section-py-2xl, .section-py-3xl, .section-py-4xl
//
// Container Padding Classes (for content containers):
// - .container-p-xs, .container-p-sm, .container-p-md, .container-p-lg, .container-p-xl, .container-p-2xl
// - .container-px-xs, .container-px-sm, .container-px-md, .container-px-lg, .container-px-xl, .container-px-2xl
// - .container-py-xs, .container-py-sm, .container-py-md, .container-py-lg, .container-py-xl, .container-py-2xl
//
// Examples:
// <div className="section-px-lg section-py-xl">Page section with large horizontal and extra-large vertical padding</div>
// <div className="container-px-md container-py-sm">Content container with medium horizontal and small vertical padding</div>
// <div className="p-lg">Element with large padding on all sides</div>
//
import { heroui } from "@heroui/react";

export default heroui({
  prefix: "heroui",
  addCommonColors: false,
  defaultTheme: "dark",
  defaultExtendTheme: "dark",

  layout: {
    fontSize: {
      tiny: "0.75rem",
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem",
    },
    lineHeight: {
      tiny: "1rem",
      small: "1.25rem",
      medium: "1.5rem",
      large: "1.75rem",
    },
    radius: {
      small: "0.375rem",
      medium: "0.5rem",
      large: "0.75rem",
    },
    borderWidth: {
      small: "1px",
      medium: "2px",
      large: "3px",
    },
    disabledOpacity: 0.5,
    hoverOpacity: 0.85, // slightly crisper
    dividerWeight: "1px",
  },

  themes: {
    light: {
      layout: {
        hoverOpacity: 0.8,
        boxShadow: {
          small: "0 2px 8px 0 rgb(0 0 0 / 0.08)",
          medium: "0 6px 14px 0 rgb(0 0 0 / 0.14)", // a touch sharper
          large: "0 12px 28px 0 rgb(0 0 0 / 0.18)",
        },
      },
      colors: {
        background: "#ffffff",
        foreground: "#0b0b0e",
        content1: "#ffffff",
        content2: "#f8fafc",
        content3: "#f1f5f9",
        content4: "#e2e8f0",
        focus: "#2563eb",
        overlay: "#000000",
        divider: "#e5e7eb",

        default: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          foreground: "#ffffff",
          DEFAULT: "#64748b",
        },

        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#1e40af",
          foreground: "#ffffff",
          DEFAULT: "#2563eb",
        },

        secondary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          foreground: "#ffffff",
          DEFAULT: "#16a34a",
        },


        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          foreground: "#ffffff",
          DEFAULT: "#16a34a",
        },

        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          foreground: "#ffffff",
          DEFAULT: "#d97706",
        },

        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          foreground: "#ffffff",
          DEFAULT: "#dc2626",
        },
      },
    },

    dark: {
      layout: {
        hoverOpacity: 0.9,
        boxShadow: {
          small: "0 2px 8px 0 rgb(0 0 0 / 0.28)",
          medium: "0 6px 16px 0 rgb(0 0 0 / 0.36)",
          large: "0 14px 32px 0 rgb(0 0 0 / 0.54)",
        },
      },
      colors: {
        background: "#0b0b0e",
        foreground: "#f5f5f6",
        content1: "#121215",
        content2: "#1b1b20",
        content3: "#2a2a31",
        content4: "#3a3a44",
        focus: "#60a5fa",
        overlay: "#000000",
        divider: "#26262c",

        default: {
          50: "#0b0b0e",
          100: "#121215",
          200: "#1b1b20",
          300: "#2a2a31",
          400: "#3a3a44",
          500: "#6e6e78",
          600: "#9b9ba3",
          700: "#cfcfd7",
          800: "#e6e6ea",
          900: "#f3f3f5",
          foreground: "#0b0b0e",
          DEFAULT: "#6e6e78",
        },

        primary: {
          50: "#1e3a8a",
          100: "#1e40af",
          200: "#1d4ed8",
          300: "#2563eb",
          400: "#3b82f6",
          500: "#60a5fa",
          600: "#93c5fd",
          700: "#bfdbfe",
          800: "#dbeafe",
          900: "#eff6ff",
          foreground: "#0b0b0e",
          DEFAULT: "#60a5fa",
        },

        secondary: {
          50: "#14532d",
          100: "#166534",
          200: "#15803d",
          300: "#16a34a",
          400: "#22c55e",
          500: "#4ade80",
          600: "#86efac",
          700: "#bbf7d0",
          800: "#dcfce7",
          900: "#f0fdf4",
          foreground: "#0b0b0e",
          DEFAULT: "#4ade80",
        },


        success: {
          50: "#14532d",
          100: "#166534",
          200: "#15803d",
          300: "#16a34a",
          400: "#22c55e",
          500: "#4ade80",
          600: "#86efac",
          700: "#bbf7d0",
          800: "#dcfce7",
          900: "#f0fdf4",
          foreground: "#0b0b0e",
          DEFAULT: "#4ade80",
        },

        warning: {
          50: "#78350f",
          100: "#92400e",
          200: "#b45309",
          300: "#d97706",
          400: "#f59e0b",
          500: "#fbbf24",
          600: "#fcd34d",
          700: "#fde68a",
          800: "#fef3c7",
          900: "#fffbeb",
          foreground: "#0b0b0e",
          DEFAULT: "#fbbf24",
        },

        danger: {
          50: "#7f1d1d",
          100: "#991b1b",
          200: "#b91c1c",
          300: "#dc2626",
          400: "#ef4444",
          500: "#f87171",
          600: "#fca5a5",
          700: "#fecaca",
          800: "#fee2e2",
          900: "#fef2f2",
          foreground: "#0b0b0e",
          DEFAULT: "#f87171",
        },
      },
    },
  },
});
