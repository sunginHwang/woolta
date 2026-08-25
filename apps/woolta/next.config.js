//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: ['lh6.googleusercontent.com'],
  },
  compiler: {
    styledComponents: true,
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

module.exports = nextConfig;
