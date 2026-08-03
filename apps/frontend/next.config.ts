import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-h5i4x53i4-arunausas-projects.vercel.app'
  }
};

export default nextConfig;
