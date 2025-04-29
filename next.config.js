// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  experimental: {
    serverActions: true,  // 支援 app router 的 server action
  },
};

module.exports = nextConfig;
