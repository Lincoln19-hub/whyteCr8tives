import { defineField, defineType } from "sanity";

/**
 * One element on the grid — a heading, paragraph, image, button, carousel,
 * list, price or card. Each carries its content AND its box at all three
 * breakpoints, exactly like Pixieset's `.fb-element` rules.
 *
 * The geometry is edited visually by the FlexCanvas input (see
 * sanity/components/FlexCanvas.tsx) rather than by typing 24 numbers.
 */

export const element = defineType({
  name: "element",
  title: "Element",
  type: "object",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "geometry", title: "Position & size" },
  ],
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      group: "content",
      initialValue: "heading",
      options: {
        list: [
          { title: "Heading", value: "heading" },
          { title: "Paragraph", value: "paragraph" },
          { title: "Eyebrow (small uppercase label)", value: "eyebrow" },
          { title: "Subtitle (uppercase)", value: "subtitle" },
          { title: "Image", value: "image" },
          { title: "Button / link", value: "button" },
          { title: "Text link (underlined)", value: "textlink" },
          { title: "Feature list (bullet lines)", value: "list" },
          { title: "Price", value: "price" },
          { title: "Image carousel", value: "carousel" },
          { title: "Card (image + heading + link)", value: "card" },
          { title: "Contact form", value: "form" },
          { title: "Spacer (empty)", value: "spacer" },
        ],
      },
      description: "What this element renders as.",
    }),

    /* ---------------- content ---------------- */

    defineField({
      name: "text",
      title: "Text",
      type: "text",
      group: "content",
      rows: 3,
      description:
        "For headings: use a blank line between lines you want broken. For lists: one item per line.",
      hidden: ({ parent }) =>
        ["image", "carousel", "form", "spacer"].includes(parent?.kind),
    }),

    defineField({
      name: "level",
      title: "Heading size",
      type: "string",
      group: "content",
      initialValue: "h2",
      options: {
        list: [
          { title: "Display (largest, 5.375rem)", value: "display" },
          { title: "H1 (4rem)", value: "h1" },
          { title: "H2 (3.25rem)", value: "h2" },
          { title: "H3 (2.125rem)", value: "h3" },
          { title: "H4 (1.75rem)", value: "h4" },
          { title: "H5 — small uppercase (0.875rem)", value: "h5" },
          { title: "H6 — card title (0.75rem)", value: "h6" },
        ],
      },
      hidden: ({ parent }) => parent?.kind !== "heading",
    }),

    defineField({
      name: "paragraphStyle",
      title: "Text size",
      type: "string",
      group: "content",
      initialValue: "p1",
      options: {
        list: [
          { title: "Lead (larger intro)", value: "lead" },
          { title: "Paragraph 1 (body, 0.9375rem)", value: "p1" },
          { title: "Paragraph 2 (smaller, 0.8125rem)", value: "p2" },
          { title: "Paragraph 3 (smallest, 0.75rem)", value: "p3" },
        ],
      },
      hidden: ({ parent }) => parent?.kind !== "paragraph",
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      hidden: ({ parent }) =>
        !["image", "card", "carousel"].includes(parent?.kind),
    }),

    defineField({
      name: "carouselImages",
      title: "Carousel images",
      type: "array",
      group: "content",
      of: [{ type: "image" }],
      hidden: ({ parent }) => parent?.kind !== "carousel",
    }),

    defineField({
      name: "src",
      title: "…or an image already on the site",
      type: "string",
      group: "content",
      description:
        "Path to a file in /public, e.g. /images/horizontal_1.jpg. Use this for " +
        "the photographs the site already ships with. If both this and Image " +
        "are filled in, the uploaded Image wins.",
      hidden: ({ parent }) =>
        !["image", "card", "carousel"].includes(parent?.kind),
    }),

    defineField({
      name: "carouselSrc",
      title: "…or existing site images (one path per line)",
      type: "text",
      group: "content",
      rows: 4,
      description:
        "One /images/….jpg path per line. Used when the Carousel images list " +
        "above is empty.",
      hidden: ({ parent }) => parent?.kind !== "carousel",
    }),

    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      group: "content",
      description: "Describes the image for screen readers and search.",
      hidden: ({ parent }) => !["image", "card"].includes(parent?.kind),
    }),

    defineField({
      name: "linkText",
      title: "Link text",
      type: "string",
      group: "content",
      hidden: ({ parent }) =>
        !["button", "textlink", "card"].includes(parent?.kind),
    }),

    defineField({
      name: "href",
      title: "Links to",
      type: "string",
      group: "content",
      description:
        "Internal path like /wedding, or a full URL like https://instagram.com/…",
      hidden: ({ parent }) =>
        !["button", "textlink", "card", "image"].includes(parent?.kind),
    }),

    defineField({
      name: "buttonStyle",
      title: "Button style",
      type: "string",
      group: "content",
      initialValue: "solid",
      options: {
        list: [
          { title: "Solid (dark)", value: "solid" },
          { title: "Ghost (outlined)", value: "ghost" },
          { title: "Light (for dark backgrounds)", value: "light" },
        ],
      },
      hidden: ({ parent }) => parent?.kind !== "button",
    }),

    /* ---------------- alignment ---------------- */

    defineField({
      name: "align",
      title: "Text alignment",
      type: "string",
      group: "content",
      initialValue: "left",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
          { title: "Right on desktop, left on mobile", value: "desktop-right" },
        ],
      },
      hidden: ({ parent }) =>
        ["image", "carousel", "form", "spacer"].includes(parent?.kind),
    }),

    defineField({
      name: "valign",
      title: "Vertical alignment",
      type: "string",
      group: "content",
      initialValue: "top",
      options: {
        list: [
          { title: "Top", value: "top" },
          { title: "Center", value: "center" },
          { title: "Bottom", value: "bottom" },
        ],
      },
      hidden: ({ parent }) => ["carousel", "spacer"].includes(parent?.kind),
    }),

    /* ---------------- geometry ----------------
       Edited visually by the FlexCanvas component; these fields stay
       available for exact numbers and as the source of truth. */

    defineField({
      name: "boxDesktop",
      title: "Desktop (26 columns)",
      type: "box",
      group: "geometry",
    }),
    defineField({
      name: "boxTablet",
      title: "Tablet (26 columns)",
      type: "box",
      group: "geometry",
    }),
    defineField({
      name: "boxMobile",
      title: "Mobile (10 columns)",
      type: "box",
      group: "geometry",
    }),

    defineField({
      name: "zIndex",
      title: "Layer",
      type: "number",
      group: "geometry",
      initialValue: 0,
      description:
        "Higher layers sit on top. Use this to overlap an element on an image.",
    }),
  ],
});
