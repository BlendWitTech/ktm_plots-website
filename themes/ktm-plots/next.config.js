/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3001' },
      { protocol: 'http', hostname: 'localhost', port: '' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
