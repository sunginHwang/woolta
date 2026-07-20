//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@woolta/common', '@woolta/wds'],
};

module.exports = nextConfig;
