//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // local-ssl-proxy 로 HTTPS 도메인에서 접속할 때 Next dev 가 /_next 요청을
  // cross-origin 으로 보고 403 을 준다. 개발용 vhost 를 허용한다.
  allowedDevOrigins: ['bank-local.woolta.com'],
  transpilePackages: [
    '@woolta/common',
    '@woolta/user-features',
    '@woolta/wds',
    '@woolta/woolbank-features',
    '@woolta/woolbank-screens',
  ],
  // 브라우저 GraphQL 호출을 동일 오리진으로 프록시해 CORS 를 우회한다 (쿠키가 그대로 전달된다).
  // 이관 기간에는 레거시 Koa 호스트(NEXT_PUBLIC_BANK_API)와 갈라져 있어 별도 경로를 쓴다.
  async rewrites() {
    return [
      {
        source: '/api/gql/:path*',
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_API ?? process.env.NEXT_PUBLIC_BANK_API}/:path*`,
      },
    ];
  },
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
