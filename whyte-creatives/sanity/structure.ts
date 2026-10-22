import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar.
 *
 * "Site settings" is pinned at the top as a single fixed document (id
 * `siteSettings`) so it can't be accidentally duplicated. Pages are then
 * grouped by the part of the site they belong to, matching the real URL
 * structure: 7 service/ratecard pages, plus portfolio and the 3 galleries.
 */

const SERVICE_SLUGS = [
  "/wedding",
  "/events",
  "/corporate-photography",
  "/studio-portrait",
  "/outdoor-portrait",
  "/graduation",
  "/lifestyle-photography",
];

const GALLERY_SLUGS = ["/portfolio", "/gallery-1", "/gallery-2", "/gallery-4"];

const slugFilter = (slugs: string[]) =>
  `_type == "page" && slug.current in [${slugs
    .map((s) => `"${s}"`)
    .join(",")}]`;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("whyteCreatives")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(() => "⚙")
        .child(
          S.documentTypeList("siteSettings")
            .title("Site settings")
            .filter('_type == "siteSettings" && _id == "siteSettings"')
        ),

      S.divider(),

      S.listItem()
        .title("Pages")
        .icon(() => "▤")
        .child(
          S.documentTypeList("page")
            .title("All pages")
            .menuItems(S.documentTypeList("page").getMenuItems())
        ),

      S.listItem()
        .title("Service & ratecard pages")
        .icon(() => "◈")
        .child(
          S.documentList()
            .title("Service & ratecard pages")
            .filter(slugFilter(SERVICE_SLUGS))
        ),

      S.listItem()
        .title("Portfolio & galleries")
        .icon(() => "▦")
        .child(
          S.documentList()
            .title("Portfolio & galleries")
            .filter(slugFilter(GALLERY_SLUGS))
        ),

      S.divider(),

      S.listItem()
        .title("Everything else")
        .icon(() => "☰")
        .child(
          S.documentList()
            .title("Other documents")
            .filter(
              `_type == "page" && !(slug.current in [${[
                ...SERVICE_SLUGS,
                ...GALLERY_SLUGS,
                "/",
                "/about",
                "/contact",
              ]
                .map((s) => `"${s}"`)
                .join(",")}]])`
            )
        ),
    ]);
