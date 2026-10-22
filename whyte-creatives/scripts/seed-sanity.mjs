#!/usr/bin/env node
/**
 * Seeds your Sanity project with the site's existing content, so the visual
 * editor opens with everything already in place instead of an empty project.
 *
 *   npx sanity init       # once — creates the free project, writes .env.local
 *   npm run seed          # this script
 *   npm run build         # rebuild + redeploy
 *
 * What it writes today:
 *   • the `siteSettings` singleton — brand lines, contact details, socials,
 *     the full navigation (both dropdowns) and the two ratecard packages with
 *     every feature bullet. That's the copy most often edited without code.
 *
 * It talks straight to Sanity's HTTP API with fetch, so there's nothing extra
 * to install. Idempotent: re-running replaces the same documents rather than
 * duplicating them (createOrReplace on fixed _ids).
 *
 * Requires SANITY_API_WRITE_TOKEN (sanity.io/manage → project → API → Tokens,
 * "Editor" role is enough). Never commit it.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const log = (m = "") => console.log(`[seed] ${m}`);

/* ---------- 0. make sure Node can read the .ts data files ---------- */

// data/site.ts and data/services.ts are TypeScript. Node 22.6+ can strip the
// types, but only when the flag is on — so if the dynamic import below fails we
// simply re-run this same file with the flag set.
let site, services;
try {
  site = await import(pathToFileURL(join(root, "data/site.ts")).href);
  services = await import(pathToFileURL(join(root, "data/services.ts")).href);
} catch {
  if (!process.env.SEED_REEXEC) {
    log("re-running with Node's TypeScript stripping enabled…");
    const res = spawnSync(
      process.execPath,
      ["--experimental-strip-types", "--no-warnings", fileURLToPath(import.meta.url)],
      { stdio: "inherit", cwd: root, env: { ...process.env, SEED_REEXEC: "1" } }
    );
    process.exit(res.status ?? 1);
  }
  throw new Error("Could not import data/site.ts even with type stripping.");
}

/* ---------- 1. env ---------- */

const env = { ...process.env };
for (const file of [".env", ".env.local"]) {
  const p = join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, raw] = m;
    const value = raw.replace(/^["']|["']$/g, "").trim();
    if (value && !env[key]) env[key] = value;
  }
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  log("");
  log("No NEXT_PUBLIC_SANITY_PROJECT_ID found. Create the free project first:");
  log("");
  log("    npx sanity init");
  log("");
  log("Answer the prompts (Create new project → free tier → dataset"),
  log('"production"), then re-run `npm run seed`.');
  process.exit(1);
}
if (!token) {
  log("");
  log("No SANITY_API_WRITE_TOKEN found. Create one at:");
  log(`    https://www.sanity.io/manage/project/${projectId}/api`);
  log("");
  log('Tokens → Add → name it "seed", role Editor → then add to .env.local:');
  log("    SANITY_API_WRITE_TOKEN=sk…");
  process.exit(1);
}

const endpoint = `https://${projectId}.api.sanity.io/v2021-10-21/data/mutate/${dataset}`;
log(`project ${projectId} / dataset ${dataset}`);

/* ---------- 2. build the documents ---------- */

const s = site.site;

const siteSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: s.name,
  shortName: s.shortName,
  tagline: s.tagline,
  servicesLine: s.servicesLine,
  copyright: s.copyright,
  siteUrl: s.url,
  email: s.email,
  phone: s.phone,
  phoneHref: s.phoneHref,
  addressLine1: s.address[0],
  addressLine2: s.address[1],
  socials: s.socials.map((so, i) => ({
    _key: `social${i}`,
    _type: "social",
    label: so.label,
    href: so.href,
  })),
  nav: site.nav.map((item, i) => ({
    _key: `nav${i}`,
    _type: "navItem",
    label: item.label,
    href: item.href ?? "",
    children: (item.children ?? []).map((c, j) => ({
      _key: `nav${i}child${j}`,
      _type: "navChild",
      label: c.label,
      href: c.href,
    })),
  })),
  packages: site.packages.map((pkg, i) => ({
    _key: `pkg${i}`,
    _type: "package",
    name: pkg.name,
    price: pkg.price,
    src: pkg.image,
    features: [...pkg.features],
  })),
};

// The seven service pages get a `page` document each so they show up in the
// Studio's "Service & ratecard pages" list. Their block geometry is not seeded
// yet — the renderer keeps using components/ServicePage.tsx for those, so the
// live site is unchanged. See docs/VISUAL-EDITOR.md → "What's editable today".
const servicePages = services.services.map((svc) => {
  const slug = svc.slug.startsWith("/") ? svc.slug : `/${svc.slug}`;
  return {
    _id: `page-${slug.replace(/^\//, "")}`,
    _type: "page",
    title: svc.navLabel,
    slug: { current: slug },
    description: svc.metaDescription,
    blocks: [],
  };
});

// Printed at the end so you know what still lives in code rather than Sanity.
const stillInCode = services.services.map((svc) => ({
  slug: svc.slug.startsWith("/") ? svc.slug : `/${svc.slug}`,
  h1: svc.titleLines.join(" / "),
  heroImages: svc.heroImages,
  priceOverrides: svc.priceOverrides,
}));

const mutations = [
  { createOrReplace: siteSettingsDoc },
  ...servicePages.map((doc) => ({ createIfNotExists: doc })),
];

/* ---------- 3. push ---------- */

const body = JSON.stringify({ mutations, returnIds: true });

let res;
try {
  res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
} catch (err) {
  log("");
  log(`Network error reaching Sanity: ${err.message}`);
  log("Check your connection, and that the project id is correct.");
  process.exit(1);
}

const text = await res.text();

if (!res.ok) {
  log("");
  log(`Sanity rejected the write (HTTP ${res.status}).`);
  try {
    const parsed = JSON.parse(text);
    const e = parsed.error ?? parsed;
    log(`  ${e.description || e.message || JSON.stringify(e)}`);
    if (res.status === 401 || res.status === 403) {
      log("");
      log("That's an auth problem. Common causes:");
      log("  • the token was created for a different project/dataset");
      log('  • the token\'s role isn\'t "Editor" (or higher)');
      log("  • you pasted it with surrounding quotes or a trailing space");
    }
    if (res.status === 404) {
      log("");
      log("That's usually a wrong project id or dataset name.");
      log(`  Tried: ${endpoint}`);
    }
  } catch {
    log(`  ${text.slice(0, 400)}`);
  }
  process.exit(1);
}

let created = 0;
try {
  created = JSON.parse(text)?.results?.length ?? mutations.length;
} catch {
  created = mutations.length;
}

log("");
log(`✔ wrote ${created} document${created === 1 ? "" : "s"}`);
log("   • Site settings  — brand, contact, socials, navigation, ratecards");
log(`   • ${servicePages.length} service pages (placeholders — layout still comes from code)`);
log("");
log("Not in Sanity yet, so still edited in code:");
for (const p of stillInCode) {
  log(`   ${p.slug.padEnd(26)} H1 “${p.h1}”${p.priceOverrides ? " · price override" : ""}`);
}
log("   plus the home, about, contact, portfolio and gallery layouts.");
log("");
log(`Open the editor:  ${env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/studio`);
log("Then re-run `npm run build` and deploy so the live site picks it up.");
