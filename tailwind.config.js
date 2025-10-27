/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors from poster
        brand: {
          DEFAULT: "#f97316", // Orange from poster title
          dark: "#ea580c",    // Darker orange
          light: "#fb923c",   // Lighter orange
        },
        // Haiti color palette from poster
        haiti: {
          navy: "#1e293b",      // Dark background
          midnight: "#0f172a",  // Deeper background
          teal: "#0891b2",      // Water/nature accents
          turquoise: "#06b6d4", // Bright water
          coral: "#f43f5e",     // Building accents
          emerald: "#059669",   // Nature/palm trees
          amber: "#f59e0b",     // Gold accents
          sky: "#0ea5e9",       // Sky elements
        },
      },
    },
  },
  plugins: [],
};
