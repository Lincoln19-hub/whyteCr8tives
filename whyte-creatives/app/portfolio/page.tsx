import type { Metadata } from "next";
import Link from "next/link";
import GalleryTile from "@/components/GalleryTile";
import Reveal from "@/components/Reveal";
import { galleries } from "@/data/galleries";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Portfolio — My Works",
  description:
    "Explore the whyteCreatives collection of photography and videography: weddings, portraits, graduations, events, corporate projects and lifestyle moments.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: `Portfolio | ${site.shortName}`,
    description:
      "Weddings, corporates, graduations, events, outdoor and studio shots — your story, beautifully captured.",
    url: `${site.url}/portfolio`,
    images: [{ url: "/images/horizontal_1.jpg", width: 1600, height: 1067, alt: "Portfolio" }],
  },
};

export default function PortfolioPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{site.location}</p>
            <h1 className="display">My Works</h1>
            <p className="lead mt-m">
              Explore our collection of photography and videography, capturing
              timeless weddings, stunning portraits, graduations, events,
              corporate projects, and lifestyle moments. Every image reflects
              our creativity, passion, and commitment to quality.
            </p>
            <p className="subtitle mt-s" style={{ color: "var(--accent-details)" }}>
              Your story, beautifully captured.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="masonry" role="list">
            {galleries.map((gallery, i) => (
              <Reveal key={gallery.slug} delay={(i % 3) * 110} as="div">
                <GalleryTile gallery={gallery} role="listitem" showBlurb />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap center">
          <Reveal>
            <h2 className="h3">Not sure where to start?</h2>
            <p className="body mt-s" style={{ marginInline: "auto" }}>
              Tell me what you&apos;re planning and I&apos;ll send the most
              relevant galleries and availability.
            </p>
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
