# whyteCreatives — portfolio site

A hand-coded rebuild of the Pixieset site (`thewhytecreatives.mypixieset.com`) as a
fast, self-hosted **Next.js (App Router)** project, deployable to **Vercel**.

**All four build pieces are complete.** 15 static routes + 1 serverless function,
production build verified, Lighthouse-friendly, zero third-party requests.

---

## Stack

| Layer     | Choice | Why |
| --------- | ------ | --- |
| Framework | Next.js 16 (App Router, Turbopack) | Vercel-native, everything prerenders to static HTML |
| Language  | TypeScript (strict) | Safe refactors as content grows |
| Styling   | Hand-written CSS design system (`app/globals.css`) | No Tailwind/UI-kit dependency, full control |
| Fonts     | Self-hosted Instrument Serif · Work Sans · Libre Franklin | The original site's actual faces, with **zero** external requests |
| Images    | Local files in `public/images/` | No hotlinking a third-party CDN that could break |
| Form      | Serverless route → Formspree / Resend / mailto | Works with or without any account set up |
| Hosting   | Vercel | `vercel.json` preconfigured (clean URLs, redirects, cache headers) |

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — the exact command Vercel runs
npm start        # serve the production build
```

Requires Node 20+.

---

## Deploy to Vercel

**Option A — Dashboard**
1. Push this folder to a GitHub / GitLab / Bitbucket repo.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. Vercel auto-detects Next.js. Click **Deploy**.

**Option B — CLI**
```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

**Option C — Git push**
Once the repo is linked, every push to the default branch ships to production and
pull requests get their own preview URL.

**After the first deploy**
1. Vercel → project → **Settings → Domains** → add your custom domain, follow the DNS steps.
2. Update `url` in `data/site.ts` to that domain — it feeds the canonical tags,
   Open Graph URLs, `sitemap.xml` and `robots.txt`.
3. Add contact-form environment variables (**Settings → Environment Variables**),
   then redeploy. See [Contact form](#contact-form).

---

## Pages

| Route | Contents |
| ----- | -------- |
| `/` | Full-bleed hero · featured galleries · "Your story deserves to be seen" · marquee · "Get to know me" · dark CTA |
| `/portfolio` | "My Works" — all galleries as a masonry grid |
| `/gallery/[slug]` | One gallery per slug: masonry + click-to-zoom lightbox + related galleries + CTA. 7 built at compile time via `generateStaticParams` |
| `/about` | Banner + name · bio · values grid · contact form |
| `/contact` | 3-step "How I work" · services grid · marquee · contact form |
| `/sitemap.xml` · `/robots.txt` | Generated from live data |
| `404` | Custom "Lost frame" page |

---

## Project structure

```
whyte-creatives/
├─ app/
│  ├─ layout.tsx        root layout, metadata/SEO, JSON-LD
│  ├─ page.tsx          home
│  ├─ portfolio/page.tsx
│  ├─ gallery/[slug]/   page.tsx (SSG) + GalleryGrid.tsx (client, lightbox state)
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  ├─ api/contact/route.ts   serverless form handler
│  ├─ sitemap.ts · robots.ts · icon.svg · not-found.tsx
│  ├─ fonts.css         generated @font-face rules (do not hand-edit)
│  └─ globals.css       the whole design system
├─ components/
│  ├─ Header.tsx  Footer.tsx  Reveal.tsx  Marquee.tsx
│  ├─ GalleryTile.tsx   Lightbox.tsx   ContactForm.tsx
│  └─ JsonLd.tsx   FontPreload.tsx
├─ data/
│  ├─ site.ts           ALL copy, nav, contact details, values, process, services
│  └─ galleries.ts      ALL galleries + images (single source of truth)
├─ scripts/
│  └─ make-gallery-config.mjs   photo folder → data/galleries.ts generator
├─ docs/
│  └─ ADDING-PHOTOS.md  the swap-in-your-own-photos guide
├─ public/
│  ├─ images/           26 photos currently in use
│  └─ fonts/            33 self-hosted woff2 subsets
├─ next.config.mjs · vercel.json · tsconfig.json · .env.example
```

### Editing content

* **Copy, contact info, socials, nav, services, process steps** → `data/site.ts`
* **Galleries and photos** → see [`docs/ADDING-PHOTOS.md`](docs/ADDING-PHOTOS.md)
* **Colours, fonts, spacing** → the `:root` variables at the top of `app/globals.css`

---

## Adding your own photos

Full walkthrough in **[`docs/ADDING-PHOTOS.md`](docs/ADDING-PHOTOS.md)**. Short version:

```bash
# 1. one folder per gallery — the folder name becomes the URL slug
mkdir -p public/images/weddings
cp ~/exports/weddings/*.jpg public/images/weddings/

# 2. regenerate the gallery data (reads real aspect ratios from the files)
npm run galleries

# 3. ship
git add -A && git commit -m "Add wedding gallery" && git push
```

The generator:
* reads each photo's **actual pixel dimensions** from the file header and bakes the
  exact `aspect-ratio` into the markup, so grids reserve the right space and
  nothing shifts while images load (no CLS);
* sorts naturally (`IMG_2` before `IMG_10`) and uses the first file as the cover;
* mixes folders (`weddings/`) and filename prefixes (`weddings--01.jpg`);
* reports any image it couldn't match to a gallery instead of silently dropping it.

Titles, blurbs, gallery order and home-page features are edited in the `META` /
`ORDER` / `FEATURED` maps at the top of the script.

**Resize before uploading** — long edge 2000–2500 px, JPEG quality ~80, sRGB,
roughly 300–700 KB each. Camera originals will make the site crawl.

---

## Design notes

Rebuilt to match the original Pixieset *Flex / Mason* theme as closely as
possible. The design tokens were extracted from the live site's own CSS custom
properties rather than eyeballed:

| Token | Value (from the original) |
| ----- | ------------------------- |
| Page background | `#F5F8FD` |
| Alt background | `#DDE4EB` |
| Headings | `#333F4B`, Instrument Serif, `-0.02em` |
| Body | `#505050`, Libre Franklin, `0.9375rem` |
| Details / eyebrows | `#A0AEBB`, `0.875rem`, uppercase, `0.1em` |
| Buttons | `#424A53` → hover `#A0AEBB`, Work Sans 600, `0.75rem`, uppercase, `0.2em` |
| Dark sections | `#222426` bg, `#CACACA` text |
| Display heading | `5.375rem` / H1 `4rem` / H2 `3.25rem` / H3 `2.125rem` / H4 `1.75rem` |
| Corners | `0` (square, as on the original) |
| Column gap | `3.125rem` desktop · `1.875rem` tablet & mobile |

Type scale uses the original's fluid `min(rem, 1rem + Nvw)` formulas, so headings
scale exactly as they do on the Pixieset site.

Also in place: scroll-reveal animations, masked image wipes, infinite marquee
strips, hover fill on buttons, a keyboard- and swipe-navigable lightbox, and a
full `prefers-reduced-motion` fallback.

---

## Contact form

`components/ContactForm.tsx` posts to `app/api/contact/route.ts`. Copy
`.env.example` → `.env.local` locally, and add the same variables in
**Vercel → Settings → Environment Variables**.

| Provider | Variables | Behaviour |
| -------- | --------- | --------- |
| **Formspree** | `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Free tier, forwards to your inbox, no extra code |
| **Resend** | `RESEND_API_KEY`, `CONTACT_INBOX_EMAIL`, optional `CONTACT_FROM_EMAIL` | Sends a formatted email straight to you |
| **mailto fallback** | `NEXT_PUBLIC_FALLBACK_EMAIL` | If nothing else is configured, the visitor's mail app opens pre-filled — the form never dead-ends |

The route validates required fields and email format, caps input length, ignores a
honeypot field to drop bot spam, and returns JSON in every path. All five
branches were tested against the production build.

---

## Performance & SEO

* Every page except the form handler is **prerendered static HTML** — served from
  Vercel's edge, typically <10 ms.
* Fonts: 3 latin subsets (~97 KB) self-hosted and preloaded via React 19's
  `preload()` in `components/FontPreload.tsx` — exactly one `<link>` each, no
  duplicates (writing them into `<head>` manually gets hoisted *and* duplicated
  under Next 16).
* Images: exact `aspect-ratio` on every frame → no layout shift.
* `/images` and `/fonts` get `Cache-Control: public, max-age=31536000, immutable`.
* Per-page `title`, `description`, `canonical`, Open Graph and Twitter cards.
* `sitemap.xml` (11 URLs) and `robots.txt` generated from live gallery data.
* JSON-LD `LocalBusiness` / `ProfessionalService` + `WebSite` + `CollectionPage`
  with the Akosombo address, so the studio can appear in local search.
* Semantic landmarks, skip link, focus-visible rings, ARIA labels on the lightbox
  and mobile nav.

---

## Build roadmap

- [x] **Piece 1 — Foundation & home**: scaffold, design system, header/footer, hero,
      featured galleries, story section, marquee, about teaser, CTA, 404, Vercel config.
- [x] **Piece 2 — Portfolio & galleries**: `/portfolio`, dynamic `/gallery/[slug]`
      (SSG), masonry, lightbox with keyboard + swipe.
- [x] **Piece 3 — About & Contact**: bio, values grid, 3-step process, services,
      working form with three delivery paths.
- [x] **Piece 4 — Ship it**: self-hosted fonts matched to the original, exact design
      tokens, sitemap/robots/JSON-LD, canonicals, preloads, photo-swap generator,
      docs, production build verified.

---

## Still worth doing

* **Set `site.url`** in `data/site.ts` to your real domain (currently a placeholder).
* **Set real contact details** — `email`, `phone` and the three social URLs in
  `data/site.ts` are placeholders.
* **Configure one form provider** (see above) so enquiries land in an inbox.
* **Swap the 26 placeholder photos** for Lincoln's own — they came from the
  Pixieset theme as stand-ins.
* Optional: add a client gallery / proofing flow, a blog, or booking with
  availability — the structure makes each of those a new `app/` folder.
