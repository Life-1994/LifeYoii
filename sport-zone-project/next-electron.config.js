/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: 'out',
  reactStrictMode: true,
  // Disable API routes for static export
  trailingSlash: true,
}

module.exports = nextConfig
