/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001'],
    },
  },
  transpilePackages: ['@tact/game-logic', '@tact/providers', '@tact/shared-ui', '@tact/utils'],
}