//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@common', '@wds'],
  async rewrites() {
    return [
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
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
