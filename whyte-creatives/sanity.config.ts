import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

/**
 * Sanity Studio configuration.
 *
 * Project id / dataset come from environment variables:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *
 * Run `npx sanity init` once to create a free Sanity project and write those
 * values into .env.local (and into Vercel → Settings → Environment Variables).
 * Until they are set, the placeholder below keeps `next build` green — the
 * Studio page will simply ask you to log in / show a config error, and the
 * public site is unaffected because it falls back to the bundled content in
 * data/site.ts + data/services.ts.
 *
 * See docs/VISUAL-EDITOR.md for the full setup walkthrough.
 */

// Placeholder id: a syntactically valid (lowercase alphanumeric) Sanity-style
// project id so defineConfig() validation passes at build time.
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "whytecreativ";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityProjectId = PROJECT_ID;
export const sanityDataset = DATASET;

export default defineConfig({
  name: "default",
  title: "whyteCreatives — Visual Editor",

  projectId: PROJECT_ID,
  dataset: DATASET,

  // MUST match the route folder: app/studio/[[...tool]]/page.tsx.
  // If these disagree, every Studio sidebar click 404s.
  basePath: "/studio",

  apiVersion: "2026-01-01",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Pages are the thing editors care about — surface them first, and don't
    // offer "block" / "element" / "box" as standalone documents (they only
    // ever exist inside a page).
    newDocumentOptions: (prev) =>
      prev
        .filter(
          (o) => !["block", "element", "box"].includes(o.templateId as string)
        )
        .sort((a, b) =>
          a.templateId === "page" ? -1 : b.templateId === "page" ? 1 : 0
        ),
  },
});
