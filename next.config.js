// next.config.js
module.exports = {
  reactStrictMode: true,
  // Environment variables that will be exposed to the browser
  env: {
    PUBLIC_URL: process.env.VERCEL_URL || 'http://localhost:3000',
  },
};
