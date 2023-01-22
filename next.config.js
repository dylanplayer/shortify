/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/s/:path*", destination: "/api/s/:path*" }];
  },
}

module.exports = nextConfig
