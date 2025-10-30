import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Optimize for Vercel deployment
  serverExternalPackages: ["@openai/chatkit-react"],

  // Webpack configuration
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
