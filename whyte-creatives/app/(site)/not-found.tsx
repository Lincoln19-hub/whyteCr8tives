import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section
      className="page-head"
      style={{ minHeight: "62svh", display: "grid", alignContent: "center" }}
    >
      <div className="wrap">
        <p className="eyebrow">Lost frame</p>
        <h1 className="h1">404</h1>
        <p className="lead">
          This page isn&apos;t in the gallery. Let&apos;s get you back to the work.
        </p>
        <p className="mt-m">
          <Link className="btn" href="/">
            Back home <span className="btn__arrow">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
