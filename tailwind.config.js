/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Enable dark mode based on system preference
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
          sage: "#7c9885",      // Mountains/nature (was referenced but undefined)
          sand: "#f5eee5",      // Warm beach neutral, for light sections
          sunset: "#fb7185",    // Caribbean sunset rose
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(6, 182, 212, 0.45)",
        "glow-amber": "0 0 40px -8px rgba(245, 158, 11, 0.45)",
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
      },
    },
  },
  plugins: [],
};
