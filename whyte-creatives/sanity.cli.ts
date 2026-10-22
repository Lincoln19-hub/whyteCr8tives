import { defineCliConfig } from "sanity/cli";

/**
 * Sanity CLI config — used by `npx sanity init`, `npx sanity build`,
 * `npx sanity dev` and `npx sanity deploy`.
 *
 * `api.projectId` / `api.dataset` come from the same env vars the site uses.
 *
 * `project.basePath` is the important one: it is what makes `sanity build`
 * emit its asset URLs as /studio/static/… instead of /static/…. Without it the
 * Studio shell loads but every script 404s (it looks for them at the site root).
 * The workspace-level basePath in sanity.config.ts only controls the Studio's
 * internal router — you need BOTH, and they must agree.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  project: {
    basePath: "/studio",
  },
});
