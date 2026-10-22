/**
 * SITE CONFIG — real values taken from thewhytecreatives.mypixieset.com
 * Edit here to change copy, links and contact details. Nothing else needs touching.
 */

export const site = {
  name: "WHYTE CREATIVES",
  shortName: "whyteCreatives",
  owner: "Lincoln Richmond Whyte",
  tagline: "Creative Visuals. Timeless Stories.",
  /** the services line that sits under the footer heading */
  servicesLine: "WEDDING / CORPORATE / Portraits / LIFESTYLE / Events & More",
  description:
    "whyteCreatives is a professional photography brand based in Akosombo, Ghana, dedicated to capturing timeless moments with creativity and precision.",
  url: "https://whytecreatives.vercel.app", // swap for your custom domain
  locale: "en_GH",

  /* ---- real contact details from the site footer ---- */
  email: "whytecobby@gmail.com",
  phone: "+233 (020) 483 8207",
  phoneHref: "+233204838207",
  address: ["New Combine, Akosombo", "Ghana"],
  location: "Akosombo, Ghana",

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/whyte.creatives/" },
    { label: "TikTok", href: "https://tiktok.com/@whyte.creatives" },
  ],

  copyright: "© 2026 WHYTE CREATIVES",
} as const;

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

/**
 * The real navigation, including the two dropdowns.
 * "Services & Ratecards" is a folder (no page of its own) — exactly as on the
 * original, where clicking it only opens the submenu.
 */
export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services & Ratecards",
    children: [
      { label: "Weddings", href: "/wedding" },
      { label: "Events", href: "/events" },
      { label: "Corporate Photography", href: "/corporate-photography" },
      { label: "Studio Portrait", href: "/studio-portrait" },
      { label: "Outdoor Portrait", href: "/outdoor-portrait" },
      { label: "Graduate with Whyte", href: "/graduation" },
      { label: "Lifestyle Photography", href: "/lifestyle-photography" },
    ],
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "Weddings", href: "/gallery-1" },
      { label: "Events", href: "/gallery-2" },
      { label: "Portrait", href: "/gallery-4" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Flat list for the sitemap, footer and mobile menu. */
export const allPages: NavChild[] = nav.flatMap((item) =>
  item.children
    ? [
        ...(item.href ? [{ label: item.label, href: item.href }] : []),
        ...item.children,
      ]
    : [{ label: item.label, href: item.href! }]
);

export const values = [
  { title: "Creativity", body: "Bringing originality and artistry into every shot." },
  { title: "Professionalism", body: "Upholding high standards in service, communication, and delivery." },
  { title: "Passion", body: "Capturing every moment with dedication and love for the craft." },
  { title: "Integrity", body: "Building trust through honesty, transparency, and reliability." },
  { title: "Excellence", body: "Consistently striving for the highest quality in all we do." },
  { title: "Customer-Centric", body: "Putting clients' stories, experiences, and satisfaction first." },
] as const;

export const process = [
  {
    step: "1",
    title: "We connect and plan the project",
    body: "At Whyte Creatives, we approach every project with dedication, creativity, and attention to detail. Our commitment is to provide more than just images and videos — we strive to create meaningful visuals that you can treasure, share, and use with confidence.",
  },
  {
    step: "2",
    title: "On the session day",
    body: "We arrive early, read the light and settle you in. Whether it's a wedding, a graduation or a brand shoot, the day runs on a calm, unhurried rhythm — direction when you want it, space when you don't. You focus on living the moment; we focus on catching it.",
  },
  {
    step: "3",
    title: "Editing and delivery",
    body: "Every frame is hand-edited for colour, contrast and mood, then delivered in a private online gallery you can view, share and download from. Selects land in 48–72 hours and final galleries within 5–10 business days depending on the package.",
  },
] as const;

/**
 * The two ratecard packages shared by every service page.
 * Copied verbatim from the original site.
 *
 * NOTE: on the live site, Package One reads "from $1200" on six service pages
 * but "from ₵300" on /studio-portrait, and Package Two is "$1600" everywhere.
 * The ₵300 looks like an unfinished edit. We normalise to $1200 here — set
 * `packageOnePrice` per service in data/services.ts if you want it different.
 */
export const packages = [
  {
    name: "Package One",
    price: "from $1200",
    image: "/images/gallery_3.jpg",
    features: [
      "Up to 2 hours on location or in studio",
      "40–80 edited photos (web-ready + print-ready)",
      '2 archival prints (up to 11×14")',
      "2 min BTS video (vertical or horizontal)",
      "Includes: pre-shoot call, light retouch on finals, online gallery, standard web/social usage (1 year)",
      "Turnaround: selects in 48–72h, finals in 5 business days",
    ],
  },
  {
    name: "Package Two",
    price: "from $1600",
    image: "/images/banner_3.jpg",
    features: [
      "Up to 6 hours (split sets or locations)",
      "100–160 edited photos (toolkit for web, print, paid social, OOH-ready crops)",
      "6 archival prints (mix of sizes)",
      "3–5 min BTS video + cutdowns for social",
      "Includes: creative deck (mood + shot map), producer support, talent direction, product styling, enhanced retouch on hero images, expanded usage (up to 2 years)",
      "Turnaround: selects in 48h, staged finals over 5–10 business days",
    ],
  },
] as const;

/** The three tiles under the hero heading on the home page. */
export const homeTiles = [
  { label: "Brand shots", href: "/gallery-4", image: "/images/horizontal_1.jpg" },
  { label: "People", href: "/gallery-1", image: "/images/banner_5.jpg" },
  { label: "Products", href: "/gallery-2", image: "/images/gallery_2.jpg" },
] as const;
