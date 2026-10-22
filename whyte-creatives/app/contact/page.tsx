import type { Metadata } from "next";
import FlexBlock, { type BlockGeometry } from "@/components/flex/FlexBlock";
import FlexItem from "@/components/flex/FlexItem";
import ContactForm from "@/components/ContactForm";
import ImageCarousel from "@/components/ImageCarousel";
import { process, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact — How I work",
  description:
    "How whyteCreatives works: we connect and plan the project, the session day, then editing and delivery. Get in touch to check availability.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact | ${site.shortName}`,
    description: "Let's bring your vision to life. We reply within 24 hours.",
    url: `${site.url}/contact`,
    images: [{ url: "/images/portrait_6.jpg", width: 1200, height: 1600, alt: "Contact" }],
  },
};

/* The original's contact page repeats one block per step:
   "How I work" (h1) + the number (h1) + the step title (h2) + body. */
const STEP: BlockGeometry = {
  rows: { desktop: 6, tablet: 8, mobile: 12 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

const CAROUSEL: BlockGeometry = {
  rows: { desktop: 18, tablet: 18, mobile: 10 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

const CONNECT: BlockGeometry = {
  rows: { desktop: 14, tablet: 20, mobile: 34 },
  padTop: { desktop: 1, tablet: 1, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 1 },
};

const carouselImages = [
  "/images/vertical_6.jpg",
  "/images/vertical_9.jpg",
  "/images/portrait_4.jpg",
];

export default function ContactPage() {
  return (
    <>
      {/* ── the three steps, one block each, as on the original ── */}
      {process.map((item) => (
        <FlexBlock key={item.step} geometry={STEP}>
          <FlexItem
            box={{
              desktop: { top: 1, left: 2, width: 6, height: 1 },
              tablet: { top: 1, left: 2, width: 8, height: 1 },
              mobile: { top: 1, left: 2, width: 8, height: 1 },
            }}
          >
            <div className="fb-text">
              <h5 className="eyebrow">How I work</h5>
            </div>
          </FlexItem>

          <FlexItem
            box={{
              desktop: { top: 2, left: 2, width: 3, height: 3 },
              tablet: { top: 2, left: 2, width: 4, height: 4 },
              mobile: { top: 2, left: 2, width: 3, height: 3 },
            }}
          >
            <div className="fb-text">
              <span className="step__num">{item.step}</span>
            </div>
          </FlexItem>

          <FlexItem
            box={{
              desktop: { top: 2, left: 7, width: 17, height: 4 },
              tablet: { top: 2, left: 7, width: 19, height: 6 },
              mobile: { top: 5, left: 2, width: 8, height: 7 },
            }}
          >
            <div className="fb-text">
              <h2 className="h2">{item.title}</h2>
              <p className="p1 mt-s">{item.body}</p>
            </div>
          </FlexItem>
        </FlexBlock>
      ))}

      {/* ── image carousel ── */}
      <FlexBlock geometry={CAROUSEL}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 24, height: 18 },
            tablet: { top: 1, left: 2, width: 24, height: 18 },
            mobile: { top: 1, left: 1, width: 10, height: 10 },
          }}
        >
          <ImageCarousel images={carouselImages} />
        </FlexItem>
      </FlexBlock>

      {/* ── Let's Connect: portrait, details and the form ── */}
      <FlexBlock geometry={CONNECT}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 10, height: 13 },
            tablet: { top: 1, left: 2, width: 12, height: 17 },
            mobile: { top: 22, left: 2, width: 8, height: 12 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/portrait_6.jpg"
            alt="Photographer on location with a client"
            loading="lazy"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 14, width: 12, height: 2 },
            tablet: { top: 1, left: 15, width: 11, height: 2 },
            mobile: { top: 1, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <h2 className="h1">Let&apos;s Connect</h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 3, left: 14, width: 12, height: 11 },
            tablet: { top: 3, left: 15, width: 11, height: 16 },
            mobile: { top: 3, left: 2, width: 8, height: 18 },
          }}
        >
          <div className="fb-text">
            <ContactForm />
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 14, left: 2, width: 10, height: 1 },
            tablet: { top: 18, left: 2, width: 12, height: 2 },
            mobile: { top: 34, left: 2, width: 8, height: 1 },
          }}
        >
          <div className="fb-text">
            <p className="footer-line">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              {"  ·  "}
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              {"  ·  "}
              {site.address.join(", ")}
            </p>
          </div>
        </FlexItem>
      </FlexBlock>
    </>
  );
}
