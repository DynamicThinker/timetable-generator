/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enforce ESLint during builds to catch issues early
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail builds on TS errors for correctness
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
