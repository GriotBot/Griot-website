// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PUBLIC_URL: process.env.VERCEL_URL || 'http://localhost:3000',
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
  // Optimize images
  images: {
    domains: [],
  },
}

module.exports = nextConfig
