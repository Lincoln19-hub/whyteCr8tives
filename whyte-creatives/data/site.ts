/**
 * SITE CONFIG — edit this file to change copy, links and contact details.
 * No code changes needed anywhere else.
 */

export const site = {
  name: "WHYTE CREATIVES",
  shortName: "whyteCreatives",
  owner: "Lincoln Richmond Whyte",
  tagline: "Creative Visuals. Timeless Stories.",
  description:
    "whyteCreatives is a professional photography and videography brand based in Akosombo, Ghana — portraits, weddings, graduations, events, corporate and lifestyle visuals.",
  url: "https://whytecreatives.vercel.app", // swap for your custom domain later
  locale: "en_GH",
  location: "Akosombo, Ghana",
  email: "hello@whytecreatives.com",
  phone: "+233 00 000 0000",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const values = [
  {
    title: "Creativity",
    body: "Bringing originality and artistry into every shot.",
  },
  {
    title: "Professionalism",
    body: "Upholding high standards in service, communication, and delivery.",
  },
  {
    title: "Passion",
    body: "Capturing every moment with dedication and love for the craft.",
  },
  {
    title: "Integrity",
    body: "Building trust through honesty, transparency, and reliability.",
  },
  {
    title: "Excellence",
    body: "Consistently striving for the highest quality in all we do.",
  },
  {
    title: "Customer-Centric",
    body: "Putting clients' stories, experiences, and satisfaction first.",
  },
] as const;

export const process = [
  {
    step: "01",
    title: "We connect and plan the project",
    body: "At Whyte Creatives, we approach every project with dedication, creativity, and attention to detail. Our commitment is to provide more than just images and videos — we strive to create meaningful visuals that you can treasure, share, and use with confidence. Let's bring your vision to life.",
  },
  {
    step: "02",
    title: "On the session day",
    body: "We arrive early, scout the light and settle you in. Whether it's a wedding, a graduation or a brand shoot, the day runs on a calm, unhurried rhythm — direction when you want it, space when you don't. You focus on living the moment; we focus on catching it.",
  },
  {
    step: "03",
    title: "Editing and delivery",
    body: "Every frame is hand-edited for colour, contrast and mood, then delivered in a private online gallery you can view, share and download from. Previews land within 48 hours, full galleries within 7–14 days depending on the project.",
  },
] as const;

export const services = [
  { title: "Portraits", body: "Studio and outdoor portraiture with intentional light." },
  { title: "Weddings", body: "Full-day coverage of the ceremony, reception and everything between." },
  { title: "Graduations", body: "Celebration shoots that mark the milestone properly." },
  { title: "Events", body: "Corporate, social and cultural events, documented end to end." },
  { title: "Brand & Product", body: "Clean, consistent visuals for products and brand identity." },
  { title: "Videography", body: "Short films, highlights and content built for social." },
] as const;
