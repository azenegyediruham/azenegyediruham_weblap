import type { NextConfig } from "next";

/**
 * GitHub Pages a repository subpath alatt szolgálja ki az oldalt
 * (https://azenegyediruham.github.io/azenegyediruham_weblap/).
 * A CI a PAGES_BASE_PATH env-ben adja át a subpath-ot; lokálisan üres.
 */
const basePath = (process.env.PAGES_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  transpilePackages: ["three"],
  reactStrictMode: true,
  // A home könyvtárban lévő idegen package-lock.json miatt explicit gyökér.
  turbopack: { root: process.cwd() },
  env: {
    // Futásidőben is elérhető legyen a subpath (asset() helper használja).
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
