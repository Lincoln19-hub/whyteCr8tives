import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import ContactForm from "@/components/ContactForm";
import { marqueeB } from "@/data/galleries";
import { process as steps, services, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact — Let's Connect",
  description:
    "How whyteCreatives works: plan the project, shoot the session, edit and deliver. Get in touch to check availability for weddings, portraits, graduations, events and brand work in Ghana.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.shortName}`,
    description: "Let's bring your vision to life. We reply within 24 hours.",
    url: `${site.url}/contact`,
    images: [{ url: "/images/portrait_6.jpg", width: 1200, height: 1600, alt: "Contact" }],
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h1 className="display">How I work</h1>
            <p className="lead mt-m">
              At Whyte Creatives, we approach every project with dedication,
              creativity, and attention to detail. Our commitment is to provide
              more than just images and videos — we strive to create meaningful
              visuals that you can treasure, share, and use with confidence.
            </p>
            <p className="subtitle mt-s" style={{ color: "var(--accent-details)" }}>
              Let&apos;s bring your vision to life.
            </p>
          </Reveal>
        </div>
      </section>

      {/* the three steps */}
      <section className="section section--tight">
        <div className="wrap">
          {steps.map((item, i) => (
            <Reveal key={item.step} delay={i * 80}>
              <article className="step">
                <div className="step__num">{item.step}</div>
                <div>
                  <h2 className="h3">{item.title}</h2>
                  <p className="body mt-s">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* services strip */}
      <section className="section section--tight">
        <div className="wrap">
          <Reveal className="center">
            <p className="eyebrow">What we shoot</p>
            <h2 className="h2 mt-s">Services</h2>
          </Reveal>
          <Reveal className="mt-l">
            <div className="value-list">
              {services.map((service) => (
                <div key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-label="Recent frames">
        <Marquee images={marqueeB} duration={65} />
      </section>

      {/* the form */}
      <section className="section section--alt" id="connect">
        <div className="wrap contact-grid">
          <Reveal>
            <p className="eyebrow">Enquiries</p>
            <h2 className="h2 mt-s">Let&apos;s Connect</h2>
            <p className="body mt-m">
              Send the details below and you&apos;ll hear back within 24 hours —
              usually with availability, a suggested plan and a quote.
            </p>
            <div className="mt-l">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal variant="mask" delay={140}>
            <div className="contact-aside">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/portrait_6.jpg"
                alt="Photographer on location with a client"
                loading="lazy"
                decoding="async"
              />
              <div className="contact-aside__inner">
                <p className="cardtitle" style={{ color: "#fff" }}>
                  Direct lines
                </p>
                <ul className="contact-list mt-s">
                  <li>
                    <a href={`mailto:${site.email}`} style={{ color: "#fff" }}>
                      {site.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      style={{ color: "#fff" }}
                    >
                      {site.phone}
                    </a>
                  </li>
                  <li>
                    <span style={{ color: "rgba(255,255,255,.8)" }}>
                      {site.location} — travelling across Ghana
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-m">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="textlink"
                  style={{ marginRight: "1.4rem" }}
                >
                  {s.label}
                </a>
              ))}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
