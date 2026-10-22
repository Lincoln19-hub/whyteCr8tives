import { defineField, defineType } from "sanity";

/**
 * One singleton document holding everything that appears site-wide:
 * contact details, socials, navigation (including the two dropdowns) and the
 * ratecard packages shared by all service pages.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: () => "⚙",
  groups: [
    { name: "identity", title: "Brand", default: true },
    { name: "contact", title: "Contact & socials" },
    { name: "nav", title: "Navigation" },
    { name: "packages", title: "Ratecard packages" },
  ],
  fields: [
    /* ---- identity ---- */
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "identity",
      initialValue: "WHYTE CREATIVES",
    }),
    defineField({
      name: "shortName",
      title: "Short name (for titles/meta)",
      type: "string",
      group: "identity",
      initialValue: "whyteCreatives",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "identity",
      initialValue: "Creative Visuals. Timeless Stories.",
    }),
    defineField({
      name: "servicesLine",
      title: "Services line (footer)",
      type: "string",
      group: "identity",
      initialValue: "WEDDING / CORPORATE / Portraits / LIFESTYLE / Events & More",
    }),
    defineField({
      name: "copyright",
      title: "Copyright line",
      type: "string",
      group: "identity",
      initialValue: "© 2026 WHYTE CREATIVES",
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      group: "identity",
      description:
        "Your live domain, e.g. https://whytecreatives.com — used for canonical links, the sitemap and social sharing.",
    }),

    /* ---- contact ---- */
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({
      name: "phone",
      title: "Phone (displayed)",
      type: "string",
      group: "contact",
      description: "Shown as written, e.g. +233 (020) 483 8207",
    }),
    defineField({
      name: "phoneHref",
      title: "Phone (dialable)",
      type: "string",
      group: "contact",
      description: "Digits only with country code, e.g. +233204838207",
    }),
    defineField({
      name: "addressLine1",
      title: "Address line 1",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "addressLine2",
      title: "Address line 2",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          name: "social",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "url", title: "URL" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),

    /* ---- navigation ---- */
    defineField({
      name: "nav",
      title: "Main navigation",
      type: "array",
      group: "nav",
      description:
        "Items with children become dropdowns. Leave “Links to” empty to make an item a folder that only opens its dropdown (like “Services & Ratecards”).",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            { name: "label", type: "string", title: "Label" },
            {
              name: "href",
              type: "string",
              title: "Links to",
              description: "Optional. Empty = dropdown folder only.",
            },
            {
              name: "children",
              type: "array",
              title: "Dropdown items",
              of: [
                {
                  type: "object",
                  name: "navChild",
                  fields: [
                    { name: "label", type: "string", title: "Label" },
                    { name: "href", type: "string", title: "Links to" },
                  ],
                  preview: { select: { title: "label", subtitle: "href" } },
                },
              ],
            },
          ],
          preview: {
            select: { title: "label", subtitle: "href", children: "children" },
            prepare({ title, subtitle, children }) {
              const n = Array.isArray(children) ? children.length : 0;
              return {
                title: title ?? "Untitled",
                subtitle: n ? `${subtitle ?? "folder"} · ${n} dropdown item${n === 1 ? "" : "s"}` : subtitle,
              };
            },
          },
        },
      ],
    }),

    /* ---- ratecards ---- */
    defineField({
      name: "packages",
      title: "Ratecard packages",
      type: "array",
      group: "packages",
      description:
        "Shared by every service page. Add a third package here and it appears on all of them.",
      of: [
        {
          type: "object",
          name: "package",
          fields: [
            { name: "name", type: "string", title: "Package name" },
            { name: "price", type: "string", title: "Price label", description: 'e.g. "from $1200"' },
            { name: "image", type: "image", title: "Image", options: { hotspot: true } },
            {
              name: "features",
              type: "array",
              title: "What's included",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { title: "name", subtitle: "price", media: "image" },
          },
        },
      ],
    }),
  ],

  preview: {
    select: { title: "siteName", subtitle: "email" },
    prepare({ title }) {
      return { title: title ?? "Site settings", subtitle: "Brand, contact, nav, ratecards" };
    },
  },
});
