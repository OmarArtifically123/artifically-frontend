/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["artifically.com"],
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;