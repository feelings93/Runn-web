/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'go.amazy.io',
        port: '',
        pathname: '/images/sneakers/**/**/**',
      },
      {
        protocol: 'https',
        hostname: 'go.amazy.io',
        port: '',
        pathname: '/images/icons/**',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/marketplace',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
