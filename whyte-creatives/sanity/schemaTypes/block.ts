import { defineField, defineType } from "sanity";
import FlexCanvas from "../components/FlexCanvas";

/**
 * A block = one section of a page. Pixieset calls these "block containers".
 *
 * A block declares how many ROWS it has at each breakpoint; the column count
 * is fixed site-wide (26 desktop/tablet, 10 mobile). Because the cells are
 * square, the block's height follows from columns ÷ rows.
 */
export const block = defineType({
  name: "block",
  title: "Block (section)",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Block name",
      type: "string",
      description: "Internal label — not shown on the site. e.g. “Hero”, “Packages”.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "rowsDesktop",
      title: "Rows — desktop",
      type: "number",
      initialValue: 12,
      validation: (Rule) => Rule.required().integer().min(1).max(80),
      description: "Desktop and tablet both use 26 columns.",
    }),
    defineField({
      name: "rowsTablet",
      title: "Rows — tablet",
      type: "number",
      initialValue: 16,
      validation: (Rule) => Rule.required().integer().min(1).max(120),
    }),
    defineField({
      name: "rowsMobile",
      title: "Rows — mobile",
      type: "number",
      initialValue: 24,
      validation: (Rule) => Rule.required().integer().min(1).max(160),
    }),

    defineField({
      name: "padTop",
      title: "Padding above",
      type: "number",
      initialValue: 1,
      description:
        "Multiplier of the site's base rhythm. 0.2 is tight, 1 is normal, 1.5 is airy.",
      validation: (Rule) => Rule.min(0).max(4),
    }),
    defineField({
      name: "padBottom",
      title: "Padding below",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).max(4),
    }),

    defineField({
      name: "background",
      title: "Background",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary (#F5F8FD)", value: "primary" },
          { title: "Alt (#DDE4EB)", value: "alt" },
          { title: "White", value: "surface" },
          { title: "Dark (#222426)", value: "dark" },
          { title: "Transparent", value: "transparent" },
        ],
      },
    }),

    defineField({
      name: "elements",
      title: "Elements",
      type: "array",
      of: [{ type: "element" }],
      description:
        "Drag elements around the grid, or use the Position fields for exact numbers.",
      components: { input: FlexCanvas },
    }),
  ],
});
