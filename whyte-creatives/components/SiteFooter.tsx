import Link from "next/link";
import FlexBlock, { type BlockGeometry } from "@/components/flex/FlexBlock";
import FlexItem from "@/components/flex/FlexItem";
import BackToTop from "@/components/BackToTop";
import { site } from "@/data/site";

/**
 * Footer, reproducing block 7 of the original home page
 * (26 cols × 10 rows desktop · 26 × 14 tablet · 10 × 16 mobile).
 *
 * Geometry below is the exact --top/--left/--width/--height set taken from
 * the live site's stylesheet.
 */
const GEOMETRY: BlockGeometry = {
  rows: { desktop: 10, tablet: 14, mobile: 16 },
  padTop: { desktop: 1.5, tablet: 1.5, mobile: 1 },
  padBottom: { desktop: 1, tablet: 1, mobile: 1 },
};

export default function SiteFooter() {
  return (
    <FlexBlock geometry={GEOMETRY} as="footer" className="site-footer-block">
      {/* "Your story deserves to be seen." */}
      <FlexItem
        box={{
          desktop: { top: 1, left: 2, width: 6, height: 3 },
          tablet: { top: 1, left: 2, width: 10, height: 6 },
          mobile: { top: 1, left: 2, width: 8, height: 3 },
        }}
      >
        <div className="fb-text">
          <h2 className="h4">Your story deserves to be seen.</h2>
        </div>
      </FlexItem>

      {/* social links */}
      <FlexItem
        box={{
          desktop: { top: 1, left: 14, width: 12, height: 2 },
          tablet: { top: 1, left: 13, width: 13, height: 2 },
          mobile: { top: 13, left: 2, width: 8, height: 2 },
        }}
      >
        <div className="fb-text fb-text--center al-desktop-right">
          <ul className="social-links">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </FlexItem>

      {/* services line */}
      <FlexItem
        box={{
          desktop: { top: 7, left: 2, width: 5, height: 3 },
          tablet: { top: 9, left: 2, width: 9, height: 4 },
          mobile: { top: 5, left: 2, width: 8, height: 3 },
        }}
      >
        <div className="fb-text">
          <p className="footer-services">{site.servicesLine}</p>
        </div>
      </FlexItem>

      {/* "Contact" label */}
      <FlexItem
        box={{
          desktop: { top: 7, left: 18, width: 4, height: 1 },
          tablet: { top: 9, left: 13, width: 6, height: 1 },
          mobile: { top: 9, left: 2, width: 4, height: 1 },
        }}
      >
        <div className="fb-text">
          <h5 className="cardtitle">Contact</h5>
        </div>
      </FlexItem>

      {/* email + phone */}
      <FlexItem
        box={{
          desktop: { top: 8, left: 18, width: 4, height: 2 },
          tablet: { top: 10, left: 13, width: 6, height: 3 },
          mobile: { top: 10, left: 2, width: 4, height: 2 },
        }}
      >
        <div className="fb-text">
          <p className="footer-line">
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p className="footer-line">
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </p>
        </div>
      </FlexItem>

      {/* "address" label */}
      <FlexItem
        box={{
          desktop: { top: 7, left: 22, width: 4, height: 1 },
          tablet: { top: 9, left: 20, width: 6, height: 1 },
          mobile: { top: 9, left: 6, width: 4, height: 1 },
        }}
      >
        <div className="fb-text">
          <h5 className="cardtitle">address</h5>
        </div>
      </FlexItem>

      {/* address lines */}
      <FlexItem
        box={{
          desktop: { top: 8, left: 22, width: 4, height: 2 },
          tablet: { top: 10, left: 20, width: 6, height: 3 },
          mobile: { top: 10, left: 6, width: 4, height: 2 },
        }}
      >
        <div className="fb-text">
          {site.address.map((line) => (
            <p className="footer-line" key={line}>
              {line}
            </p>
          ))}
        </div>
      </FlexItem>

      {/* copyright */}
      <FlexItem
        box={{
          desktop: { top: 10, left: 2, width: 12, height: 1 },
          tablet: { top: 13, left: 2, width: 18, height: 2 },
          mobile: { top: 15, left: 2, width: 7, height: 2 },
        }}
      >
        <div className="fb-text fb-text--center">
          <p className="footer-copy">{site.copyright}</p>
        </div>
      </FlexItem>

      {/* back to top */}
      <FlexItem
        box={{
          desktop: { top: 10, left: 25, width: 1, height: 1 },
          tablet: { top: 13, left: 24, width: 2, height: 2 },
          mobile: { top: 15, left: 9, width: 1, height: 2 },
        }}
      >
        <div className="fb-text fb-text--center">
          <BackToTop />
        </div>
      </FlexItem>

      {/* quick links row (added — the original has none, but the dropdown
          targets are worth reaching from the footer) */}
      <FlexItem
        box={{
          desktop: { top: 4, left: 2, width: 12, height: 2 },
          tablet: { top: 7, left: 2, width: 18, height: 2 },
          mobile: { top: 8, left: 2, width: 8, height: 1 },
        }}
      >
        <div className="fb-text">
          <ul className="footer-links">
            <li>
              <Link href="/portfolio">Portfolio</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </FlexItem>
    </FlexBlock>
  );
}
