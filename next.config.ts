export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Allow product/catalog images from any HTTPS (or HTTP) origin — e.g. Amazon, CDNs, Supabase Storage, pasted URLs.
    // Local assets under /public still use paths like "/file.jpg" and do not need remotePatterns.
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "**", pathname: "/**" },
    ],
  },
};
