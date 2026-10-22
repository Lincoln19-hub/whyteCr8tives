"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/data/site";

/**
 * Site header, matching the original: logo in the left column, menu to the
 * right, with two dropdowns ("Services & Ratecards" and "Portfolio").
 *
 * The original's header block is 26 cols × 2 rows with the logo at
 * left:2 w:10 and the menu at left:16 w:10 — the same proportions are kept
 * here via flex-basis rather than a full FlexBlock, because a sticky header
 * needs a fixed pixel height.
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  // close everything on navigation
  useEffect(() => {
    setOpenMenu(false);
    setOpenDropdown(null);
  }, [pathname]);

  // close dropdowns on outside click / Escape
  useEffect(() => {
    if (!openDropdown) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  const isActive = (href?: string) => {
    if (!href) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  /** a dropdown is "active" when the current path is one of its children */
  const childActive = (children?: { href: string }[]) =>
    children?.some((c) => isActive(c.href)) ?? false;

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="wrap site-header__inner">
          <Link href="/" className="brand" aria-label={`${site.name} — home`}>
            {site.name}
          </Link>

          <nav className="nav" aria-label="Main" ref={navRef}>
            {nav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const active = isActive(item.href) || childActive(item.children);
              const isOpen = openDropdown === item.label;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="nav__link"
                    data-active={active}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item.label}
                  className="nav__group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="nav__link"
                      data-active={active}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.label}
                      <span className="nav__chevron" aria-hidden="true">
                        +
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="nav__link nav__link--folder"
                      data-active={active}
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : item.label)
                      }
                    >
                      {item.label}
                      <span className="nav__chevron" aria-hidden="true">
                        +
                      </span>
                    </button>
                  )}

                  <div className="nav__dropdown" data-open={isOpen}>
                    <ul>
                      {item.children!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            data-active={isActive(child.href)}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <button
            className="burger"
            data-open={openMenu}
            aria-label={openMenu ? "Close menu" : "Open menu"}
            aria-expanded={openMenu}
            aria-controls="mobile-nav"
            onClick={() => setOpenMenu((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Overlay menu — the original uses Instrument Serif here */}
      <div className="mobile-nav" id="mobile-nav" data-open={openMenu}>
        <nav aria-label="Mobile">
          {nav.map((item) => (
            <div key={item.label} className="mobile-nav__group">
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span className="mobile-nav__folder">{item.label}</span>
              )}
              {item.children ? (
                <div className="mobile-nav__children">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
