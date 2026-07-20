//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@woolta/common', '@woolta/wds'],
  experimental: {
    optimizePackageImports: ['@nivo/pie', 'lodash-es', '@woolta/wds'],
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    disableStaticImages: true,
    domains: ['lh6.googleusercontent.com'],
  },
  webpack(config) {
    // SVGR support (previously handled by @nx/next svgr: true)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
