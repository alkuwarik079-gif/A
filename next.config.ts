import type { NextConfig } from "next";

// Static export for GitHub Pages: set PAGES_EXPORT=1.
// PAGES_BASE_PATH is only needed when the site lives under /<repo-name>/ (no custom domain).
const exportForPages = !!process.env.PAGES_EXPORT;
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(exportForPages && { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }),
};

export default nextConfig;
