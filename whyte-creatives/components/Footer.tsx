import Link from "next/link";
import { nav, site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <p className="footer__brand">{site.name}</p>
            <p className="body mt-s" style={{ color: "rgba(207,201,193,.75)" }}>
              {site.tagline}
              <br />
              Photography &amp; videography from {site.location}.
            </p>
          </div>

          <div>
            <p className="eyebrow" style={{ color: "rgba(207,201,193,.5)" }}>
              Explore
            </p>
            <ul className="footer__list mt-s">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow" style={{ color: "rgba(207,201,193,.5)" }}>
              Connect
            </p>
            <ul className="footer__list mt-s">
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </li>
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {site.shortName}. All rights reserved.
          </span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
