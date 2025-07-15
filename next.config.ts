/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/agorasim-mechanism',
  assetPrefix: '/agorasim-mechanism/',   // 👈 This tells Next.js where to load JS/CSS from
};

module.exports = nextConfig;
