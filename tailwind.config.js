module.exports = {
  content: [
    "./src/**/*.{html,ts}", // This includes all HTML and TypeScript files in the src directory
  ],
  theme: {
    extend: {
      
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: Adds better default styles for form elements
    require('@tailwindcss/typography'), // Optional: Adds better typography styles
  ],
}

