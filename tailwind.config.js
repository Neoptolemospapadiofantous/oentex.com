const {heroui} = require('@heroui/theme');
// tailwind.config.js
import { nextui } from "@heroui/react"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  plugins: [nextui({ /* your themes here */ }),heroui()],
}