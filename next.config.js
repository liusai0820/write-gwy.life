/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  eslint: {
    // 在生产构建期间忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

module.exports = config; 