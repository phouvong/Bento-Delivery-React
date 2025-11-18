const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn, remove log, info, debug, etc.
    } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // allows all https domains
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // allows all https domains
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: [
//       "bjorn66.com",
//       "6ammart-test.6amdev.xyz",
//       "192.168.50.168",
//       "6ammart-dev.6amdev.xyz",
//     ], // Add the domain here
//   },
// };
//
// module.exports = nextConfig;
