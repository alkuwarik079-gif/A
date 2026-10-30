import type { NextConfig } from "next";

// GitHub Pages serves a project site from /<repo-name>/ and can only host static files.
// Build with PAGES_BASE_PATH=/A (or your repo name) to get a static `out/` folder for Pages;
// without it, this is a normal Next.js build (e.g. for Vercel).
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(basePath && { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }),
};

export default nextConfig;
