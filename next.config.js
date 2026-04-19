/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rytrose-personal-website.s3.amazonaws.com",
        port: "",
        pathname: "/portfolio-site/**",
      },
    ]
  },
};

module.exports = nextConfig;
