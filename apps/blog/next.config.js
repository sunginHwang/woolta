//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@woolta/blog-features',
    '@woolta/blog-screens',
    '@woolta/common',
    '@woolta/user-features',
    '@woolta/wds',
  ],
  async rewrites() {
    return [
      // 브라우저 GraphQL 호출을 동일 오리진으로 프록시해 CORS 를 우회한다 (쿠키가 그대로 전달된다).
      // 이관 기간에는 레거시 REST 호스트와 갈라져 있어 별도 경로를 쓴다.
      {
        source: '/api/gql/:path*',
        destination: `${process.env.NEXT_PUBLIC_GRAPHQL_API ?? process.env.NEXT_PUBLIC_BLOG_API}/:path*`,
      },
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
