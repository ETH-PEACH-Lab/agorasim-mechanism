/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/agorasim-mechanism',  // Your repo name here
};

module.exports = nextConfig;