/** @type {import('next').NextConfig} */
const config = {
  devIndicators: false,
  reactStrictMode: true,
  serverRuntimeConfig: {
    projectRoot: __dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  eslint: {
    // 在生产构建期间忽略ESLint错误
    ignoreDuringBuilds: true,
  }
};

module.exports = config; 