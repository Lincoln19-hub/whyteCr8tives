/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Sanity's image CDN — where photos uploaded through the Studio live.
      { protocol: "https", hostname: "cdn.sanity.io" },
      // The original Pixieset assets this design was rebuilt from.
      { protocol: "https", hostname: "images-pw.pixieset.com" },
      { protocol: "https", hostname: "assets-pw.pixieset.com" },
    ],
  },

  /**
   * The Sanity Studio is a pre-built single-page app in public/studio/
   * (see scripts/build-studio.mjs). Next serves real files straight from
   * public/, so these rewrites only ever catch the Studio's client-side
   * routes — a hard refresh on /studio/structure/page;abc has no matching
   * file and must fall back to the Studio's index.html.
   */
  async rewrites() {
    return [
      { source: "/studio", destination: "/studio/index.html" },
      { source: "/studio/", destination: "/studio/index.html" },
      { source: "/studio/:path*", destination: "/studio/index.html" },
    ];
  },
};

export default nextConfig;
