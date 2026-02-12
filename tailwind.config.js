/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      "edu-sa": ["Edu SA Beginner", "cursive"],
      mono: ["Roboto Mono", "monospace"],
    },
    colors: {
      white: "#fff",
      black: "#000",
      transparent: "#ffffff00",
      richblack: {
        5: "#FFFFFF", // Pure White
        25: "#F5F5F5", // Off White
        50: "#E5E5E5", // Light Gray
        100: "#D4D4D4", // Light Silver
        200: "#A3A3A3", // Gray
        300: "#737373", // Mid Gray
        400: "#525252", // Dark Gray
        500: "#404040", // Darker Gray
        600: "#262626", // Almost Black
        700: "#171717", // Card/Modal BG (Soft Black)
        800: "#0A0A0A", // Secondary BG (Navbar/Sidebar)
        900: "#050505", // Main BG (Softer Black)
      },
      richblue: {
        5: "#E0F7FA",
        25: "#B2EBF2",
        50: "#80DEEA",
        100: "#4DD0E1",
        200: "#26C6DA",
        300: "#00BCD4",
        400: "#00ACC1",
        500: "#0097A7",
        600: "#00838F",
        700: "#006064",
        800: "#004D40", // Cyan Deep
        900: "#00332C",
      },
      blue: {
        5: "#F3E5F5",
        25: "#E1BEE7",
        50: "#CE93D8",
        100: "#BA68C8",
        200: "#AB47BC",
        300: "#9C27B0",
        400: "#8E24AA",
        500: "#7B1FA2", // Electric Purple
        600: "#6A1B9A",
        700: "#4A148C",
        800: "#38006B",
        900: "#220045",
      },
      caribbeangreen: {
        5: "#E0F2F1",
        25: "#B2DFDB",
        50: "#80CBC4",
        100: "#4DB6AC",
        200: "#26A69A",
        300: "#009688",
        400: "#00897B",
        500: "#00796B",
        600: "#00695C",
        700: "#004D40",
        800: "#003333", // Dark Mint
        900: "#001A1A",
      },
      brown: {
        5: "#FFF4C4",
        25: "#FFE395",
        50: "#FFD166",
        100: "#E7BC5B",
        200: "#CFA64F",
        300: "#B89144",
        400: "#A07C39",
        500: "#88662D",
        600: "#705122",
        700: "#593C17",
        800: "#41260B",
        900: "#291100",
      },
      pink: {
        5: "#FFF1F1",
        25: "#FBC7D1",
        50: "#F79CB0",
        100: "#F37290",
        200: "#EF476F",
        300: "#D43D63",
        400: "#BA3356",
        500: "#9F294A",
        600: "#841E3E",
        700: "#691432",
        800: "#4F0A25",
        900: "#340019",
      },
      yellow: {
        5: "#F0FFF4",
        25: "#C6F6D5",
        50: "#9AE6B4",
        100: "#68D391",
        200: "#00FF9D", // Neon Mint (Primary Action)
        300: "#00E08A",
        400: "#00C076",
        500: "#00A062",
        600: "#00804E",
        700: "#00603A",
        800: "#004026",
        900: "#002013",
      },
      "pure-greys": {
        5: "#F9F9F9",
        25: "#E2E2E2",
        50: "#CCCCCC",
        100: "#B5B5B5",
        200: "#9E9E9E",
        300: "#888888",
        400: "#717171",
        500: "#5B5B5B",
        600: "#444444",
        700: "#2D2D2D",
        800: "#171717",
        900: "#141414",
      },
    },
    extend: {
      maxWidth: {
        maxContent: "1260px",
        maxContentTab: "650px"
      },
    },
  },
  plugins: [],
};