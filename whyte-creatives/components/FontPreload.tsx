"use client";

import { preload } from "react-dom";

/**
 * Preloads the three latin font subsets the site actually renders with, so the
 * first paint doesn't flash a fallback face.
 *
 * Uses React 19's `preload()` rather than <link> tags in the document head:
 * React hoists and dedupes these itself, which avoids the duplicate <link>
 * elements you get from writing them into <head> manually under Next 16.
 *
 * Only these files are fetched — the other 30 subsets in /public/fonts cover
 * cyrillic, greek, vietnamese etc. and are skipped via unicode-range.
 */
const FONTS = [
  "/fonts/instrument-serif-normal-400-2d243d.woff2",
  "/fonts/work-sans-normal-400-f7b83d.woff2",
  "/fonts/libre-franklin-normal-400-f2d133.woff2",
];

export default function FontPreload() {
  FONTS.forEach((href) =>
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })
  );
  return null;
}
