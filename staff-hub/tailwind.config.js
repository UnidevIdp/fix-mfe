import baseConfig from '../../../packages/ui/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../../packages/ui/src/**/*.{js,ts,jsx,tsx}'
  ]
};