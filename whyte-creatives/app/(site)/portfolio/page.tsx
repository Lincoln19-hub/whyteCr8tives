import Link from "next/link";
import type { Metadata } from "next";
import FlexBlock, { type BlockGeometry } from "@/components/flex/FlexBlock";
import FlexItem from "@/components/flex/FlexItem";
import Reveal from "@/components/Reveal";
import { portfolioTiles } from "@/data/services";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Portfolio — My Works",
  description:
    "Explore our collection of photography and videography, capturing timeless weddings, stunning portraits, graduations, events, corporate projects, and lifestyle moments.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: `Portfolio | ${site.shortName}`,
    description:
      "Explore our collection of photography and videography — weddings, portraits, graduations, events, corporate projects and lifestyle moments.",
    url: `${site.url}/portfolio`,
    images: [{ url: "/images/horizontal_1.jpg", width: 1500, height: 1000, alt: "Portfolio" }],
  },
};

const HEAD: BlockGeometry = {
  rows: { desktop: 4, tablet: 6, mobile: 8 },
  padTop: { desktop: 1.5, tablet: 1.5, mobile: 1 },
  padBottom: { desktop: 1, tablet: 1, mobile: 0.5 },
};

const GRID: BlockGeometry = {
  rows: { desktop: 14, tablet: 20, mobile: 36 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 1 },
};

/** Tile boxes: 3 across on desktop, 2 on tablet, 1 on mobile. */
const TILE_BOXES = [
  {
    image: {
      desktop: { top: 1, left: 2, width: 8, height: 6 },
      tablet: { top: 1, left: 2, width: 12, height: 9 },
      mobile: { top: 1, left: 2, width: 8, height: 5 },
    },
    label: {
      desktop: { top: 7, left: 2, width: 8, height: 1 },
      tablet: { top: 10, left: 2, width: 12, height: 1 },
      mobile: { top: 6, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 1, left: 10, width: 8, height: 6 },
      tablet: { top: 1, left: 14, width: 12, height: 9 },
      mobile: { top: 7, left: 2, width: 8, height: 5 },
    },
    label: {
      desktop: { top: 7, left: 10, width: 8, height: 1 },
      tablet: { top: 10, left: 14, width: 12, height: 1 },
      mobile: { top: 12, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 1, left: 18, width: 8, height: 6 },
      tablet: { top: 11, left: 2, width: 12, height: 9 },
      mobile: { top: 13, left: 2, width: 8, height: 5 },
    },
    label: {
      desktop: { top: 7, left: 18, width: 8, height: 1 },
      tablet: { top: 20, left: 2, width: 12, height: 1 },
      mobile: { top: 18, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 8, left: 2, width: 8, height: 6 },
      tablet: { top: 11, left: 14, width: 12, height: 9 },
      mobile: { top: 19, left: 2, width: 8, height: 5 },
    },
    label: {
      desktop: { top: 14, left: 2, width: 8, height: 1 },
      tablet: { top: 20, left: 14, width: 12, height: 1 },
      mobile: { top: 24, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 8, left: 10, width: 8, height: 6 },
      tablet: { top: 21, left: 2, width: 12, height: 9 },
      mobile: { top: 25, left: 2, width: 8, height: 5 },
    },
    label: {
      desktop: { top: 14, left: 10, width: 8, height: 1 },
      tablet: { top: 30, left: 2, width: 12, height: 1 },
      mobile: { top: 30, left: 2, width: 8, height: 1 },
    },
  },
  {
    image: {
      desktop: { top: 8, left: 18, width: 8, height: 6 },
      tablet: { top: 21, left: 14, width: 12, height: 9 },
      mobile: { top: 31, left: 2, width: 8, height: 5 },
    },
    label: {
      desktop: { top: 14, left: 18, width: 8, height: 1 },
      tablet: { top: 30, left: 14, width: 12, height: 1 },
      mobile: { top: 36, left: 2, width: 8, height: 1 },
    },
  },
];

export default function PortfolioPage() {
  return (
    <>
      <FlexBlock geometry={HEAD}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 10, height: 4 },
            tablet: { top: 1, left: 2, width: 14, height: 6 },
            mobile: { top: 1, left: 2, width: 8, height: 8 },
          }}
        >
          <div className="fb-text">
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
          </div>
        </FlexItem>
      </FlexBlock>

      <FlexBlock geometry={GRID}>
        {portfolioTiles.map((tile, i) => (
          <FlexItem key={`${tile.caption}-${i}`} box={TILE_BOXES[i].image}>
            <Reveal variant="mask" className="fb-fill">
              <Link
                href={tile.href}
                className="fb-tile"
                aria-label={`${tile.caption} gallery`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="fb-image" src={tile.image} alt={tile.caption} loading="lazy" />
              </Link>
            </Reveal>
          </FlexItem>
        ))}

        {portfolioTiles.map((tile, i) => (
          <FlexItem key={`${tile.caption}-label`} box={TILE_BOXES[i].label}>
            <div className="fb-text fb-text--center">
              <Link href={tile.href}>
                <h6 className="cardtitle">{tile.caption}</h6>
              </Link>
            </div>
          </FlexItem>
        ))}
      </FlexBlock>
    </>
  );
}
