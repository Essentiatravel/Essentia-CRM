import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['ca1e0a11-112d-477e-97e5-05e12af4e6ed-00-38w7t5ktvvd3s.spock.replit.dev'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
