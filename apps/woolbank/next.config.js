//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@woolta/common', '@woolta/wds'],
  experimental: {
    optimizePackageImports: ['@nivo/pie', 'lodash-es', '@woolta/wds'],
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
    ],
  },
};

const config = withStylex(nextConfig);

// SVGR support — withStylex(turbopack)가 turbopack.rules를 재정의하므로 사후 병합
config.turbopack ??= {};
config.turbopack.rules ??= {};
config.turbopack.rules['*.svg'] = {
  loaders: ['@svgr/webpack'],
  as: '*.js',
};

module.exports = config;
