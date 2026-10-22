import { galleries } from "@/data/galleries";
import { site } from "@/data/site";

/**
 * JSON-LD structured data — helps Google show the studio as a local business
 * and surfaces the gallery collection in search.
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${site.url}/#business`,
        name: site.shortName,
        alternateName: site.name,
        description: site.description,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        image: `${site.url}/images/banner_4.jpg`,
        priceRange: "$$",
        founder: { "@type": "Person", name: site.owner },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Akosombo",
          addressRegion: "Eastern",
          addressCountry: "GH",
        },
        areaServed: { "@type": "Country", name: "Ghana" },
        knowsAbout: [
          "Portrait photography",
          "Wedding photography",
          "Event photography",
          "Product photography",
          "Videography",
        ],
        sameAs: site.socials.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.shortName,
        description: site.description,
        publisher: { "@id": `${site.url}/#business` },
        inLanguage: "en-GH",
      },
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/portfolio/#collection`,
        url: `${site.url}/portfolio`,
        name: "Portfolio — My Works",
        isPartOf: { "@id": `${site.url}/#website` },
        about: galleries.map((g) => ({
          "@type": "CreativeWork",
          name: g.title,
          url: `${site.url}/gallery/${g.slug}`,
          description: g.blurb,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON is generated from typed local data — no user input reaches here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
