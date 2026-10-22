/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images-pw.pixieset.com" },
      { protocol: "https", hostname: "assets-pw.pixieset.com" },
    ],
  },
};

export default nextConfig;
