//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@woolta/common', '@woolta/wds'],
  images: {
    disableStaticImages: true,
    domains: ['lh6.googleusercontent.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
