//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@common', '@wds'],
};

module.exports = nextConfig;
