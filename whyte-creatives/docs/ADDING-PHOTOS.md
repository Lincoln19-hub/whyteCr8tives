# Adding your own photos

Everything below takes about five minutes and **no code editing**.

---

## 1. Make one folder per gallery

Inside `public/images/`, create a folder for each gallery. The folder name
becomes the web address.

```
public/images/
├── weddings/          →  /gallery/weddings
│   ├── IMG_0001.jpg
│   ├── IMG_0002.jpg
│   └── IMG_0010.jpg
├── people/            →  /gallery/people
│   ├── ama-01.jpg
│   └── ama-02.jpg
├── graduation/        →  /gallery/graduation
├── events/            →  /gallery/events
├── products/          →  /gallery/products
├── outdoor/           →  /gallery/outdoor
└── studio/            →  /gallery/studio
```

Rules:

* Folder names should be lowercase, no spaces (use `-` instead).
* Files are sorted **naturally**, so `IMG_2.jpg` comes before `IMG_10.jpg`.
  Rename files if you want a specific order — the **first file in each folder
  becomes that gallery's cover image**.
* `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` and `.gif` all work.

Prefer not to use folders? Name files with a `slug--` prefix instead:

```
public/images/weddings--01.jpg
public/images/weddings--02.jpg
public/images/people--01.jpg
```

---

## 2. Generate the gallery data

```bash
node scripts/make-gallery-config.mjs            # preview what it would write
node scripts/make-gallery-config.mjs --write    # actually write data/galleries.ts
```

The script reads each photo's **real pixel dimensions** from the file header and
records the exact aspect ratio, so every grid reserves the right amount of space
and nothing jumps around while images load. Tall and wide photos mix correctly in
the masonry automatically — you don't tag anything.

Output looks like:

```
Wrote data/galleries.ts

Galleries:
  /gallery/weddings         42 images   Weddings
  /gallery/people           18 images   People
  /gallery/products          9 images   Products

  3 image(s) not matched to a gallery:
    /images/about-portrait.jpg
    ...
```

Anything listed as *not matched* is still on disk — it just isn't in a gallery.
Move it into a folder (or give it a `slug--` prefix) and re-run.

---

## 3. Titles, blurbs and order

Open `scripts/make-gallery-config.mjs` and edit the maps at the top:

```js
const META = {
  weddings: {
    title: "Weddings",
    category: "Weddings",
    blurb: "Vows, first dances, and the quiet glances nobody else noticed…",
  },
  // add your own:
  "bride-and-groom": {
    title: "Bride & Groom",
    category: "Weddings",
    blurb: "…",
  },
};

const ORDER = ["weddings", "people", "products", …];  // order on /portfolio
const FEATURED = ["people", "weddings", "products"];  // tiles on the home page
const MAX_PER_GALLERY = 0;                            // 0 = show all; or e.g. 24
```

Then run the generator again. If a folder has no entry in `META`, the script
derives a title from the folder name (`bride-and-groom` → "Bride And Groom") and
flags it in the console so you know to add a proper blurb.

---

## 4. Photos outside galleries

Portraits of Lincoln, the hero background and the About page image are
referenced directly in the page files:

| Where | File | What to change |
| ----- | ---- | -------------- |
| Home hero | `app/page.tsx` | `src="/images/banner_4.jpg"` |
| Home about teaser | `app/page.tsx` | `src="/images/lincoln-1.jpg"` |
| Home story panel | `app/page.tsx` | `src="/images/portrait_6.jpg"` |
| About banner | `app/about/page.tsx` | `src="/images/banner_4.jpg"` |
| About portrait | `app/about/page.tsx` | `src="/images/lincoln-2.jpg"` |
| Contact panel | `app/contact/page.tsx` | `src="/images/portrait_6.jpg"` |
| Social share image | `app/layout.tsx` | `images: [{ url: "/images/banner_4.jpg" … }]` |

Easiest approach: keep the same filenames and just replace the files. The new
image inherits every reference, and Vercel serves it from a one-year cache.

> If you replace a file but the old one still shows, it's your browser cache —
> hard-refresh (Ctrl/Cmd + Shift + R).

---

## 5. Before you upload: resize

Full-resolution camera files are 20–60 MB each and will make the site crawl.
Export for web instead:

* **Long edge:** 2000–2500 px is plenty (the site's max content width is 1600 px).
* **Format:** JPEG quality 78–85, or WebP if your editor offers it.
* **Colour:** sRGB.
* **Target:** roughly 300–700 KB per image.

Free options: [Squoosh](https://squoosh.app) (one at a time, in the browser),
Lightroom export presets, or `imagemagick` for a whole folder:

```bash
mkdir -p public/images/weddings
magick ~/exports/weddings/*.jpg -resize 2200x2200\> -quality 82 \
  -colorspace sRGB -strip public/images/weddings/
```

---

## 6. Ship it

```bash
npm run build     # sanity-check locally
git add -A
git commit -m "Add wedding + people galleries"
git push          # Vercel deploys automatically
```

That's the whole workflow: drop files in a folder → run the generator → push.

---

## Deleting the placeholder photos

The 26 images currently in `public/images/` came from the live Pixieset theme as
stand-ins. Once your own folders are in place:

```bash
rm public/images/*.jpg      # removes only the loose placeholder files
node scripts/make-gallery-config.mjs --write
```

Your folder-based galleries are untouched, and the loose-file references in step
4 will need new filenames — or name your replacements to match
(`banner_4.jpg`, `lincoln-1.jpg`, `lincoln-2.jpg`, `portrait_6.jpg`) and nothing
else changes.
