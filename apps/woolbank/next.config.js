//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // local-ssl-proxy 로 HTTPS 도메인에서 접속할 때 Next dev 가 /_next 요청을
  // cross-origin 으로 보고 403 을 준다. 개발용 vhost 를 허용한다.
  allowedDevOrigins: ['bank-local.woolta.com'],
  transpilePackages: ['@woolta/common', '@woolta/wds'],
  experimental: {
    optimizePackageImports: ['@nivo/pie', 'lodash-es', '@woolta/wds'],
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
