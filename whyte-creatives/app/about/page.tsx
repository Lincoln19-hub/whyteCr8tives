import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site, values } from "@/data/site";

export const metadata: Metadata = {
  title: "About — Lincoln Richmond Whyte",
  description:
    "WhyteCreatives is a professional photography brand based in Akosombo, Ghana, dedicated to capturing timeless moments with creativity and precision.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${site.shortName}`,
    description:
      "Portrait, event and lifestyle photography from Akosombo, Ghana — artistic vision blended with storytelling.",
    url: `${site.url}/about`,
    images: [{ url: "/images/lincoln-1.jpg", width: 1500, height: 1875, alt: site.owner }],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* banner + name, as on the original */}
      <section className="page-head page-head--banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/banner_4.jpg" alt="" aria-hidden="true" />
        <div className="hero__scrim" />
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,.72)" }}>
              About
            </p>
            <h1 className="display mt-s">
              My name is
              <br />
              Lincoln Richmond Whyte
            </h1>
            <p className="subtitle mt-m" style={{ color: "rgba(255,255,255,.82)" }}>
              Portrait &amp; Event Photographer · {site.location}
            </p>
          </Reveal>
        </div>
      </section>

      {/* bio + portrait */}
      <section className="section">
        <div className="wrap split">
          <Reveal>
            <p className="eyebrow">The brand</p>
            <h2 className="h2 mt-s">Hello, I&apos;m Whyte Lincoln</h2>
            <p className="lead mt-m">
              WhyteCreatives is a professional photography brand based in
              Akosombo, Ghana, dedicated to capturing timeless moments with
              creativity and precision.
            </p>
            <p className="body mt-s">
              We specialise in portrait, event, and lifestyle photography,
              blending artistic vision with storytelling to deliver images that
              speak beyond words. Our goal is to preserve memories and showcase
              the beauty of people, places, and culture through the lens.
            </p>
            <p className="body mt-s">
              Lincoln serves as the CEO of Whyte Creatives, a premier visual
              media brand he founded. An accomplished photographer in his own
              right, his artistic expertise in portrait and event photography
              forms the core of the company&apos;s creative ethos. His leadership
              is characterised by a dual perspective: a deep understanding of
              artistic integrity combined with a sharp, strategic approach to
              business growth. Under his direction, Whyte Creatives delivers a
              suite of high-end visual services, helping clients build cohesive
              and compelling brand identities through photography.
            </p>
            <p className="mt-m">
              <Link href="/portfolio" className="textlink">
                See the work <span aria-hidden="true">→</span>
              </Link>
            </p>
          </Reveal>

          <Reveal variant="mask" delay={120}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/lincoln-2.jpg"
              alt="Lincoln Richmond Whyte, founder and lead photographer at whyteCreatives"
              loading="lazy"
              decoding="async"
              style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover" }}
            />
          </Reveal>
        </div>
      </section>

      {/* values */}
      <section className="section section--tight">
        <div className="wrap">
          <Reveal className="center">
            <p className="eyebrow">What we hold to</p>
            <h2 className="h2 mt-s">Our values</h2>
          </Reveal>

          <Reveal className="mt-l">
            <div className="value-list">
              {values.map((value) => (
                <div key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* welcome + contact */}
      <section className="section section--alt">
        <div className="wrap contact-grid">
          <Reveal>
            <p className="eyebrow">Welcome, I&apos;m glad you&apos;re here</p>
            <h2 className="h2 mt-s">Let&apos;s Connect</h2>
            <p className="body mt-m">
              Whether it&apos;s a wedding at Akosombo, a graduation in Accra or a
              brand refresh, start here. The more you tell me, the better I can
              plan the day.
            </p>
            <div className="mt-l">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal variant="mask" delay={140}>
            <figure style={{ margin: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/portrait_6.jpg"
                alt="Session frame from whyteCreatives"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover" }}
              />
              <figcaption className="mt-m">
                <ul className="contact-list">
                  <li>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </li>
                  <li>
                    <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                      {site.phone}
                    </a>
                  </li>
                  <li>
                    <span>{site.location}</span>
                  </li>
                </ul>
                <p className="mt-m">
                  {site.socials.map((s, i) => (
                    <span key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="textlink"
                        style={{ marginRight: "1.2rem" }}
                      >
                        {s.label}
                      </a>
                      {i === site.socials.length - 1 ? "" : ""}
                    </span>
                  ))}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
