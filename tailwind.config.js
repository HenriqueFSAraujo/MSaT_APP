/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'montreal': {
          'primary': '#344258',
          'secondary': '#285A6C',
          'blue': '#3B5C69',
          'red': '#811811',
          'gray': '#515151',
          'green': '#46CB64',
        },
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: {
          xxl: "2560px",
          xl: "1440px",
          lg: "1280px",          
          md: "768px",
          sm: "425px",          
          xs: "360px"
        },
        maxWidth: {
          DEFAULT: "max-w-xl",
        },
      },
      transitionProperty: {
        height: "max-height",
      },
    },
  },
  plugins: [],
};

