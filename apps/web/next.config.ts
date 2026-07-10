import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@tact/db", "@tact/game-engine"],
  typedRoutes: true,
};

export default nextConfig;
