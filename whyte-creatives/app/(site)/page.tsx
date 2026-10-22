import Link from "next/link";
import type { Metadata } from "next";
import FlexBlock, { type BlockGeometry } from "@/components/flex/FlexBlock";
import FlexItem from "@/components/flex/FlexItem";
import ImageCarousel from "@/components/ImageCarousel";
import { homeTiles, site } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* Geometry for each home-page block, taken from the live site's stylesheet.
   Format: { desktop, tablet, mobile } × { top, left, width, height } in
   1-based square grid cells (26 columns desktop/tablet, 10 mobile). */

const HERO: BlockGeometry = {
  rows: { desktop: 14, tablet: 19, mobile: 30 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

const STORY: BlockGeometry = {
  rows: { desktop: 3, tablet: 8, mobile: 10 },
  padTop: { desktop: 1, tablet: 1, mobile: 1 },
  padBottom: { desktop: 1.5, tablet: 1.5, mobile: 1.5 },
};

const CAROUSEL: BlockGeometry = {
  rows: { desktop: 18, tablet: 18, mobile: 10 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

const ABOUT: BlockGeometry = {
  rows: { desktop: 12, tablet: 14, mobile: 25 },
  padTop: { desktop: 1, tablet: 1, mobile: 0.5 },
  padBottom: { desktop: 1.5, tablet: 1.5, mobile: 1 },
};

const CONNECT: BlockGeometry = {
  rows: { desktop: 11, tablet: 13, mobile: 24 },
  padTop: { desktop: 1, tablet: 1, mobile: 1 },
  padBottom: { desktop: 1.5, tablet: 1.5, mobile: 1.5 },
};

const carouselImages = [
  "/images/vertical_1.jpg",
  "/images/vertical_2.jpg",
  "/images/portrait_2.jpg",
  "/images/vertical_5.jpg",
  "/images/portrait_5.jpg",
];

/** The three hero tiles, each with its own geometry per breakpoint. */
const TILE_BOXES = [
  {
    image: {
      desktop: { top: 5, left: 2, width: 10, height: 9 },
      tablet: { top: 9, left: 2, width: 10, height: 10 },
      mobile: { top: 7, left: 2, width: 8, height: 7 },
    },
    label: {
      desktop: { top: 14, left: 2, width: 10, height: 1 },
      tablet: { top: 19, left: 2, width: 10, height: 1 },
      mobile: { top: 14, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 7, left: 12, width: 8, height: 7 },
      tablet: { top: 12, left: 12, width: 8, height: 7 },
      mobile: { top: 16, left: 3, width: 7, height: 7 },
    },
    label: {
      desktop: { top: 14, left: 12, width: 8, height: 1 },
      tablet: { top: 19, left: 12, width: 8, height: 1 },
      mobile: { top: 23, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 9, left: 20, width: 6, height: 5 },
      tablet: { top: 14, left: 20, width: 6, height: 5 },
      mobile: { top: 25, left: 4, width: 6, height: 5 },
    },
    label: {
      desktop: { top: 14, left: 20, width: 6, height: 1 },
      tablet: { top: 19, left: 20, width: 6, height: 1 },
      mobile: { top: 30, left: 2, width: 8, height: 1 },
    },
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── BLOCK 2: hero ─────────────────────────────────────────────
          Right-aligned display heading over a plain background, then three
          gallery tiles of decreasing size. No full-bleed hero image. */}
      <FlexBlock geometry={HERO}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 13, width: 13, height: 4 },
            tablet: { top: 1, left: 6, width: 20, height: 7 },
            mobile: { top: 1, left: 2, width: 8, height: 5 },
          }}
        >
          <div className="fb-text al-desktop-right">
            <h1 className="display">
              Creative Visuals.
              <br />
              Timeless Stories.
            </h1>
          </div>
        </FlexItem>

        {homeTiles.map((tile, i) => (
          <FlexItem key={tile.label} box={TILE_BOXES[i].image}>
            <Link
              href={tile.href}
              className="fb-tile"
              aria-label={`${tile.label} gallery`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fb-image" src={tile.image} alt={tile.label} />
            </Link>
          </FlexItem>
        ))}

        {homeTiles.map((tile, i) => (
          <FlexItem key={`${tile.label}-label`} box={TILE_BOXES[i].label}>
            <div className="fb-text fb-text--center al-desktop-right">
              <Link href={tile.href}>
                <h6 className="cardtitle">{tile.label}</h6>
              </Link>
            </div>
          </FlexItem>
        ))}
      </FlexBlock>

      {/* ── BLOCK 3: story ──────────────────────────────────────────── */}
      <FlexBlock geometry={STORY}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 8, height: 3 },
            tablet: { top: 1, left: 2, width: 12, height: 5 },
            mobile: { top: 1, left: 2, width: 8, height: 3 },
          }}
        >
          <div className="fb-text">
            <h2 className="h3">Your story deserves to be seen.</h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 11, width: 7, height: 3 },
            tablet: { top: 1, left: 15, width: 11, height: 5 },
            mobile: { top: 4, left: 2, width: 8, height: 5 },
          }}
        >
          <div className="fb-text">
            <p className="p1">
              Welcome to the creative world of Whyte Creatives, where meaningful
              moments become lasting memories and ideas are transformed into
              compelling visual stories.
            </p>
            <p className="p1 mt-s">
              Our portfolio showcases a collection of photography and
              videography projects, from timeless wedding moments and striking
              portraits to graduation celebrations, special events, corporate
              visuals, and authentic lifestyle imagery.
            </p>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 21, width: 5, height: 3 },
            tablet: { top: 7, left: 2, width: 9, height: 2 },
            mobile: { top: 9, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text fb-text--center">
            <Link href="/portfolio" className="btn">
              View full portfolio
            </Link>
          </div>
        </FlexItem>
      </FlexBlock>

      {/* ── BLOCK 4: full-width image carousel ──────────────────────── */}
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

      {/* ── BLOCK 5: about ──────────────────────────────────────────── */}
      <FlexBlock geometry={ABOUT}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 7, height: 12 },
            tablet: { top: 1, left: 2, width: 8, height: 14 },
            mobile: { top: 6, left: 2, width: 8, height: 10 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/lincoln-1.jpg"
            alt="Lincoln Richmond Whyte, founder of whyteCreatives"
            loading="lazy"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 10, width: 8, height: 1 },
            tablet: { top: 1, left: 11, width: 8, height: 2 },
            mobile: { top: 1, left: 2, width: 8, height: 1 },
          }}
        >
          <div className="fb-text">
            <h5 className="eyebrow">I&apos;m lincoln whyte</h5>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 19, width: 7, height: 4 },
            tablet: { top: 1, left: 20, width: 6, height: 5 },
            mobile: { top: 2, left: 2, width: 8, height: 3 },
          }}
        >
          <div className="fb-text al-desktop-right">
            <h2 className="h1">
              Get to
              <br />
              know me
            </h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 7, left: 10, width: 8, height: 6 },
            tablet: { top: 4, left: 11, width: 8, height: 11 },
            mobile: { top: 17, left: 2, width: 8, height: 6 },
          }}
        >
          <div className="fb-text">
            <p className="p1">
              WhyteCreatives is a professional photography brand based in
              Akosombo, Ghana, dedicated to capturing timeless moments with
              creativity and precision.
            </p>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 10, left: 21, width: 5, height: 3 },
            tablet: { top: 12, left: 20, width: 6, height: 3 },
            mobile: { top: 24, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text fb-text--center al-desktop-right">
            <Link href="/about" className="btn">
              Read more
            </Link>
          </div>
        </FlexItem>
      </FlexBlock>

      {/* ── BLOCK 6: let's connect ──────────────────────────────────── */}
      <FlexBlock geometry={CONNECT}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 6, height: 5 },
            tablet: { top: 1, left: 2, width: 6, height: 5 },
            mobile: { top: 8, left: 2, width: 7, height: 6 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/horizontal_4.jpg"
            alt="Session frame from whyteCreatives"
            loading="lazy"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 8, width: 8, height: 8 },
            tablet: { top: 1, left: 8, width: 8, height: 8 },
            mobile: { top: 14, left: 2, width: 6, height: 6 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/horizontal_3.jpg"
            alt="Session frame from whyteCreatives"
            loading="lazy"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 16, width: 10, height: 11 },
            tablet: { top: 1, left: 16, width: 10, height: 13 },
            mobile: { top: 1, left: 2, width: 8, height: 7 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src="/images/horizontal_7.jpg"
            alt="Session frame from whyteCreatives"
            loading="lazy"
          />
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 9, left: 2, width: 6, height: 2 },
            tablet: { top: 9, left: 2, width: 9, height: 3 },
            mobile: { top: 21, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <h2 className="h1">Let&apos;s connect</h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 11, left: 2, width: 6, height: 1 },
            tablet: { top: 12, left: 2, width: 6, height: 2 },
            mobile: { top: 23, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <Link href="/contact" className="btn">
              Contact me
            </Link>
          </div>
        </FlexItem>
      </FlexBlock>
    </>
  );
}
