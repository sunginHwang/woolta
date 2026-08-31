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
