import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable source maps for better error tracking in development
  productionBrowserSourceMaps: false,

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Development-specific settings
  ...(process.env.NODE_ENV === "development" && {
    // Enable more detailed error pages
    onDemandEntries: {
      // Period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // Number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  }),
};

export default nextConfig;
