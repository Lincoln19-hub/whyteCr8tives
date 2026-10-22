# Adding your own photos

The site references images by path, so swapping photos is a two-step job:
put the file in `public/images/`, then point the reference at it.

---

## 1. Where each photo is referenced

Everything lives in `data/` — no component edits needed.

| File | Controls |
| ---- | -------- |
| `data/site.ts` → `homeTiles` | The three tiles under the hero on the home page |
| `data/services.ts` → `services[].heroImages` | The two images at the top of each service page |
| `data/services.ts` → `serviceShared` | The "Latest Work" strip and the About / Contact / Portfolio cards (shared by all 7 service pages) |
| `data/services.ts` → `portfolioGalleries` | The 9 images in each of `/gallery-1`, `/gallery-2`, `/gallery-4` |
| `data/services.ts` → `portfolioTiles` | The 6 tiles on `/portfolio` |
| `data/site.ts` → `packages[].image` | The image beside each ratecard package |

Hard-coded in page files (only a handful):

| Where | File | Line to change |
| ----- | ---- | -------------- |
| Home carousel | `app/page.tsx` | the `carouselImages` array |
| Home about portrait | `app/page.tsx` | `src="/images/lincoln-1.jpg"` |
| Home "let's connect" trio | `app/page.tsx` | `horizontal_4`, `horizontal_3`, `horizontal_7` |
| About banner | `app/about/page.tsx` | `src="/images/lincoln-3.jpg"` |
| About portrait | `app/about/page.tsx` | `src="/images/lincoln-2.jpg"` |
| About form panel | `app/about/page.tsx` | `src="/images/lincoln-4.jpg"` |
| Contact carousel | `app/contact/page.tsx` | the `carouselImages` array |
| Contact portrait | `app/contact/page.tsx` | `src="/images/portrait_6.jpg"` |
| Social share image | `app/layout.tsx` | `images: [{ url: "/images/horizontal_1.jpg" … }]` |

**Easiest path:** keep the same filenames and just replace the files in
`public/images/`. Every reference keeps working and nothing else changes.

---

## 2. Adding a photo to a gallery

Edit the relevant array in `data/services.ts`:

```ts
export const portfolioGalleries = [
  {
    slug: "gallery-1",
    title: "Weddings",
    images: [
      "/images/horizontal_8.jpg",
      "/images/my-new-wedding-photo.jpg",   // ← add it here
      …
    ],
  },
```

Any absolute `https://` URL works too, but local files are faster and can't
break if a third-party host changes.

---

## 3. Before you upload: resize

Camera originals are 20–60 MB each and will make the site crawl. Export for web:

* **Long edge:** 2000–2500 px (the grid's max width is 1600 px).
* **Format:** JPEG quality 78–85, or WebP.
* **Colour:** sRGB.
* **Target:** roughly 300–700 KB per image.

Free options: [Squoosh](https://squoosh.app) (one at a time, in the browser), a
Lightroom export preset, or ImageMagick for a whole folder:

```bash
magick ~/exports/weddings/*.jpg -resize 2200x2200\> -quality 82 \
  -colorspace sRGB -strip public/images/
```

---

## 4. Layout note — why photos don't need cropping

The Flex grid gives every image box a fixed proportion, and images use
`object-fit: cover`, so any photo fills its box cleanly regardless of its own
aspect ratio. You don't need to pre-crop to match.

If you *do* want a different proportion for a particular image, change its box
in the page's `FlexItem box={…}` — `width` and `height` are counts of square
grid cells (26 columns across on desktop and tablet, 10 on mobile).

---

## 5. Ship it

```bash
npm run build     # sanity-check locally
git add -A
git commit -m "Swap in real wedding photos"
git push          # Vercel deploys automatically
```

> Replaced a file but still seeing the old one? That's browser cache —
> hard-refresh (Ctrl/Cmd + Shift + R). Vercel serves `/images` with a one-year
> immutable cache, so keeping the same filename means returning visitors may
> need that hard refresh once. If that's a problem, upload under a new filename
> and update the reference instead.
