//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@common', '@wds'],
  images: {
    disableStaticImages: true,
    domains: ['lh6.googleusercontent.com'],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
