//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@woolta/common', '@woolta/wds'],
  async rewrites() {
    return [
      {
        source: '/site-map/categories.xml',
        destination: '/api/site-map/categories.xml',
      },
      {
        source: '/site-map/posts.xml',
        destination: '/api/site-map/posts.xml',
      },
    ];
  },
};

module.exports = withStylex(nextConfig);
