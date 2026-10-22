/**
 * SERVICE PAGES — the seven pages behind the "Services & Ratecards" dropdown.
 * All copy is taken from the live site. Every page shares one template:
 *
 *   hero (title + intro + two images)
 *   → Package One  → Package Two
 *   → Latest Work  → About me  → Contact me  → Portfolio
 *
 * The "Latest Work" strip, the About/Contact/Portfolio blocks and the footer
 * are identical across all seven, so they live here once.
 */

export type Service = {
  slug: string;
  /** nav label */
  navLabel: string;
  /** H1 lines — the original splits long titles across two H1s */
  titleLines: string[];
  /** <title> tag on the original */
  pageTitle: string;
  intro: string;
  /** images beside the intro */
  heroImages: string[];
  /** override a package price, e.g. the ₵300 on /studio-portrait */
  priceOverrides?: { one?: string; two?: string };
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "wedding",
    navLabel: "Weddings",
    titleLines: ["Wedding Photography & Videography"],
    pageTitle: "Wedding & Engagement",
    intro:
      "Your love story deserves to be remembered beautifully. We capture the emotions, details, and unforgettable moments of your special day, creating timeless photographs and cinematic films that let you relive every memory for years to come.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    metaDescription:
      "Wedding photography and videography in Akosombo and across Ghana — timeless photographs and cinematic films that let you relive every memory.",
  },
  {
    slug: "events",
    navLabel: "Events",
    titleLines: ["Events", "Photography"],
    pageTitle: "Events",
    intro:
      "Every event has a story worth telling. We document the highlights, candid moments, atmosphere, and important details of birthdays, engagements, celebrations, and corporate gatherings — so the day stays with you long after it ends.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    metaDescription:
      "Event photography across Ghana — birthdays, engagements, celebrations and corporate gatherings documented with candour and detail.",
  },
  {
    slug: "corporate-photography",
    navLabel: "Corporate Photography",
    titleLines: ["Corporate Photography"],
    pageTitle: "Corporate Photography",
    intro:
      "Present your business with confidence through professional visuals that communicate your brand's identity. From corporate portraits and team photography to workplace imagery and brand storytelling, we deliver a consistent, polished look across every frame.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    metaDescription:
      "Corporate photography for brands and teams — headshots, workplace imagery and brand storytelling with a consistent, polished finish.",
  },
  {
    slug: "studio-portrait",
    navLabel: "Studio Portrait",
    titleLines: ["Studio", "Portrait"],
    pageTitle: "Studio Portrait",
    intro:
      "Step into a controlled creative space where lighting, backgrounds, and composition work together to create polished portraits. From personal portraits and professional headshots to creative and fashion-inspired sessions, we deliver images with a refined, professional finish.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    /* The live site shows "from ₵300" here while every other service page
       shows "from $1200". Kept as an override so it's easy to confirm with
       Lincoln and change in one place. */
    priceOverrides: { one: "from ₵300" },
    metaDescription:
      "Studio portrait sessions — personal portraits, professional headshots and fashion-inspired work with controlled light and a refined finish.",
  },
  {
    slug: "outdoor-portrait",
    navLabel: "Outdoor Portrait",
    titleLines: ["Outdoor", "Portrait"],
    pageTitle: "Outdoor Portrait",
    intro:
      "Natural light, beautiful locations, and authentic expressions come together to create stunning outdoor portraits. Whether it's an individual session, a couple's shoot, or a creative concept, we make every frame reflect your personality.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    metaDescription:
      "Outdoor portrait sessions in natural light — individual, couple and concept shoots around Akosombo and beyond.",
  },
  {
    slug: "graduation",
    navLabel: "Graduate with Whyte",
    titleLines: ["Graduate with", "Whyte"],
    pageTitle: "Graduate with Whyte",
    intro:
      "Celebrate your hard work and achievement with photographs worth remembering. We capture your graduation portraits, academic regalia, proud family moments, and memorable celebrations, preserving this important milestone in your life.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    metaDescription:
      "Graduation photography — portraits, academic regalia, proud family moments and celebrations worth remembering.",
  },
  {
    slug: "lifestyle-photography",
    navLabel: "Lifestyle Photography",
    titleLines: ["Lifestyle Photography"],
    pageTitle: "Lifestyle Photography",
    intro:
      "Real moments. Genuine emotions. Your story. Our lifestyle photography captures natural interactions, everyday experiences, personal milestones, and meaningful connections in a relaxed, authentic style. The result is imagery that feels like you.",
    heroImages: ["/images/horizontal_5.jpg", "/images/horizontal_6.jpg"],
    metaDescription:
      "Lifestyle photography — natural interactions, everyday experiences and meaningful connections in a relaxed, authentic style.",
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

/** Shared across every service page. */
export const serviceShared = {
  latestWork: {
    heading: "Latest Work",
    link: { label: "View full portfolio", href: "/portfolio" },
    images: [
      "/images/vertical_6.jpg",
      "/images/vertical_5.jpg",
      "/images/vertical_3.jpg",
      "/images/vertical_8.jpg",
    ],
  },
  aboutMe: {
    heading: "About me",
    link: { label: "Learn more about me", href: "/about" },
    image: "/images/lincoln-1.jpg",
  },
  contactMe: {
    heading: "Contact me",
    link: { label: "LEt's connect", href: "/contact" },
    image: "/images/portrait_6.jpg",
  },
  portfolio: {
    heading: "Portfolio",
    link: { label: "view my recent works", href: "/portfolio" },
    image: "/images/horizontal_7.jpg",
  },
} as const;

/**
 * The three portfolio galleries behind the "Portfolio" dropdown.
 * The original uses /gallery-1, /gallery-2 and /gallery-4 (there is no 3).
 */
export const portfolioGalleries = [
  {
    slug: "gallery-1",
    title: "Weddings",
    images: [
      "/images/horizontal_8.jpg",
      "/images/vertical_7.jpg",
      "/images/horizontal_10.jpg",
      "/images/vertical_8.jpg",
      "/images/portrait_2.jpg",
      "/images/horizontal_7.jpg",
      "/images/banner_1.jpg",
      "/images/horizontal_6.jpg",
      "/images/horizontal_2.jpg",
    ],
  },
  {
    slug: "gallery-2",
    title: "Events",
    images: [
      "/images/horizontal_5.jpg",
      "/images/vertical_5.jpg",
      "/images/horizontal_1.jpg",
      "/images/vertical_3.jpg",
      "/images/vertical_4.jpg",
      "/images/gallery_1.jpg",
      "/images/gallery_3.jpg",
      "/images/banner_2.jpg",
      "/images/gallery_2.jpg",
    ],
  },
  {
    slug: "gallery-4",
    title: "Portrait",
    images: [
      "/images/horizontal_4.jpg",
      "/images/vertical_1.jpg",
      "/images/gallery_7.jpg",
      "/images/vertical_3.jpg",
      "/images/vertical_4.jpg",
      "/images/horizontal_3.jpg",
      "/images/gallery_4.jpg",
      "/images/gallery_5.jpg",
      "/images/gallery_6.jpg",
    ],
  },
] as const;

/** The six tiles on /portfolio, with their real captions and targets. */
export const portfolioTiles = [
  { caption: "weddings", href: "/gallery-1", image: "/images/horizontal_1.jpg" },
  { caption: "corporates", href: "/gallery-1", image: "/images/banner_5.jpg" },
  { caption: "graduation", href: "/gallery-2", image: "/images/gallery_2.jpg" },
  { caption: "events", href: "/gallery-2", image: "/images/gallery_1.jpg" },
  { caption: "outdoor shots", href: "/gallery-4", image: "/images/horizontal_8.jpg" },
  { caption: "Studio shots", href: "/gallery-4", image: "/images/horizontal_3.jpg" },
] as const;
