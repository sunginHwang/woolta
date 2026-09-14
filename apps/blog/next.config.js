//@ts-check
const withStylex = require('../../tools/stylex/nextStylex');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 로컬에서 빌드해 산출물만 서버로 옮긴다 — 서버에 소스·node_modules 를 두지 않는다.
  // 모노레포라 tracing 루트를 레포 루트로 올려야 libs/* 의존이 함께 묶인다.
  output: 'standalone',
  outputFileTracingRoot: require('node:path').join(__dirname, '../..'),
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
