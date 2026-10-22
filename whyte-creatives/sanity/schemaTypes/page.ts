import { defineField, defineType } from "sanity";

/**
 * A page = SEO settings + an ordered list of blocks.
 *
 * `slug` is the live URL. The home page uses "/", service pages use their
 * real paths ("/wedding", "/studio-portrait", …), galleries use
 * "/gallery-1" etc.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: () => "▤",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      description: "Shown in the Studio and used as the browser tab title.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((v) => {
          const slug = (v as { current?: string } | undefined)?.current ?? "";
          if (!slug.startsWith("/"))
            return 'Must start with "/" — e.g. /wedding';
          if (slug.length > 1 && slug.endsWith("/"))
            return 'Must not end with "/" (except the home page)';
          return true;
        }),
      description:
        'Must start with "/". The home page is exactly "/". Changing this changes the live URL.',
    }),

    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
      description:
        "Each block is a section. Reorder them here; edit their layout inside.",
    }),

    /* ---- SEO ---- */

    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      group: "seo",
      rows: 3,
      validation: (Rule) => Rule.max(160),
      description: "Shown in search results. Aim for 120–160 characters.",
    }),

    defineField({
      name: "ogImage",
      title: "Share image",
      type: "image",
      group: "seo",
      description: "Used when the page is shared on social media.",
    }),

    defineField({
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      group: "seo",
      initialValue: false,
      description: "Turn on for pages you don't want in Google.",
    }),
  ],

  preview: {
    select: { title: "title", subtitle: "slug.current", media: "ogImage" },
    prepare({ title, subtitle }) {
      return {
        title: title ?? "Untitled page",
        subtitle: subtitle ?? "— no URL set —",
      };
    },
  },

  orderings: [
    { name: "slugAsc", title: "URL A→Z", by: [{ field: "slug.current", direction: "asc" }] },
    { name: "titleAsc", title: "Title A→Z", by: [{ field: "title", direction: "asc" }] },
  ],
});
