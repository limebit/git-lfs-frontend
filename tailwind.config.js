const { breakpointsStorybook } = require("./other/breakpoints");

const screens = {};
Object.keys(breakpointsStorybook).forEach((key) => {
  screens[key] = `${breakpointsStorybook[key].styles.width}px`;
});

module.exports = {
  content: [
    "./app/**/*.tsx",
    "./app/**/*.jsx",
    "./app/**/*.js",
    "./app/**/*.ts",
  ],
  theme: {
    screens,
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};
