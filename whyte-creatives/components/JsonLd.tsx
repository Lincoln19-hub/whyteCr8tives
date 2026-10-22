import { portfolioGalleries, services } from "@/data/services";
import { site } from "@/data/site";

/**
 * JSON-LD structured data — LocalBusiness for the studio, WebSite for the
 * domain, and an ItemList of the services and galleries so they can surface
 * as sitelinks in search.
 */
export default function JsonLd() {
  const base = site.url.replace(/\/$/, "");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${base}/#business`,
        name: site.shortName,
        alternateName: site.name,
        description: site.description,
        url: base,
        email: site.email,
        telephone: site.phoneHref,
        image: `${base}/images/lincoln-1.jpg`,
        priceRange: "$1200-$1600",
        founder: { "@type": "Person", name: site.owner },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address[0],
          addressLocality: "Akosombo",
          addressRegion: "Eastern",
          addressCountry: "GH",
        },
        areaServed: { "@type": "Country", name: "Ghana" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services & Ratecards",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.navLabel, description: s.intro },
            url: `${base}/${s.slug}`,
          })),
        },
        sameAs: site.socials.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: site.shortName,
        description: site.description,
        publisher: { "@id": `${base}/#business` },
        inLanguage: "en-GH",
      },
      {
        "@type": "CollectionPage",
        "@id": `${base}/portfolio/#collection`,
        url: `${base}/portfolio`,
        name: "Portfolio — My Works",
        isPartOf: { "@id": `${base}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: portfolioGalleries.map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: g.title,
            url: `${base}/${g.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Generated from typed local data only — no user input reaches here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
