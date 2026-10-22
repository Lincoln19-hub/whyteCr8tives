import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import GalleryTile from "@/components/GalleryTile";
import { featured, marqueeA } from "@/data/galleries";
import { site } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/banner_4.jpg"
            alt="Photographer at work during a golden-hour session in Ghana"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero__scrim" />
        </div>

        <div className="wrap hero__content">
          <p className="subtitle hero__sub">{site.location} — Photography &amp; Videography</p>
          <h1 className="hero__title mt-s">
            Creative Visuals.
            <br />
            <em>Timeless Stories.</em>
          </h1>
          <p className="mt-l">
            <Link href="/portfolio" className="btn btn--light">
              View portfolio <span className="btn__arrow">→</span>
            </Link>
          </p>
        </div>

        <div className="hero__scroll">Scroll</div>
      </section>

      {/* ---------- FEATURED GALLERIES ---------- */}
      <section className="section">
        <div className="wrap">
          <Reveal className="center">
            <p className="eyebrow">Selected work</p>
            <h2 className="h2 mt-s">Selected work</h2>
          </Reveal>

          <div className="masonry mt-l" role="list">
            {featured.map((gallery, i) => (
              <Reveal key={gallery.slug} delay={i * 120} as="div">
                <GalleryTile gallery={gallery} role="listitem" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STORY / INTRO ---------- */}
      <section className="section section--tight" style={{ background: "var(--bg-alt)" }}>
        <div className="wrap split">
          <Reveal>
            <p className="eyebrow">Our approach</p>
            <h2 className="h2 mt-s">Your story deserves to be seen.</h2>
            <p className="lead mt-m">
              Welcome to the creative world of Whyte Creatives, where meaningful
              moments become lasting memories and ideas are transformed into
              compelling visual stories.
            </p>
            <p className="body mt-s">
              Our portfolio showcases a collection of photography and
              videography projects — from timeless wedding moments and striking
              portraits to graduation celebrations, special events, corporate
              visuals, and authentic lifestyle imagery.
            </p>
            <p className="mt-m">
              <Link href="/portfolio" className="textlink">
                View full portfolio <span aria-hidden="true">→</span>
              </Link>
            </p>
          </Reveal>

          <Reveal variant="mask" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/portrait_6.jpg"
              alt="Portrait from a whyteCreatives session"
              loading="lazy"
              decoding="async"
              style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover" }}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- MARQUEE STRIP ---------- */}
      <section aria-label="Portfolio highlights">
        <Marquee images={marqueeA} duration={70} />
      </section>

      {/* ---------- ABOUT TEASER ---------- */}
      <section className="section">
        <div className="wrap split split--rev">
          <Reveal>
            <p className="eyebrow">I&apos;m Lincoln Whyte</p>
            <h2 className="display mt-s">
              Get to
              <br />
              know me
            </h2>
            <p className="body mt-m">
              WhyteCreatives is a professional photography brand based in{" "}
              {site.location}, dedicated to capturing timeless moments with
              creativity and precision. Portrait, event and lifestyle work —
              artistic vision blended with storytelling, delivering images that
              speak beyond words.
            </p>
            <p className="mt-m">
              <Link href="/about" className="btn">
                Read more <span className="btn__arrow">→</span>
              </Link>
            </p>
          </Reveal>

          <Reveal variant="mask" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/lincoln-1.jpg"
              alt="Lincoln Richmond Whyte, founder of whyteCreatives"
              loading="lazy"
              decoding="async"
              style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover" }}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section section--dark">
        <div className="wrap center">
          <Reveal>
            <p className="eyebrow">Booking now</p>
            <h2 className="display mt-s">Let&apos;s connect</h2>
            <p className="lead mt-m" style={{ marginInline: "auto" }}>
              Tell me about the day, the brand or the moment you want kept.
              I&apos;ll reply within 24 hours.
            </p>
            <p className="mt-l">
              <Link href="/contact" className="btn btn--light">
                Contact me <span className="btn__arrow">→</span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
