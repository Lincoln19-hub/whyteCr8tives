import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryView from "./GalleryView";
import Reveal from "@/components/Reveal";
import { portfolioGalleries } from "@/data/services";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

/**
 * The three portfolio galleries. The original site uses /gallery-1,
 * /gallery-2 and /gallery-4 (there is no gallery-3), so the slugs are
 * matched literally rather than parsed.
 */
export function generateStaticParams() {
  return portfolioGalleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = portfolioGalleries.find((g) => g.slug === slug);
  if (!gallery) return { title: "Gallery not found" };

  return {
    title: `${gallery.title} gallery`,
    description: `${gallery.title} photography from ${site.shortName}, ${site.location}.`,
    alternates: { canonical: `/${gallery.slug}` },
    openGraph: {
      title: `${gallery.title} | ${site.shortName}`,
      description: `${gallery.title} photography from ${site.shortName}.`,
      url: `${site.url}/${gallery.slug}`,
      images: [{ url: gallery.images[0], width: 1500, height: 1000, alt: gallery.title }],
    },
  };
}

export default async function GalleryRoute({ params }: Props) {
  const { slug } = await params;
  const gallery = portfolioGalleries.find((g) => g.slug === slug);
  if (!gallery) notFound();

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Portfolio</p>
            <h1 className="display">{gallery.title}</h1>
            <p className="mt-m">
              <Link href="/portfolio" className="textlink">
                ← Back to portfolio
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <GalleryView images={gallery.images} title={gallery.title} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap center">
          <Reveal>
            <h2 className="h3">Your story deserves to be seen.</h2>
            <p className="mt-m">
              <Link href="/contact" className="btn">
                Contact me <span className="btn__arrow">→</span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
