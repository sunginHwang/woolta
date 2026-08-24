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
};

module.exports = nextConfig;
