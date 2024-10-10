// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // This ensures Tailwind scans your files
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
