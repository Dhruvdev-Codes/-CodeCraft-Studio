/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Avatar providers (NextAuth images) are external; unoptimized keeps deploys simple.
    unoptimized: true,
  },
};

export default nextConfig;