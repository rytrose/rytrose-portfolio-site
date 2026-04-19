/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
