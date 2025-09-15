// src/styles/theme/hero.ts - Ensure this is the exact content
import { heroui } from "@heroui/react";

// ✅ Make sure you're using default export for Tailwind v4 @plugin directive
export default heroui({
  prefix: "heroui",
  addCommonColors: true,
  defaultTheme: "light",
  defaultExtendTheme: "light",
  // ... rest of your configuration
});

// Alternative if the above doesn't work:
// export const heroTheme = heroui({ /* config */ });
