//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // local-ssl-proxy 로 HTTPS 도메인에서 접속할 때 Next dev 가 /_next 요청을
  // cross-origin 으로 보고 403 을 준다. 개발용 vhost 를 허용한다.
  allowedDevOrigins: ['local.woolta.com'],
  transpilePackages: [
    '@woolta/article-curations-features',
    '@woolta/article-curations-screens',
    '@woolta/common',
    '@woolta/wds',
    '@woolta/woolbank-features',
    '@woolta/woolbank-screens',
    '@woolta/blog-features',
    '@woolta/blog-screens',
    '@woolta/memo-features',
    '@woolta/memo-screens',
    '@woolta/todo-features',
    '@woolta/todo-screens',
    '@woolta/user-features',
    '@woolta/calendar-features',
    '@woolta/calendar-screens',
  ],
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
    ],
  },
  // 브라우저 API 호출을 동일 오리진으로 프록시해 CORS를 우회한다 (쿠키는 그대로 전달됨)
  async rewrites() {
    return [
      // woolta-api(GraphQL) 전용. 이관 기간에는 레거시 REST 호스트와 갈라져 있어 별도 경로를 쓴다.
      // 미설정 환경에서는 기존 blog 호스트로 폴백해 동작을 보존한다.
      {
        source: '/api/gql/:path*',
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_API ?? process.env.NEXT_PUBLIC_BLOG_API}/:path*`,
      },
      {
        source: '/api/bank/:path*',
        destination: `${process.env.NEXT_PUBLIC_BANK_API}/:path*`,
      },
      {
        source: '/api/blog/:path*',
        destination: `${process.env.NEXT_PUBLIC_BLOG_API}/:path*`,
      },
    ];
  },
};

module.exports = withStylex(nextConfig);
