import type { Metadata } from "next";
import FlexBlock, { type BlockGeometry } from "@/components/flex/FlexBlock";
import FlexItem from "@/components/flex/FlexItem";
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
    images: [{ url: "/images/lincoln-2.jpg", width: 1500, height: 2000, alt: site.owner }],
  },
};

/* Block order follows the original /about page:
   banner+name → bio+portrait → values → "Welcome, I'm glad you're here"
   → Let's Connect (form + portrait) */

const BANNER: BlockGeometry = {
  rows: { desktop: 10, tablet: 12, mobile: 16 },
  padTop: { desktop: 0.2, tablet: 0.2, mobile: 0.2 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

const BIO: BlockGeometry = {
  rows: { desktop: 12, tablet: 16, mobile: 24 },
  padTop: { desktop: 1, tablet: 1, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 0.5 },
};

const VALUES: BlockGeometry = {
  rows: { desktop: 8, tablet: 12, mobile: 20 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 0.5 },
};

const CONNECT: BlockGeometry = {
  rows: { desktop: 14, tablet: 20, mobile: 34 },
  padTop: { desktop: 1, tablet: 1, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 1 },
};

export default function AboutPage() {
  return (
    <>
      {/* ── banner + name ── */}
      <FlexBlock geometry={BANNER}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 24, height: 10 },
            tablet: { top: 1, left: 2, width: 24, height: 12 },
            mobile: { top: 1, left: 2, width: 8, height: 8 },
          }}
          zIndex={0}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/lincoln-3.jpg"
            alt=""
            aria-hidden="true"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 3, left: 11, width: 14, height: 7 },
            tablet: { top: 3, left: 8, width: 17, height: 8 },
            mobile: { top: 10, left: 2, width: 8, height: 6 },
          }}
          zIndex={1}
        >
          <div className="fb-text fb-text--center">
            <h1 className="display about-name">
              My name is
              <br />
              Lincoln
              <br />
              Richmond
              <br />
              Whyte
            </h1>
          </div>
        </FlexItem>
      </FlexBlock>

      {/* ── bio + portrait ── */}
      <FlexBlock geometry={BIO}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 12, height: 12 },
            tablet: { top: 1, left: 2, width: 14, height: 16 },
            mobile: { top: 13, left: 2, width: 8, height: 11 },
          }}
        >
          <div className="fb-text">
            <h2 className="h2">
              Hello, I&apos;m
              <br />
              Whyte Lincoln
            </h2>
            <p className="p1 mt-m">
              WhyteCreatives is a professional photography brand based in
              Akosombo, Ghana, dedicated to capturing timeless moments with
              creativity and precision. We specialize in portrait, event, and
              lifestyle photography, blending artistic vision with storytelling
              to deliver images that speak beyond words. Our goal is to preserve
              memories and showcase the beauty of people, places, and culture
              through the lens.
            </p>
            <p className="p1 mt-s">
              Lincoln serves as the CEO of Whyte Creatives, a premier visual
              media brand he founded. An accomplished photographer in his own
              right, his artistic expertise in portrait and event photography
              forms the core of the company&apos;s creative ethos.
            </p>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 15, width: 11, height: 12 },
            tablet: { top: 1, left: 17, width: 9, height: 16 },
            mobile: { top: 1, left: 2, width: 8, height: 12 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/lincoln-2.jpg"
            alt="Lincoln Richmond Whyte, founder and lead photographer at whyteCreatives"
            loading="lazy"
          />
        </FlexItem>
      </FlexBlock>

      {/* ── values ── */}
      <FlexBlock geometry={VALUES}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 10, height: 2 },
            tablet: { top: 1, left: 2, width: 14, height: 2 },
            mobile: { top: 1, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <h5 className="eyebrow">What we hold to</h5>
            <h2 className="h2 mt-s">Our values</h2>
          </div>
        </FlexItem>

        {values.map((value, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <FlexItem
              key={value.title}
              box={{
                desktop: { top: 4 + row * 2, left: 2 + col * 8, width: 8, height: 2 },
                tablet: { top: 4 + row * 3, left: 2 + col * 8, width: 8, height: 3 },
                mobile: { top: 4 + i * 3, left: 2, width: 8, height: 3 },
              }}
            >
              <div className="fb-text value-cell">
                <h3 className="h4">{value.title}</h3>
                <p className="p2 mt-s">{value.body}</p>
              </div>
            </FlexItem>
          );
        })}
      </FlexBlock>

      {/* ── welcome + form ── */}
      <FlexBlock geometry={CONNECT}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 11, height: 2 },
            tablet: { top: 1, left: 2, width: 14, height: 2 },
            mobile: { top: 1, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <h2 className="h2">Welcome, I&apos;m glad you&apos;re here</h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 16, width: 10, height: 13 },
            tablet: { top: 4, left: 15, width: 11, height: 16 },
            mobile: { top: 22, left: 2, width: 8, height: 12 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/lincoln-4.jpg"
            alt="Session frame from whyteCreatives"
            loading="lazy"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 4, left: 2, width: 12, height: 2 },
            tablet: { top: 4, left: 2, width: 14, height: 2 },
            mobile: { top: 4, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <h2 className="h2">Let&apos;s Connect</h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 6, left: 2, width: 12, height: 8 },
            tablet: { top: 6, left: 2, width: 14, height: 14 },
            mobile: { top: 6, left: 2, width: 8, height: 16 },
          }}
        >
          <div className="fb-text">
            <ContactForm />
          </div>
        </FlexItem>
      </FlexBlock>
    </>
  );
}
