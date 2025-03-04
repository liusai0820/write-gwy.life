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
  }
};

module.exports = config; 