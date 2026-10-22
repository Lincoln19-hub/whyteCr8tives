import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryGrid from "./GalleryGrid";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import { imageStyle, ratioClass } from "@/components/GalleryTile";
import { galleries, galleryBySlug } from "@/data/galleries";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

/** Pre-render every gallery at build time — pure static output on Vercel. */
export function generateStaticParams() {
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = galleryBySlug(slug);
  if (!gallery) return { title: "Gallery not found" };

  return {
    title: `${gallery.title} gallery`,
    description: gallery.blurb,
    alternates: { canonical: `/gallery/${gallery.slug}` },
    openGraph: {
      title: `${gallery.title} | ${site.shortName}`,
      description: gallery.blurb,
      url: `${site.url}/gallery/${gallery.slug}`,
      images: [
        {
          url: gallery.cover.src,
          width: 1600,
          height: 1067,
          alt: gallery.cover.alt,
        },
      ],
    },
  };
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params;
  const gallery = galleryBySlug(slug);
  if (!gallery) notFound();

  const others = galleries
    .filter((g) => g.slug !== gallery.slug)
    .slice(0, 3);

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{gallery.category}</p>
            <h1 className="display">{gallery.title}</h1>
            <p className="lead mt-m">{gallery.blurb}</p>
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
          <GalleryGrid images={gallery.images} title={gallery.title} />
        </div>
      </section>

      <section aria-label="More from the portfolio">
        <Marquee images={gallery.images} duration={80} reverse />
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <Reveal className="center">
            <p className="eyebrow">Keep looking</p>
            <h2 className="h2 mt-s">More galleries</h2>
          </Reveal>

          <div className="masonry mt-l" style={{ columns: 3 }}>
            {others.map((g, i) => (
              <Reveal key={g.slug} delay={i * 110} as="div">
                <Link
                  href={`/gallery/${g.slug}`}
                  className={`tile ${ratioClass(g.cover)}`}
                  style={imageStyle(g.cover)}
                  aria-label={`${g.title} gallery`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.cover.src}
                    alt={g.cover.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="tile__overlay">
                    <span className="tile__meta">{g.category}</span>
                    <span className="tile__title">{g.title}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap center">
          <Reveal>
            <h2 className="h2">Want frames like these from your own day?</h2>
            <p className="lead mt-m" style={{ marginInline: "auto" }}>
              Booking weddings, graduations, portraits and brand work across
              Ghana.
            </p>
            <p className="mt-l">
              <Link href="/contact" className="btn btn--light">
                Check availability <span className="btn__arrow">→</span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
