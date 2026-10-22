import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar. Pages are grouped by the part of the site they belong to,
 * and "Site settings" is pinned as a single document at the top so it can't
 * be accidentally duplicated.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("whyteCreatives")
    .items([
      S.documentListItem()
        .schemaType("siteSettings")
        .documentId("siteSettings")
        .title("Site settings")
        .icon(() => "⚙"),

      S.divider(),

      S.listItem()
        .title("Pages")
        .icon(() => "▤")
        .child(
          S.documentTypeList("page")
            .title("All pages")
            .menuItems(S.documentTypeList("page").getMenuItems())
        ),

      S.divider(),

      S.listItem()
        .title("Service & ratecard pages")
        .icon(() => "◈")
        .child(
          S.documentList()
            .title("Service & ratecard pages")
            .filter(
              `_type == "page" && slug.current in [
                "/wedding","/events","/corporate-photography","/studio-portrait",
                "/outdoor-portrait","/graduation","/lifestyle-photography"
              ]`
            )
        ),

      S.listItem()
        .title("Portfolio & galleries")
        .icon(() => "▦")
        .child(
          S.documentList()
            .title("Portfolio & galleries")
            .filter(
              `_type == "page" && slug.current in ["/portfolio","/gallery-1","/gallery-2","/gallery-4"]`
            )
        ),

      S.divider(),

      S.listItem()
        .title("Open the live site")
        .icon(() => "↗")
        .action(() => {
          const url =
            process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
          window.open(url, "_blank", "noopener");
        })
        .showIcon(false),
    ]);
