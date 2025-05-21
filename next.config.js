// next.config.js
module.exports = {
  reactStrictMode: true,
  // Disable static optimization for pages
  // that use browser APIs
  unstable_runtimeJS: true,
  
  // Disable image optimization to simplify build
  images: {
    disableStaticImages: true,
  },
  
  // Use trailing slash to normalize URLs
  trailingSlash: true,
  
  // Environment variables that will be exposed to the browser
  env: {
    PUBLIC_URL: process.env.VERCEL_URL || 'http://localhost:3000',
  },
  
  // Add this to handle runtime errors better
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  
  // Handle unexpected errors better during build
  webpack: (config, { isServer }) => {
    // Add fallbacks for browser APIs
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};
