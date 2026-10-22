import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import FontPreload from "@/components/FontPreload";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} — ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "photographer Ghana",
    "Akosombo photographer",
    "wedding photography Ghana",
    "portrait photographer",
    "graduation photos Ghana",
    "product photography",
    "videography Ghana",
    "whyteCreatives",
  ],
  authors: [{ name: site.owner }],
  creator: site.shortName,
  openGraph: {
    type: "website",
    siteName: site.shortName,
    title: `${site.shortName} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    images: [{ url: "/images/banner_4.jpg", width: 1600, height: 900, alt: site.shortName }],
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} — ${site.tagline}`,
    description: site.description,
    images: ["/images/banner_4.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f8fd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Fonts are self-hosted in /public/fonts and declared in app/fonts.css
          (33 unicode-range subsets; only the ~97 KB of latin files are ever
          fetched). components/FontPreload.tsx handles the preloading. */}
      <body>
        <FontPreload />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd />
      </body>
    </html>
  );
}
