/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "rytrose-personal-website.s3.amazonaws.com",
          port: "",
          pathname: "/portfolio-site/**",
        },
      ],
      allowFutureImage: true,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
