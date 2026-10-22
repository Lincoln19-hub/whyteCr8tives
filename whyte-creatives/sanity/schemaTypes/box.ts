import { defineType } from "sanity";

/**
 * A rectangle on the Flex grid, in square cells, 1-based.
 *
 * This mirrors the geometry Pixieset stores for every element:
 *   --top / --left / --width / --height
 * with 26 columns on desktop and tablet, 10 on mobile.
 */
export const box = defineType({
  name: "box",
  title: "Position & size",
  type: "object",
  fields: [
    {
      name: "top",
      title: "Top (row)",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
      description: "1-based row the element starts on.",
    },
    {
      name: "left",
      title: "Left (column)",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
      description: "1-based column the element starts on.",
    },
    {
      name: "width",
      title: "Width (columns)",
      type: "number",
      initialValue: 8,
      validation: (Rule) => Rule.required().integer().min(1),
      description: "How many columns wide.",
    },
    {
      name: "height",
      title: "Height (rows)",
      type: "number",
      initialValue: 4,
      validation: (Rule) => Rule.required().integer().min(1),
      description: "How many rows tall.",
    },
  ],
});
