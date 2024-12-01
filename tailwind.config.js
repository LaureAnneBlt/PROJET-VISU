/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        lilita: ['"Lilita One"', "cursive"],
        roboto: ["Roboto", "sans-serif"],
      },
      rotate: {
        35: "35deg",
        40: "40deg",
      },
    },
  },
  plugins: [],
};
