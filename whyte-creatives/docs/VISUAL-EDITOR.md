# The visual editor (no-code page building)

Your site ships with a drag-and-drop editor, like the one Pixieset gives you.
It lives at **`https://your-domain/studio`** — same deployment, same repo, no
second service to pay for.

It is built on [Sanity](https://www.sanity.io) (free tier is enough for this
site) and it edits the same layout model the site is built from: a grid of
**square cells**, 26 columns wide on desktop and tablet, 10 on mobile. Every
element on every page is placed by four numbers — top row, left column, width,
height — at each of the three breakpoints. The editor lets you drag those
instead of typing them.

---

## Turn it on (about 10 minutes, once)

### 1. Create the free Sanity project

```bash
npx sanity init
```

Answer the prompts:

| Prompt | Answer |
| --- | --- |
| Create new project or use existing? | **Create new project** |
| Project name | `whyteCreatives` |
| Plan | **Free** (no card needed) |
| Dataset name | `production` |
| Would you like to add configuration files? | **No** — this repo already has them |

It prints a **project id** (a short lowercase string, e.g. `a1b2c3d4`). Put it
in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Create a write token (for the one-off content upload)

<https://www.sanity.io/manage> → your project → **API** → **Tokens** →
**Add token** → name it `seed`, role **Editor** → copy it into `.env.local`:

```bash
SANITY_API_WRITE_TOKEN=sk…
```

### 3. Upload your existing content

```bash
npm run seed
```

This writes your brand lines, contact details, socials, the whole navigation
(both dropdowns) and both ratecard packages with every feature bullet into
Sanity, so the editor opens full instead of empty. Re-running it is safe — it
replaces rather than duplicates.

### 4. Build and deploy

```bash
npm run build
```

`npm run build` now does two things: builds the Studio into `public/studio/`
(≈6 seconds) and then builds the site (≈7 seconds). Deploy as normal.

### 5. On Vercel — two settings that must be right

**1. Node.js version → 22.x.** Project → Settings → General → Node.js Version.

This one is not optional, and not only because of Sanity. **Vercel disabled
Node.js 20 for new builds and functions on 1 October 2026.** A project pinned to
Node 20 fails at deploy time with:

```
Node.js Version "20.x" is discontinued and must be upgraded.
Please set "engines": { "node": "22.x" } in your package.json
```

Sanity 6 independently requires Node ≥ 22.12, so 22.x satisfies both. This repo
pins it in the two places Vercel reads, in its resolution order:

| File | Value | Notes |
| --- | --- | --- |
| `.nvmrc` | `22.x` | read first — use the `.x` form, a bare `22` is ambiguous |
| `package.json` → `engines.node` | `22.x` | a range like `>=22.12` makes Vercel's choice unpredictable |
| `.node-version` | *absent on purpose* | would sit between the two above |

If Vercel still picks 20, it is because the **Project Settings** dropdown holds a
`NODE_VERSION` that outranks both files — change it there too. The legacy
`build.env.NODE_VERSION` key was removed from `vercel.json` for the same reason:
Vercel now treats Project Settings as the canonical place for env vars, and a
value there silently overrode the files.

**2. Environment variables.** Project → Settings → Environment Variables → add
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_API_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`.

`NEXT_PUBLIC_*` values are baked into the build, so after adding or changing them
you must **redeploy** — saving alone does nothing.

> **Do not** change Vercel's Build Command away from `npm run build`.
> If it runs a bare `next build`, the Studio never gets built and `/studio`
> shows the "not configured" page.
>
> **Do** commit `package-lock.json`. It is what makes `npm install` resolve the
> same tree on Vercel as locally.

### 6. Let your editor in

<https://www.sanity.io/manage> → your project → **Access** → invite the email
address you want to edit from. Free tier allows 3 users. They sign in at
`https://your-domain/studio` with that Sanity login — the Studio is not public,
it is `noindex` and requires authentication.

---

## Why the Studio is pre-built instead of embedded

The usual Next.js + Sanity setup mounts the Studio inside the app at
`app/studio/[[...tool]]/page.tsx`. That pulls the entire Studio — a large React
application — into `next build`.

It does not survive a normal build machine. Measured on this project:

| Approach | Result |
| --- | --- |
| Embedded (`next build` with the Studio route) | **SIGKILL** — Turbopack ran >15 min and was killed for memory; webpack died the same way in ~70 s. Needs several GB of heap. |
| Pre-built (`sanity build` → `public/studio/`) | **6 seconds**, tiny memory, then `next build` takes 7 s as before. |

So `scripts/build-studio.mjs` builds the Studio with Sanity's own bundler and
drops the result in `public/studio/`. Next serves it as static files, and three
rewrites in `next.config.mjs` give the Studio's client-side router its SPA
fallback so a hard refresh on `/studio/structure/page;abc` still works:

```js
{ source: "/studio",          destination: "/studio/index.html" },
{ source: "/studio/",         destination: "/studio/index.html" },
{ source: "/studio/:path*",   destination: "/studio/index.html" },
```

Next checks real files in `public/` before applying rewrites, so
`/studio/static/sanity-….js` is served from disk and only the non-file routes
fall through to `index.html`.

One detail that bites everyone: **`basePath` has to be set in two places**, and
they do different jobs.

- `sanity.cli.ts` → `project.basePath: "/studio"` — makes the build emit asset
  URLs as `/studio/static/…`. Without it they come out as `/static/…`, which
  404s, and you get a blank white page with no error.
- `sanity.config.ts` → `basePath: "/studio"` — the Studio's internal router, so
  sidebar links go to `/studio/structure` rather than `/structure`.

`scripts/build-studio.mjs` checks the built `index.html` and warns loudly if
any reference is still unprefixed.

---

## Using the editor

Open `/studio` → **Pages** → pick a page → open a **Block** → the
**Elements** field shows the canvas.

- **Drag a chip** to move it. It snaps to whole cells.
- **Drag a handle** (the dots on a selected chip's edges and corners) to resize.
- **Arrow keys** nudge the selected element one cell. **Shift + arrow** resizes it.
- **Desktop / Tablet / Mobile tabs** switch breakpoint — each one is stored
  separately, exactly like the site's three media queries. Move something on
  mobile and desktop is untouched.
- **Grid** toggles the cell overlay.
- The numbers under the canvas are the same four values you'd otherwise type:
  Top, Left, Width, Height. They stay in sync with the drag.
- **Duplicate** copies an element with its styling, dropped one row-height below.
- **+ Add element** makes a new one; set its Type (heading, paragraph, image,
  button, carousel, list, price, card…) in the Content tab.

The block's **Rows** fields (one per breakpoint) set how tall that section is.
Because the cells are square, rows control the section's height directly:
a 26-column block with 12 rows is 26/12 as wide as it is tall.

### Images

An element of type **Image** has two ways to get a picture:

- **Image** — upload through the Studio. Sanity hosts it on its CDN and you can
  set a crop/hotspot. Best for new photos.
- **…or an image already on the site** — a path like `/images/horizontal_1.jpg`,
  pointing at the photographs already in `public/images/`. The uploaded Image
  wins if both are filled in.

---

## What's editable today — and what still lives in code

Be clear about this, because it decides how much you can change without me.

**In Sanity now** (after `npm run seed`):

- Brand lines, tagline, footer services line, copyright
- Email, phone, address, social links
- The full navigation, including both dropdowns — add, rename, reorder, re-link
- Both ratecard packages: names, prices, every feature bullet
- Seven service-page documents (title, URL, meta description)

**Still rendered from code:**

- The **layout geometry** of the home, about, contact, portfolio, service and
  gallery pages. The schema, the canvas and the grid model are all in place and
  match the site exactly — but the pages themselves still read their block and
  element positions from `app/(site)/page.tsx`, `components/ServicePage.tsx`
  and friends, not from Sanity.
- The photographs, which are still files in `public/images/` (see
  `docs/ADDING-PHOTOS.md`).

Wiring the pages to render *from* Sanity is the remaining step. It is a
contained piece of work: a `lib/sanity` client, a renderer that maps a Sanity
`block` to the existing `FlexBlock`/`FlexItem` components (they already speak
the same geometry), and a seed pass that converts the block constants in those
files into documents. Until it's done, editing a page's layout in the Studio
will not change the live page.

---

## Seeing changes live while you edit

Not wired up yet. Two pieces are needed and both are standard `next-sanity`:

- **Draft mode** — a preview URL that shows unpublished drafts.
- **`<VisualEditing />`** — click an element on the live page to jump straight
  to that field in the Studio.

Until then, publish in the Studio and redeploy (`vercel deploy --prod`, or push
to GitHub) to see it live.

---

## Troubleshooting

**`/studio` shows "The visual editor isn't connected yet"**
`NEXT_PUBLIC_SANITY_PROJECT_ID` wasn't set at build time. Add it in Vercel's
Environment Variables and redeploy. Locally, put it in `.env.local`.

**`/studio` is a blank white page**
The asset paths didn't get the `/studio` prefix. Check `sanity.cli.ts` has
`project: { basePath: "/studio" }`, rebuild, and look for the
`WARNING: … still point at /static/…` line from `scripts/build-studio.mjs`.

**`Node.js Version "20.x" is discontinued and must be upgraded`**
Vercel turned Node 20 off on 1 Oct 2026. Set 22.x in Settings → General →
Node.js Version. `.nvmrc` and `engines.node` in this repo already say `22.x`;
the Project Settings value outranks both, so change it there if it is still 20.

**`[build-studio] The Sanity build failed … Node older than 22.12`**
Same cause, caught earlier by the Sanity CLI. Set Node 22.x. Note this one does
*not* fail the deploy — the script logs it and exits 0, so the site still ships
and only `/studio` is missing. Locally, `node -v` should print v22 or newer.

**Studio loads but says the project doesn't exist / asks me to log in forever**
Wrong project id, or the logged-in Sanity account isn't a member of that
project. Check the id at <https://www.sanity.io/manage> and invite yourself
under **Access**.

**`npm run seed` → HTTP 401**
The token is wrong, expired, or was created with a role below Editor.

**The site looks wrong after a deploy**
`npm run build` also builds the Studio; if that step is skipped the *site* is
still fine. A broken site is a different problem — check that `vercel.json`'s
`buildCommand` is `npm run build` and that the build log shows
`✓ Generating static pages (19/19)`.

---

## Files

| Path | What it is |
| --- | --- |
| `sanity.config.ts` | Studio config: project id, `basePath`, plugins, schema |
| `sanity.cli.ts` | CLI config — `project.basePath` is what fixes asset URLs |
| `sanity/schemaTypes/` | `page`, `block`, `element`, `box`, `siteSettings` |
| `sanity/structure.ts` | The Studio sidebar |
| `sanity/components/FlexCanvas.tsx` | The drag-and-drop grid editor |
| `public/flex-canvas.css` | Its styles (served to the Studio at `/flex-canvas.css`) |
| `scripts/build-studio.mjs` | Builds the Studio into `public/studio/` |
| `scripts/seed-sanity.mjs` | Uploads your existing content |
| `next.config.mjs` | The three `/studio` SPA rewrites |
