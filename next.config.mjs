/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [{ source: "/feed", destination: "/rss.xml" }];
  },
};

export default nextConfig;
