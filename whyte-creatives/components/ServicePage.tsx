import Link from "next/link";
import type { Metadata } from "next";
import FlexBlock, { type BlockGeometry } from "@/components/flex/FlexBlock";
import FlexItem from "@/components/flex/FlexItem";
import { packages, site } from "@/data/site";
import { serviceShared, type Service } from "@/data/services";

/**
 * Shared template for all seven "Services & Ratecards" pages.
 * Section order and copy follow the live site exactly:
 *
 *   hero (title + intro + 2 images)
 *   → Package One → Package Two
 *   → Latest Work → About me → Contact me → Portfolio
 *
 * Geometry is a simplified version of the original's 26-column block model:
 * the original lays each service page out as its own Flex blocks, but the
 * element boxes repeat the same rhythm, so they're expressed here once.
 */

const HERO: BlockGeometry = {
  rows: { desktop: 12, tablet: 16, mobile: 22 },
  padTop: { desktop: 1, tablet: 1, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 0.5 },
};

const PACKAGE: BlockGeometry = {
  rows: { desktop: 12, tablet: 16, mobile: 24 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

const STRIP: BlockGeometry = {
  rows: { desktop: 10, tablet: 14, mobile: 20 },
  padTop: { desktop: 1, tablet: 1, mobile: 0.5 },
  padBottom: { desktop: 1, tablet: 1, mobile: 0.5 },
};

const LINK_BLOCK: BlockGeometry = {
  rows: { desktop: 8, tablet: 10, mobile: 14 },
  padTop: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
  padBottom: { desktop: 0.5, tablet: 0.5, mobile: 0.5 },
};

export function serviceMetadata(service: Service): Metadata {
  return {
    title: service.pageTitle,
    description: service.metaDescription,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      title: `${service.pageTitle} | ${site.shortName}`,
      description: service.metaDescription,
      url: `${site.url}/${service.slug}`,
      images: [
        { url: service.heroImages[0], width: 1500, height: 1000, alt: service.pageTitle },
      ],
    },
  };
}

export default function ServicePage({ service }: { service: Service }) {
  const one = packages[0];
  const two = packages[1];
  const priceOne = service.priceOverrides?.one ?? one.price;
  const priceTwo = service.priceOverrides?.two ?? two.price;

  return (
    <>
      {/* ── hero ── */}
      <FlexBlock geometry={HERO}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 13, height: 5 },
            tablet: { top: 1, left: 2, width: 16, height: 6 },
            mobile: { top: 1, left: 2, width: 8, height: 5 },
          }}
        >
          <div className="fb-text">
            <h1 className="display">
              {service.titleLines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < service.titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 7, left: 2, width: 11, height: 5 },
            tablet: { top: 8, left: 2, width: 15, height: 6 },
            mobile: { top: 7, left: 2, width: 8, height: 7 },
          }}
        >
          <div className="fb-text">
            <p className="lead">{service.intro}</p>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 16, width: 10, height: 12 },
            tablet: { top: 1, left: 18, width: 8, height: 16 },
            mobile: { top: 15, left: 2, width: 8, height: 7 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src={service.heroImages[0]}
            alt={`${service.pageTitle} session`}
          />
        </FlexItem>
      </FlexBlock>

      {/* ── second hero image, full width ── */}
      <FlexBlock geometry={LINK_BLOCK}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 24, height: 7 },
            tablet: { top: 1, left: 2, width: 24, height: 9 },
            mobile: { top: 1, left: 2, width: 8, height: 13 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="fb-image"
            src={service.heroImages[1]}
            alt={`${service.pageTitle} — recent frames`}
            loading="lazy"
          />
        </FlexItem>
      </FlexBlock>

      {/* ── packages ── */}
      {[
        { pkg: one, price: priceOne, flip: false },
        { pkg: two, price: priceTwo, flip: true },
      ].map(({ pkg, price, flip }) => (
        <FlexBlock key={pkg.name} geometry={PACKAGE}>
          <FlexItem
            box={{
              desktop: { top: 1, left: flip ? 14 : 2, width: 12, height: 12 },
              tablet: { top: 1, left: flip ? 14 : 2, width: 12, height: 16 },
              mobile: { top: flip ? 13 : 1, left: 2, width: 8, height: 11 },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="fb-image"
              src={pkg.image}
              alt={`${pkg.name} — example work`}
              loading="lazy"
            />
          </FlexItem>

          <FlexItem
            box={{
              desktop: { top: 1, left: flip ? 2 : 15, width: 11, height: 12 },
              tablet: { top: flip ? 9 : 1, left: 2, width: 24, height: 7 },
              mobile: { top: flip ? 25 : 13, left: 2, width: 8, height: 11 },
            }}
          >
            <div className={`fb-text ${flip ? "" : ""}`}>
              <h2 className="h2">{pkg.name}</h2>
              <ul className="feature-list mt-s">
                {pkg.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="price mt-m">{price}</p>
              <p className="mt-s">
                <Link href="/contact" className="btn">
                  Book this package
                </Link>
              </p>
            </div>
          </FlexItem>
        </FlexBlock>
      ))}

      {/* ── latest work ── */}
      <FlexBlock geometry={STRIP}>
        <FlexItem
          box={{
            desktop: { top: 1, left: 2, width: 8, height: 2 },
            tablet: { top: 1, left: 2, width: 12, height: 2 },
            mobile: { top: 1, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text">
            <h2 className="h2">{serviceShared.latestWork.heading}</h2>
          </div>
        </FlexItem>

        <FlexItem
          box={{
            desktop: { top: 1, left: 19, width: 7, height: 2 },
            tablet: { top: 1, left: 18, width: 8, height: 2 },
            mobile: { top: 3, left: 2, width: 8, height: 2 },
          }}
        >
          <div className="fb-text fb-text--center al-desktop-right">
            <Link href={serviceShared.latestWork.link.href} className="textlink">
              {serviceShared.latestWork.link.label}
            </Link>
          </div>
        </FlexItem>

        {serviceShared.latestWork.images.map((src, i) => (
          <FlexItem
            key={src}
            box={{
              desktop: { top: 4, left: 2 + i * 6, width: 6, height: 6 },
              tablet: { top: 4, left: 2 + i * 6, width: 6, height: 8 },
              mobile: { top: 6 + i * 4, left: 2, width: 8, height: 4 },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="fb-image" src={src} alt="" loading="lazy" />
          </FlexItem>
        ))}
      </FlexBlock>

      {/* ── about me / contact me / portfolio ── */}
      <FlexBlock geometry={STRIP}>
        {[
          {
            ...serviceShared.aboutMe,
            left: 2,
            tabletLeft: 2,
          },
          {
            ...serviceShared.contactMe,
            left: 10,
            tabletLeft: 10,
          },
          {
            ...serviceShared.portfolio,
            left: 18,
            tabletLeft: 18,
          },
        ].map((block, i) => (
          <FlexItem
            key={block.heading}
            box={{
              desktop: { top: 1, left: block.left, width: 8, height: 10 },
              tablet: { top: 1, left: block.tabletLeft, width: 8, height: 14 },
              mobile: { top: 1 + i * 5, left: 2, width: 8, height: 5 },
            }}
          >
            <Link href={block.link.href} className="fb-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="fb-image" src={block.image} alt="" loading="lazy" />
              <span className="fb-card__body">
                <span className="fb-card__heading">
                  <span className="h3">{block.heading}</span>
                </span>
                <span className="fb-card__link">{block.link.label}</span>
              </span>
            </Link>
          </FlexItem>
        ))}
      </FlexBlock>
    </>
  );
}
