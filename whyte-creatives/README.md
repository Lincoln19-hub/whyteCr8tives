# whyteCreatives — portfolio site

A rebuild of `thewhytecreatives.mypixieset.com` as a self-hosted **Next.js (App
Router)** project for **Vercel**.

Built to match the original as closely as possible: the layout is a faithful
reimplementation of Pixieset's **Flex grid block model**, using the geometry,
colours, fonts and copy extracted from the live site rather than an
interpretation of it.

**14 routes** prerendered to static HTML, **1 serverless function**, production
build verified, zero third-party requests.

---

## What was extracted from the live site

Rather than eyeballing the design, the original's HTML and CSS were pulled apart:

| Thing | Source | Result |
| ----- | ------ | ------ |
| Design tokens | The page's own `--accent-*` / `--heading-*` custom properties | Exact colours, fonts, weights, letter-spacing, fluid type scale |
| Fonts | `font-family` declarations | Instrument Serif · Work Sans · Libre Franklin — downloaded and self-hosted (33 subsets) |
| Layout model | `.fb-block` / `.fb-element` rules | 26-column grid of **square cells**, elements placed by 1-based `--top`/`--left`/`--width`/`--height`, per breakpoint |
| Block geometry | `--rows_desktop` / `--rows_tablet` / `--rows_mobile` + padding scales | Every home-page block reproduced cell-for-cell |
| Content | All 13 pages crawled | Real nav, real copy, real ratecards, real contact details |

The 13 pages of the original are all present: home, about, contact, portfolio,
seven service/ratecard pages and three galleries.

---

## Pages

| Route | Contents |
| ----- | -------- |
| `/` | Right-aligned display heading over plain background → three gallery tiles (Brand shots / People / Products) → "Your story deserves to be seen." → full-width carousel → "I'm lincoln whyte / Get to know me" → "Let's connect" |
| `/portfolio` | "My Works" — six captioned tiles |
| `/gallery-1` `/gallery-2` `/gallery-4` | Weddings · Events · Portrait — nine images each, click-to-zoom lightbox |
| `/wedding` | Wedding Photography & Videography + ratecards |
| `/events` | Events Photography + ratecards |
| `/corporate-photography` | Corporate Photography + ratecards |
| `/studio-portrait` | Studio Portrait + ratecards |
| `/outdoor-portrait` | Outdoor Portrait + ratecards |
| `/graduation` | Graduate with Whyte + ratecards |
| `/lifestyle-photography` | Lifestyle Photography + ratecards |
| `/about` | Banner + "My name is Lincoln Richmond Whyte" → bio → values → contact form |
| `/contact` | Three "How I work" steps → carousel → form |
| `/sitemap.xml` `/robots.txt` | Generated from live data |

Note `/gallery-3` deliberately does not exist — the original skips it, so this
site 404s on it too.

**Navigation** matches the original exactly, including both dropdowns:

```
Home · About · Services & Ratecards ▾ · Portfolio ▾ · Contact
                    ├ Weddings                  ├ Weddings   (/gallery-1)
                    ├ Events                    ├ Events     (/gallery-2)
                    ├ Corporate Photography     └ Portrait   (/gallery-4)
                    ├ Studio Portrait
                    ├ Outdoor Portrait
                    ├ Graduate with Whyte
                    └ Lifestyle Photography
```

---

## The Flex grid layout system

Pixieset's Flex editor lays pages out as **blocks of square grid cells**. Each
block declares a column count and a row count per breakpoint; each element inside
it declares a 1-based box. Because the cells are square, a block's height follows
from `columns ÷ rows` — which is how the original keeps its proportions at any
width.

That model is reimplemented in two components:

```tsx
<FlexBlock geometry={{ rows: { desktop: 14, tablet: 19, mobile: 30 } }}>
  <FlexItem box={{
    desktop: { top: 1, left: 13, width: 13, height: 4 },
    tablet:  { top: 1, left: 6,  width: 20, height: 7 },
    mobile:  { top: 1, left: 2,  width: 8,  height: 5 },
  }}>
    <h1>Creative Visuals. Timeless Stories.</h1>
  </FlexItem>
</FlexBlock>
```

Those numbers are the **actual values from the original site's stylesheet** for
its hero heading. The CSS turns them into `grid-row` / `grid-column` spans and
gives the block `aspect-ratio: columns / rows`.

Breakpoints match Pixieset's: desktop ≥992px (26 cols), tablet 768–991px (26
cols), mobile ≤767px (10 cols). Column gaps are the original's `3.125rem` /
`1.875rem` / `1.875rem`.

`components/flex/FlexBlock.tsx` and `FlexItem.tsx` document the model in full.

---

## Design tokens

All from the original's own CSS custom properties.

| Token | Value |
| ----- | ----- |
| Page background | `#F5F8FD` |
| Alt background | `#DDE4EB` |
| Headings | `#333F4B` · Instrument Serif · `-0.02em` |
| Body | `#505050` · Libre Franklin · `0.9375rem` |
| Details / eyebrows | `#A0AEBB` · `0.875rem` · uppercase · `0.1em` |
| Buttons | `#424A53` → hover `#A0AEBB` · Work Sans 600 · `0.75rem` · uppercase · `0.2em` |
| Dark | `#222426` bg · `#CACACA` text |
| Type scale | display `5.375rem` · h1 `4rem` · h2 `3.25rem` · h3 `2.125rem` · h4 `1.75rem` · h5 `0.875rem` · h6 `0.75rem` |
| Fluid sizing | the original's `min(rem, 1rem + Nvw)` formulas |
| Corners | `0` (square, as the original) |

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # the exact command Vercel runs
npm start        # serve the production build
```

Node 20+.

> `node_modules` is not part of the saved workspace, so after a fresh session run
> `npm ci` first — it restores the exact locked versions in a few seconds.

---

## Deploy to Vercel

**Dashboard** — push to GitHub/GitLab/Bitbucket, then [vercel.com/new](https://vercel.com/new) and import. Next.js is auto-detected.

**CLI**
```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

**Then**
1. **Settings → General → Node.js Version → 22.x.** Two independent reasons:
   Vercel **disabled Node 20 for new builds on 1 Oct 2026**, and Sanity 6 (the
   visual editor) requires ≥ 22.12. `.nvmrc` and `engines.node` are already
   pinned to `22.x`, but the Project Settings dropdown outranks both — if it
   still says 20.x the deploy fails before your build command ever runs.
2. **Settings → Domains** → add your custom domain, follow the DNS steps.
3. Update `site.url` in `data/site.ts` — it feeds canonicals, OG URLs,
   `sitemap.xml` and `robots.txt`.
4. Add env vars (**Settings → Environment Variables**) and redeploy — the
   contact-form ones, plus the Sanity ones if you want the editor. See
   [`.env.example`](.env.example) and [`docs/VISUAL-EDITOR.md`](docs/VISUAL-EDITOR.md).

`vercel.json` already sets clean URLs, immutable caching on `/images`, `/fonts`
and `/studio/static`, `noindex` on `/studio`, and redirects from the old
`/gallery/*` and `/services/*` shapes. Its `buildCommand` is `npm run build` —
don't change that to a bare `next build` or the Studio won't be built.

---

## Project structure

```
whyte-creatives/
├─ app/
│  ├─ layout.tsx            bare root layout — <html><body> only, on purpose
│  ├─ (site)/               every public page + all the site chrome
│  │  ├─ layout.tsx         metadata/SEO, fonts, Header, SiteFooter, JSON-LD
│  │  ├─ page.tsx           home (5 FlexBlocks, geometry from the original)
│  │  ├─ about/ contact/ portfolio/
│  │  ├─ (services)/        7 ratecard pages, one folder each for exact URLs
│  │  ├─ (galleries)/[slug]/ gallery-1, -2, -4 (SSG) + GalleryView + lightbox
│  │  └─ not-found.tsx
│  ├─ api/contact/route.ts  serverless form handler
│  ├─ sitemap.ts robots.ts icon.svg
│  ├─ fonts.css             generated @font-face rules (do not hand-edit)
│  └─ globals.css           design system + Flex grid CSS
├─ components/
│  ├─ flex/                 FlexBlock.tsx · FlexItem.tsx  ← the layout model
│  ├─ Header.tsx            sticky nav + both dropdowns + mobile overlay
│  ├─ SiteFooter.tsx        footer as a FlexBlock, real contact details
│  ├─ ServicePage.tsx       template shared by all 7 service pages
│  ├─ ImageCarousel.tsx     the full-width auto-advancing carousel
│  ├─ Lightbox.tsx ContactForm.tsx Reveal.tsx BackToTop.tsx
│  └─ JsonLd.tsx FontPreload.tsx
├─ data/
│  ├─ site.ts               copy, nav, real contact details, values, process, packages
│  └─ services.ts           the 7 services, 3 galleries, 6 portfolio tiles
├─ sanity/                  the visual editor — see docs/VISUAL-EDITOR.md
│  ├─ schemaTypes/          page · block · element · box · siteSettings
│  ├─ components/FlexCanvas.tsx   drag-and-drop grid editor
│  └─ structure.ts          the Studio sidebar
├─ scripts/
│  ├─ build-studio.mjs      builds the Studio into public/studio/
│  └─ seed-sanity.mjs       uploads your existing content
├─ docs/ADDING-PHOTOS.md · docs/VISUAL-EDITOR.md
├─ public/images/           38 photos   public/fonts/  33 woff2 subsets
├─ public/flex-canvas.css   the editor canvas' styles
├─ sanity.config.ts sanity.cli.ts
├─ next.config.mjs · vercel.json · tsconfig.json · .env.example
```

> `app/layout.tsx` is deliberately empty of chrome, and everything site-shaped
> lives in the `(site)` route group. A nested layout can't remove what the root
> layout renders, and the Studio needs the whole viewport to itself.

### Editing content

* **Without touching code** → [`docs/VISUAL-EDITOR.md`](docs/VISUAL-EDITOR.md).
  A drag-and-drop editor at `/studio`: brand lines, contact details, socials,
  navigation, ratecard packages today; page layout once the renderer is wired up.
* **Contact details, socials, nav, copy, values, process steps, ratecards** → `data/site.ts`
* **Services, galleries, portfolio tiles** → `data/services.ts`
* **Photos** → [`docs/ADDING-PHOTOS.md`](docs/ADDING-PHOTOS.md)
* **Colours, fonts, spacing** → `:root` in `app/globals.css`
* **Block geometry** → the `BlockGeometry` constants at the top of each page

---

## The visual editor

`/studio` is a Sanity Studio with a custom **drag-and-drop canvas** that edits
the Flex grid directly — move an element, resize it, and switch between
desktop / tablet / mobile, each stored separately.

It is *pre-built* into `public/studio/` by `scripts/build-studio.mjs` rather
than embedded in the Next build. Embedding it (`app/studio/[[...tool]]/page.tsx`)
bundles the entire Studio into `next build`, which was measured here at
**>15 minutes and then SIGKILLed for memory** with Turbopack, and ~70 s to the
same fate with webpack. Sanity's own bundler does it in **6 seconds**.

```bash
npx sanity init     # once — free project, prints the project id
npm run seed        # uploads your current content into it
npm run build       # Studio + site
```

Setup, Vercel settings, troubleshooting and an honest list of what is editable
today versus what still lives in code:
**[`docs/VISUAL-EDITOR.md`](docs/VISUAL-EDITOR.md)**.


---

## Ratecards

Every service page carries the same two packages, copied from the original:

**Package One — from $1200**
Up to 2 hours · 40–80 edited photos · 2 archival prints (up to 11×14") · 2 min BTS
video · pre-shoot call, light retouch, online gallery, 1-year web/social usage ·
selects in 48–72h, finals in 5 business days.

**Package Two — from $1600**
Up to 6 hours · 100–160 edited photos · 6 archival prints · 3–5 min BTS video +
social cutdowns · creative deck, producer support, talent direction, product
styling, enhanced retouch, usage up to 2 years · selects in 48h, finals staged
over 5–10 business days.

> ⚠ **Worth confirming with Lincoln:** on the live site, `/studio-portrait` shows
> Package One as **"from ₵300"** while all six other service pages show
> **"from $1200"**, and Package Two is `$1600` everywhere. The ₵300 looks like an
> unfinished edit. This build normalises to $1200 and keeps the ₵300 as a
> one-line `priceOverrides` entry in `data/services.ts`, so it's trivial to
> restore or change once confirmed.
>
> The prices are also mixed currency (`$` vs `₵`) on the original — worth
> deciding which the ratecards should actually quote.

---

## Contact form

`components/ContactForm.tsx` posts to `app/api/contact/route.ts`. Copy
`.env.example` → `.env.local`, and add the same variables in Vercel.

| Provider | Variables | Behaviour |
| -------- | --------- | --------- |
| **Formspree** | `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Free tier, forwards to the inbox |
| **Resend** | `RESEND_API_KEY`, `CONTACT_INBOX_EMAIL`, optional `CONTACT_FROM_EMAIL` | Formatted email straight to you |
| **mailto fallback** | defaults to `whytecobby@gmail.com` | Visitor's mail app opens pre-filled — the form never dead-ends |

Validates required fields and email format, caps input length, drops bot spam via
a honeypot. All five branches tested against the production build.

---

## Performance & SEO

* Every page but the form handler is **prerendered static HTML** — 5–40 ms.
* Fonts: 3 latin subsets (~97 KB) self-hosted, preloaded via React 19's
  `preload()` (exactly one `<link>` each — writing them into `<head>` manually
  gets hoisted *and* duplicated under Next 16).
* Images carry fixed grid boxes with `object-fit: cover`, so no layout shift.
* `/images` and `/fonts`: `Cache-Control: public, max-age=31536000, immutable`.
* Per-page `title`, `description`, `canonical`, Open Graph and Twitter cards.
* `sitemap.xml` (14 URLs) and `robots.txt` generated from live data.
* JSON-LD: `LocalBusiness`/`ProfessionalService` with the New Combine, Akosombo
  address, an `OfferCatalog` of all seven services, plus `WebSite` and a
  `CollectionPage` with an `ItemList` of the galleries.
* Skip link, semantic landmarks, focus-visible rings, ARIA on the lightbox,
  carousel and both dropdowns; full `prefers-reduced-motion` fallback.

---

## Still worth doing

* **Set `site.url`** in `data/site.ts` to the real domain (currently a placeholder).
* **Confirm the ₵300 / $1200 ratecard discrepancy** above.
* **Configure one form provider** so enquiries land in an inbox.
* **Swap the placeholder photos** — the 38 images came from the Pixieset theme
  (plus four real portraits of Lincoln). See `docs/ADDING-PHOTOS.md`.
* The original's `/contact` steps 2 and 3 still contain Pixieset's
  "Click edit and enter your own text" placeholder copy; real copy has been
  written for them here — worth a read-through and Lincoln's approval.
* Optional: client proofing galleries, a blog, or online booking.
