// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  env: {
    PUBLIC_URL: process.env.VERCEL_URL || 'http://localhost:3000',
  },
});
