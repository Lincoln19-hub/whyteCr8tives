import type { MetadataRoute } from "next";
import { portfolioGalleries, services } from "@/data/services";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = site.url.replace(/\/$/, "");

  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
  ): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/about", 0.8),
    page("/portfolio", 0.9, "weekly"),
    page("/contact", 0.8),

    // the seven service + ratecard pages
    ...services.map((s) => page(`/${s.slug}`, 0.85)),

    // the three portfolio galleries
    ...portfolioGalleries.map((g) => page(`/${g.slug}`, 0.7)),
  ];
}
