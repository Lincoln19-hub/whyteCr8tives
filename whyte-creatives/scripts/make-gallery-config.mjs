#!/usr/bin/env node
/**
 * make-gallery-config.mjs
 * -----------------------
 * Scans public/images/, reads each photo's real pixel dimensions, and writes a
 * ready-to-paste data/galleries.ts with correct aspect ratios baked in — so
 * the masonry layout never shifts as images load.
 *
 * Two ways to organise your photos:
 *
 *   1) FOLDERS (recommended)
 *        public/images/weddings/IMG_0001.jpg
 *        public/images/people/ama-01.jpg
 *      Each folder becomes one gallery; the folder name becomes the URL slug.
 *
 *   2) FILENAME PREFIX
 *        public/images/weddings--01.jpg
 *        public/images/people--01.jpg
 *      Everything before "--" becomes the slug.
 *
 * Images matching neither rule are NOT deleted — they're listed at the bottom
 * of the generated file as a comment so nothing disappears silently.
 *
 * Usage:
 *   node scripts/make-gallery-config.mjs            # preview on stdout
 *   node scripts/make-gallery-config.mjs --write    # overwrite data/galleries.ts
 */

import { readdir, writeFile, open } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUT_FILE = path.join(ROOT, "data", "galleries.ts");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

/* ===================== EDIT THESE ===================== */

/** Titles, categories and blurbs per slug. Unknown slugs get a sensible default. */
const META = {
  weddings: {
    title: "Weddings",
    category: "Weddings",
    blurb:
      "Vows, first dances, and the quiet glances nobody else noticed. Full-day coverage that keeps the feeling of the day intact.",
  },
  people: {
    title: "People",
    category: "Portraits",
    blurb:
      "Portraits of people as they actually are — relaxed, confident and unforced. Studio sessions, outdoor light and lifestyle frames.",
  },
  portraits: {
    title: "Portraits",
    category: "Portraits",
    blurb:
      "Portraits of people as they actually are — relaxed, confident and unforced.",
  },
  products: {
    title: "Products",
    category: "Brand & Product",
    blurb:
      "Clean, consistent product and brand imagery built for e-commerce, packaging and social campaigns.",
  },
  graduation: {
    title: "Graduation",
    category: "Graduations",
    blurb:
      "Caps, gowns and the people who got you there. Graduation sessions shot on campus and outdoors.",
  },
  events: {
    title: "Events",
    category: "Events",
    blurb:
      "Corporate gatherings, birthdays, launches and cultural events — documented so you can relive and reuse them.",
  },
  outdoor: {
    title: "Outdoor Shots",
    category: "Lifestyle",
    blurb:
      "Location sessions that use the landscape — riverside, forest and open field light around Akosombo and beyond.",
  },
  studio: {
    title: "Studio Shots",
    category: "Studio",
    blurb:
      "Controlled light, clean backgrounds and precise direction — headshots, editorial and brand portraits in studio.",
  },
  corporate: {
    title: "Corporate",
    category: "Corporate",
    blurb:
      "Brand and workplace imagery — headshots, teams, offices and events with a consistent look.",
  },
  brand: {
    title: "Brand Shots",
    category: "Brand",
    blurb:
      "Visual identity in use — founders, teams and products shot to a consistent look.",
  },
};

/** Order galleries appear on /portfolio. Unlisted slugs follow alphabetically. */
const ORDER = [
  "weddings",
  "people",
  "products",
  "graduation",
  "events",
  "outdoor",
  "studio",
];

/** Slugs featured on the home page (first three that exist are used). */
const FEATURED = ["people", "weddings", "products"];

/** Max images per gallery page — keeps long galleries fast. 0 = no limit. */
const MAX_PER_GALLERY = 0;

/* ====================================================== */

const titleCase = (slug) =>
  slug
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/* ---------- image dimensions (header parsing, no deps) ---------- */

async function readHead(filePath, bytes) {
  const handle = await open(filePath, "r");
  try {
    const size = (await handle.stat()).size;
    const len = Math.min(size, bytes);
    const buf = Buffer.alloc(len);
    await handle.read(buf, 0, len, 0);
    return buf;
  } finally {
    await handle.close();
  }
}

async function dimensions(filePath) {
  const buf = await readHead(filePath, 1024 * 1024);

  if (buf.length > 24 && buf.toString("latin1", 1, 4) === "PNG") {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.toString("latin1", 0, 3) === "GIF") {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  }
  if (
    buf.toString("latin1", 0, 4) === "RIFF" &&
    buf.toString("latin1", 8, 12) === "WEBP"
  ) {
    const fourcc = buf.toString("latin1", 12, 16);
    if (fourcc === "VP8 ")
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (fourcc === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (fourcc === "VP8X")
      return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker)
      ) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

function bucket(w, h) {
  if (!w || !h) return "wide";
  const r = w / h;
  if (r > 1.7) return "banner";
  if (r > 1.15) return "wide";
  if (r < 0.87) return "tall";
  return "square";
}

/* ---------- scanning ---------- */

async function scan() {
  const entries = await readdir(IMAGES_DIR, { withFileTypes: true });
  const groups = new Map();
  const unused = [];
  const skipped = [];

  for (const entry of entries) {
    const full = path.join(IMAGES_DIR, entry.name);

    if (entry.isDirectory()) {
      const files = (await readdir(full))
        .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
        .sort(naturalSort);
      if (files.length) {
        groups.set(
          entry.name.toLowerCase(),
          files.map((f) => ({
            web: `/images/${entry.name}/${f}`,
            abs: path.join(full, f),
            name: f,
          }))
        );
      } else {
        skipped.push(`${entry.name}/ (no images inside)`);
      }
      continue;
    }

    if (!EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      skipped.push(entry.name);
      continue;
    }

    const match = entry.name.match(/^(.+?)--/);
    if (match) {
      const slug = match[1].toLowerCase();
      const list = groups.get(slug) ?? [];
      list.push({ web: `/images/${entry.name}`, abs: full, name: entry.name });
      groups.set(slug, list);
    } else {
      unused.push({ web: `/images/${entry.name}`, abs: full, name: entry.name });
    }
  }

  for (const [, list] of groups) list.sort((a, b) => naturalSort(a.name, b.name));
  return { groups, unused, skipped };
}

function orderSlugs(slugs) {
  const known = ORDER.filter((s) => slugs.includes(s));
  const rest = slugs.filter((s) => !ORDER.includes(s)).sort();
  return [...known, ...rest];
}

/* ---------- codegen ---------- */

function render(groups, unused, skipped, measured) {
  const slugs = orderSlugs([...groups.keys()]);
  const featured = FEATURED.filter((s) => slugs.includes(s));
  const useFeatured = featured.length ? featured : slugs.slice(0, 3);

  const galleryBlocks = slugs.map((slug) => {
    const meta = META[slug] ?? {
      title: titleCase(slug),
      category: titleCase(slug),
      blurb: `${titleCase(slug)} work from whyteCreatives.`,
    };
    let files = groups.get(slug);
    if (MAX_PER_GALLERY > 0) files = files.slice(0, MAX_PER_GALLERY);

    const images = files.map((f, i) => {
      const dim = measured.get(f.web);
      const ratio = dim ? bucket(dim.w, dim.h) : "wide";
      const ar = dim ? `${(dim.w / dim.h).toFixed(4)}` : "1.5";
      const alt = `${meta.title} — frame ${i + 1}`;
      return { ...f, ratio, ar, alt, i };
    });

    const cover = images[0];

    return {
      slug,
      meta,
      count: images.length,
      cover,
      code: `  {
    slug: "${slug}",
    title: "${esc(meta.title)}",
    category: "${esc(meta.category)}",
    blurb:
      "${esc(meta.blurb)}",
    cover: {
      src: "${cover.web}",
      alt: "${esc(cover.alt)}",
      ratio: "${cover.ratio}",
      ar: ${cover.ar},
    },
    images: [
${images
  .map(
    (im) =>
      `      { src: "${im.web}", alt: "${esc(im.alt)}", ratio: "${im.ratio}", ar: ${im.ar} },`
  )
  .join("\n")}
    ],
  },`,
    };
  });

  // marquee pool: spread across galleries, tall frames look best in strips
  const pool = [];
  for (const g of galleryBlocks) {
    const files = groups.get(g.slug);
    for (const f of files) {
      const dim = measured.get(f.web);
      if (dim && dim.h > dim.w) pool.push({ web: f.web, ratio: bucket(dim.w, dim.h), ar: (dim.w / dim.h).toFixed(4) });
    }
  }
  const marqueeA = pool.slice(0, 6);
  const marqueeB = pool.slice(6, 12);
  // safety net if the whole pool is landscape: reuse the first cover image
  const fallbackSrc = galleryBlocks[0]?.cover?.web ?? "/images/banner_4.jpg";
  const emitMarquee = (list) =>
    list.length
      ? list
          .map(
            (m, i) =>
              `  { src: "${m.web}", alt: "Portfolio frame ${i + 1}", ratio: "${m.ratio}", ar: ${m.ar} },`
          )
          .join("\n")
      : `  { src: "${fallbackSrc}", alt: "Portfolio frame", ratio: "wide", ar: 1.5 },`;

  return `/**
 * GALLERIES — generated by scripts/make-gallery-config.mjs
 *
 * ⚠ Re-running the generator overwrites this file.
 *    Titles, blurbs and ordering are edited in the META / ORDER maps
 *    at the top of that script — change them there, then regenerate.
 *
 * Regenerate after adding or removing photos:
 *
 *     node scripts/make-gallery-config.mjs --write
 *
 * Aspect ratios ("ar") were read from the actual image files at generation
 * time, so every grid reserves the right space and nothing shifts on load.
 */

export type Ratio = "tall" | "wide" | "square" | "banner";

export type GalleryImage = {
  src: string;
  alt: string;
  ratio?: Ratio;
  /** exact width / height, used to reserve layout space */
  ar?: number;
};

export type Gallery = {
  slug: string;
  title: string;
  category: string;
  blurb: string;
  cover: GalleryImage;
  images: GalleryImage[];
};

export const galleries: Gallery[] = [
${galleryBlocks.map((g) => g.code).join("\n")}
];

export const galleryBySlug = (slug: string) =>
  galleries.find((g) => g.slug === slug);

/** Images used by the infinite scrolling strips on the home + contact pages. */
export const marqueeA: GalleryImage[] = [
${emitMarquee(marqueeA)}
];

export const marqueeB: GalleryImage[] = [
${emitMarquee(marqueeB)}
];

/** Featured tiles on the home page. */
export const featured = [${useFeatured.map((s) => `"${s}"`).join(", ")}]
  .map((slug) => galleryBySlug(slug))
  .filter((g): g is Gallery => Boolean(g));
${
  unused.length
    ? `
/* ------------------------------------------------------------------
   NOT used in any gallery (no folder, no "slug--" filename prefix).
   Rename or move them, then regenerate, and they'll appear.
${unused.map((u) => `     ${u.web}`).join("\n")}
   ------------------------------------------------------------------ */`
    : ""
}${
    skipped.length
      ? `
/* Ignored (not an image, or an empty folder): ${skipped.join(", ")} */`
      : ""
  }
`;
}

/* ---------- main ---------- */

async function main() {
  const { groups, unused, skipped } = await scan();

  if (!groups.size) {
    console.error(
      "\nNo galleries found.\n\n" +
        "  Put photos in  public/images/<gallery-name>/\n" +
        "  or name them   public/images/<gallery-name>--01.jpg\n\n" +
        "  then run this script again.\n"
    );
    if (unused.length)
      console.error(`  ${unused.length} unmatched image(s) sitting in public/images/.\n`);
    process.exit(1);
  }

  const all = [...groups.values()].flat().concat(unused);
  const measured = new Map();
  await Promise.all(
    all.map(async (f) => {
      const dim = await dimensions(f.abs).catch(() => null);
      if (dim) measured.set(f.web, dim);
    })
  );

  const output = render(groups, unused, skipped, measured);

  if (process.argv.includes("--write")) {
    await writeFile(OUT_FILE, output, "utf8");
    console.log(`Wrote ${path.relative(ROOT, OUT_FILE)}\n`);
  } else {
    process.stdout.write(output);
    console.error("\n(preview only — pass --write to save)\n");
  }

  console.log("Galleries:");
  for (const slug of orderSlugs([...groups.keys()])) {
    const meta = META[slug];
    console.log(
      `  /gallery/${slug.padEnd(15)}${String(groups.get(slug).length).padStart(3)} images   ${
        meta ? meta.title : titleCase(slug)
      }${meta ? "" : "   (default title — add it to META)"}`
    );
  }
  if (unused.length) {
    console.log(`\n  ${unused.length} image(s) not matched to a gallery:`);
    unused.slice(0, 10).forEach((u) => console.log(`    ${u.web}`));
    if (unused.length > 10) console.log(`    …and ${unused.length - 10} more`);
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
