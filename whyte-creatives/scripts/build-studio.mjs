#!/usr/bin/env node
/**
 * Builds the Sanity Studio into public/studio/ so the Next.js app can serve it
 * at /studio as a plain static single-page app.
 *
 * Why not embed the Studio in the Next build (app/studio/[[...tool]]/page.tsx)?
 * Bundling the whole Studio into `next build` needs several GB of RAM and
 * regularly gets SIGKILLed on constrained build machines. Building it
 * separately with Sanity's own bundler takes ~6 seconds and keeps the public
 * site's build small and fast. The result is identical from the editor's point
 * of view: one deployment, the Studio lives at https://yoursite/studio.
 *
 * The script is safe to run with no Sanity credentials: it prints a notice and
 * exits 0, so `npm run build` (and therefore the Vercel deploy) never fails
 * just because NEXT_PUBLIC_SANITY_PROJECT_ID isn't set yet.
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const BUILD_DIR = join(root, ".sanity-studio"); // sanity build output (git-ignored)
const PUBLIC_DIR = join(root, "public", "studio"); // what Next serves at /studio

const log = (msg) => console.log(`[build-studio] ${msg}`);

/* ---------- 1. credentials ---------- */

let projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
let dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Fall back to .env.local / .env so a plain `npm run build` picks the values up
// even when they weren't exported into the shell.
if (!projectId || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  // Line-based on purpose: a `.` regex without the /s flag still crosses \n when
  // a key is present but empty (PROJECT_ID=), which quietly swallows the next
  // line as the value.
  for (const file of [".env.local", ".env"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const value = m[2].replace(/\s+$/, "").replace(/^["']|["']$/g, "");
      if (!value) continue; // key present but empty → not a real value
      if (m[1] === "NEXT_PUBLIC_SANITY_PROJECT_ID" && !projectId) projectId = value;
      if (m[1] === "NEXT_PUBLIC_SANITY_DATASET") dataset = value;
    }
    if (projectId) break;
  }
}

if (!projectId) {
  log("NEXT_PUBLIC_SANITY_PROJECT_ID is not set — skipping the Studio build.");
  log("The website builds and deploys normally; /studio just won't exist yet.");
  log("");
  log("To switch the visual editor on:");
  log("  1. npx sanity init          (free — creates the project, writes .env)");
  log("  2. npm run seed             (uploads the current site content)");
  log("  3. npm run build            (now includes the Studio at /studio)");
  log("  See docs/VISUAL-EDITOR.md.");

  // Leave a placeholder so /studio says something useful instead of 404ing.
  mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(
    join(PUBLIC_DIR, "index.html"),
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Studio not configured</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f8fd;
font-family:"Libre Franklin",system-ui,-apple-system,sans-serif;color:#333f4b;padding:2rem}
main{max-width:34rem;text-align:center}
h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:2rem;margin:0 0 .75rem}
p{font-size:.9375rem;line-height:1.7;color:#505050;margin:0 0 1rem}
code{background:#dde4eb;padding:.15rem .4rem;border-radius:2px;font-size:.85em}
</style>
</head>
<body>
<main>
<h1>The visual editor isn&rsquo;t connected yet</h1>
<p>This site ships with a drag-and-drop editor, but it needs a free Sanity
project before it can start.</p>
<p>Run <code>npx sanity init</code>, then <code>npm run seed</code> and redeploy.
Full instructions in <code>docs/VISUAL-EDITOR.md</code>.</p>
</main>
</body>
</html>
`
  );
  process.exit(0);
}

log(`project ${projectId} / dataset ${dataset}`);

/* ---------- 2. build ---------- */

rmSync(BUILD_DIR, { recursive: true, force: true });

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const args = [
  "--no-install",
  "sanity",
  "build",
  BUILD_DIR,
  // The Sanity CLI enforces its Node engine (>=22.12). Passing the env through
  // keeps whatever Node the deploy platform selected.
];

try {
  execFileSync(npx, args, {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
      NEXT_PUBLIC_SANITY_DATASET: dataset,
      SANITY_STUDIO_BASE_PATH: "/studio",
    },
  });
} catch (err) {
  log("");
  log("The Sanity build failed. The website itself is unaffected.");
  log(`Reason: ${err.message}`);
  log("");
  log("Most common causes:");
  log("  • Node older than 22.12 (Sanity 6 requires it).");
  log("    → Vercel: Settings → General → Node.js Version → 22.x");
  log("  • NEXT_PUBLIC_SANITY_PROJECT_ID is a placeholder, not a real project id.");
  log("    → run `npx sanity init` and copy the id it prints.");
  // Don't fail the deploy: the public site must still ship.
  process.exit(0);
}

if (!existsSync(join(BUILD_DIR, "index.html"))) {
  log(`no index.html in ${BUILD_DIR} — skipping the copy.`);
  process.exit(0);
}

/* ---------- 3. publish ---------- */

rmSync(PUBLIC_DIR, { recursive: true, force: true });
mkdirSync(PUBLIC_DIR, { recursive: true });

// Copy everything, then drop the site's own images/fonts that Sanity's bundler
// copied in from public/ — the Studio doesn't need 11 MB of photographs.
cpSync(BUILD_DIR, PUBLIC_DIR, { recursive: true });
for (const heavy of ["images", "fonts"]) {
  rmSync(join(PUBLIC_DIR, heavy), { recursive: true, force: true });
}

// Sanity's index.html references /flex-canvas.css (the drag-drop canvas styles
// live in public/). Make sure that file made the trip.
if (!existsSync(join(PUBLIC_DIR, "flex-canvas.css"))) {
  const src = join(root, "public", "flex-canvas.css");
  if (existsSync(src)) cpSync(src, join(PUBLIC_DIR, "flex-canvas.css"));
}

// Sanity prefixes the JS/CSS with the CLI basePath but leaves the favicon and
// manifest references at /static/…, which would 404 (and /static is not a path
// this site owns). Normalise every static reference to /studio/static/….
const indexPath = join(PUBLIC_DIR, "index.html");
let html = readFileSync(indexPath, "utf8");
const before = html;
html = html
  .replace(/(["'])\/static\//g, "$1/studio/static/")
  // guard against double-prefixing if Sanity ever fixes this upstream
  .replace(/\/studio\/studio\/static\//g, "/studio/static/");
if (html !== before) writeFileSync(indexPath, html);

const unprefixed = [...html.matchAll(/(["'])\/static\//g)].length;
if (unprefixed > 0) {
  log("");
  log(`WARNING: ${unprefixed} asset reference(s) still point at /static/….`);
  log("The Studio would load a blank page. Check that sanity.cli.ts has");
  log('project: { basePath: "/studio" } and rebuild.');
} else {
  log("published to public/studio (asset paths OK)");
}
