/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    domains: ['effigy.im'],
  },
};
