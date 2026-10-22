/**
 * GALLERIES — the single source of truth for the portfolio.
 *
 * To add a gallery: copy a block, change the slug/title/cover, and list images.
 * To swap in your own photos: drop files into /public/images/ and reference
 * them as "/images/your-file.jpg" (or use any absolute https:// URL).
 *
 * `ratio` drives the masonry layout: "tall" | "wide" | "square" | "banner".
 */

export type Ratio = "tall" | "wide" | "square" | "banner";

export type GalleryImage = {
  src: string;
  alt: string;
  ratio?: Ratio;
  /** exact width ÷ height, used to reserve layout space */
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

/**
 * Measured aspect ratios (width ÷ height) for every file in /public/images.
 * Read straight from the JPEG headers, so grids reserve exact space and
 * nothing shifts as images load.
 *
 * This table is written for you by:
 *     node scripts/make-gallery-config.mjs --write
 * once your photos live in /public/images/<gallery>/ folders.
 */
const AR: Record<string, number> = {
  "banner_1": 1.5,
  "banner_4": 1.5,
  "banner_5": 1.5,
  "gallery_1": 1.5,
  "gallery_2": 1.5,
  "horizontal_1": 1.5,
  "horizontal_10": 1.5,
  "horizontal_2": 1.5,
  "horizontal_3": 1.5,
  "horizontal_4": 1.5,
  "horizontal_6": 1.5,
  "horizontal_7": 1.5,
  "horizontal_8": 1.5,
  "lincoln-1": 0.8091,
  "lincoln-2": 0.75,
  "portrait_2": 0.6667,
  "portrait_4": 0.6667,
  "portrait_5": 0.6667,
  "portrait_6": 0.6667,
  "vertical_1": 0.6667,
  "vertical_2": 0.6667,
  "vertical_5": 0.6667,
  "vertical_6": 0.6667,
  "vertical_7": 0.6667,
  "vertical_8": 0.6667,
  "vertical_9": 0.6667,
};

const img = (name: string, ratio: Ratio, alt: string): GalleryImage => ({
  src: `/images/${name}.jpg`,
  alt,
  ratio,
  ar: AR[name],
});

export const galleries: Gallery[] = [
  {
    slug: "weddings",
    title: "Weddings",
    category: "Weddings",
    blurb:
      "Vows, first dances, and the quiet glances nobody else noticed. Full-day coverage that keeps the feeling of the day intact.",
    cover: img("horizontal_1", "wide", "Wedding couple portrait"),
    images: [
      img("horizontal_8", "wide", "Wedding ceremony moment"),
      img("vertical_7", "tall", "Bride portrait"),
      img("horizontal_10", "wide", "Wedding reception"),
      img("vertical_8", "tall", "Couple in golden light"),
      img("portrait_2", "tall", "Wedding detail"),
      img("horizontal_7", "wide", "Wedding party"),
      img("banner_1", "banner", "Wedding venue panorama"),
      img("horizontal_6", "wide", "Couple portrait"),
      img("horizontal_2", "wide", "Wedding celebration"),
    ],
  },
  {
    slug: "people",
    title: "People",
    category: "Portraits",
    blurb:
      "Portraits of people as they actually are — relaxed, confident and unforced. Studio sessions, outdoor light and lifestyle frames.",
    cover: img("banner_5", "banner", "Portrait session"),
    images: [
      img("portrait_5", "tall", "Portrait session"),
      img("vertical_1", "tall", "Outdoor portrait"),
      img("horizontal_4", "wide", "Lifestyle portrait"),
      img("vertical_2", "tall", "Studio portrait"),
      img("portrait_6", "tall", "Environmental portrait"),
      img("horizontal_3", "wide", "Natural light portrait"),
      img("vertical_5", "tall", "Portrait detail"),
      img("horizontal_2", "wide", "Group portrait"),
    ],
  },
  {
    slug: "products",
    title: "Products",
    category: "Brand & Product",
    blurb:
      "Clean, consistent product and brand imagery built for e-commerce, packaging and social campaigns.",
    cover: img("gallery_2", "wide", "Product photography"),
    images: [
      img("gallery_1", "wide", "Product still life"),
      img("horizontal_6", "wide", "Brand flat lay"),
      img("vertical_9", "tall", "Product detail"),
      img("horizontal_10", "wide", "Packaging shot"),
      img("portrait_4", "tall", "Product in use"),
      img("horizontal_1", "wide", "Brand campaign image"),
    ],
  },
  {
    slug: "graduation",
    title: "Graduation",
    category: "Graduations",
    blurb:
      "Caps, gowns and the people who got you there. Graduation sessions shot on campus and outdoors.",
    cover: img("gallery_1", "wide", "Graduation portrait"),
    images: [
      img("vertical_6", "tall", "Graduation portrait"),
      img("horizontal_7", "wide", "Graduation celebration"),
      img("portrait_2", "tall", "Graduate with family"),
      img("horizontal_8", "wide", "Campus session"),
      img("vertical_7", "tall", "Graduation detail"),
      img("horizontal_4", "wide", "Graduation group shot"),
    ],
  },
  {
    slug: "events",
    title: "Events",
    category: "Events",
    blurb:
      "Corporate gatherings, birthdays, launches and cultural events — documented so you can relive and reuse them.",
    cover: img("horizontal_3", "wide", "Event coverage"),
    images: [
      img("horizontal_2", "wide", "Conference coverage"),
      img("vertical_8", "tall", "Event speaker"),
      img("banner_1", "banner", "Event venue panorama"),
      img("horizontal_6", "wide", "Guests at an event"),
      img("vertical_5", "tall", "Event detail"),
      img("horizontal_10", "wide", "Celebration moment"),
    ],
  },
  {
    slug: "outdoor",
    title: "Outdoor Shots",
    category: "Lifestyle",
    blurb:
      "Location sessions that use the landscape — riverside, forest and open field light around Akosombo and beyond.",
    cover: img("horizontal_8", "wide", "Outdoor lifestyle session"),
    images: [
      img("vertical_9", "tall", "Outdoor lifestyle portrait"),
      img("horizontal_4", "wide", "Golden hour session"),
      img("portrait_5", "tall", "Lifestyle frame"),
      img("horizontal_1", "wide", "Location shoot"),
      img("vertical_1", "tall", "Outdoor portrait"),
      img("horizontal_3", "wide", "Landscape session"),
    ],
  },
  {
    slug: "studio",
    title: "Studio Shots",
    category: "Studio",
    blurb:
      "Controlled light, clean backgrounds and precise direction — headshots, editorial and brand portraits in studio.",
    cover: img("portrait_6", "tall", "Studio portrait"),
    images: [
      img("vertical_2", "tall", "Studio portrait"),
      img("horizontal_7", "wide", "Studio session"),
      img("portrait_4", "tall", "Studio headshot"),
      img("horizontal_6", "wide", "Editorial studio frame"),
      img("vertical_6", "tall", "Studio lighting setup"),
      img("horizontal_2", "wide", "Studio group portrait"),
    ],
  },
];

export const galleryBySlug = (slug: string) =>
  galleries.find((g) => g.slug === slug);

/** Images used by the infinite scrolling strips on the home + contact pages. */
export const marqueeA = [
  img("vertical_1", "tall", "Portfolio frame"),
  img("vertical_2", "tall", "Portfolio frame"),
  img("portrait_2", "tall", "Portfolio frame"),
  img("vertical_5", "tall", "Portfolio frame"),
  img("portrait_5", "tall", "Portfolio frame"),
];

export const marqueeB = [
  img("vertical_6", "tall", "Portfolio frame"),
  img("vertical_9", "tall", "Portfolio frame"),
  img("portrait_4", "tall", "Portfolio frame"),
];

/** Featured tiles on the home page. */
export const featured = ["people", "weddings", "products"]
  .map((slug) => galleryBySlug(slug))
  .filter((g): g is Gallery => Boolean(g));
