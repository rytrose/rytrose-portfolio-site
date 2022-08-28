/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
};

module.exports = nextConfig;
