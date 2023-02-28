/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        extralightpurple: "#ebe4f5",
        lightpurple: "#ac7ff5",
        darkpurple: "#8e65cf",
        mediumyellow: "#f2e679",
        darkyellow: "#e3d130",
      },
      fontFamily: {
        logo: "Cabin Sketch",
        body: "Work Sans",
        primary: "Playfair Display",
        secondary: "Kalam",
      },
    },
  },
  plugins: [],
};
