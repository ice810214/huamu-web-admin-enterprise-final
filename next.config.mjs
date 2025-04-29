/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
      domains: ["firebasestorage.googleapis.com"],
    },
  };
  
  export default nextConfig;
  