import Link from "next/link";
import type { Gallery, GalleryImage } from "@/data/galleries";

const RATIO_CLASS: Record<string, string> = {
  tall: "r-tall",
  wide: "r-wide",
  square: "r-square",
  banner: "r-banner",
};

/**
 * Reserves the image's exact aspect ratio so the masonry never shifts.
 * Falls back to the ratio bucket class when `ar` isn't known.
 */
export function imageStyle(image: GalleryImage): React.CSSProperties {
  if (image.ar) return { aspectRatio: String(image.ar) };
  return {};
}

export function ratioClass(image: GalleryImage): string {
  return image.ar ? "" : RATIO_CLASS[image.ratio ?? "wide"];
}

/** A clickable cover tile for a gallery. */
export default function GalleryTile({
  gallery,
  role,
  showBlurb = false,
}: {
  gallery: Gallery;
  role?: string;
  showBlurb?: boolean;
}) {
  return (
    <Link
      href={`/gallery/${gallery.slug}`}
      className={`tile ${ratioClass(gallery.cover)}`}
      style={imageStyle(gallery.cover)}
      role={role}
      aria-label={`${gallery.title} gallery — ${gallery.images.length} images`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={gallery.cover.src}
        alt={gallery.cover.alt}
        loading="lazy"
        decoding="async"
      />
      <span className="tile__overlay">
        <span className="tile__meta">
          {gallery.category} · {gallery.images.length} frames
        </span>
        <span className="tile__title">{gallery.title}</span>
        {showBlurb ? (
          <span
            style={{
              fontFamily: "var(--sans-body)",
              fontSize: "var(--fs-p2)",
              letterSpacing: "0",
              textTransform: "none",
              color: "rgba(255,255,255,.82)",
              lineHeight: 1.6,
              maxWidth: "46ch",
            }}
          >
            {gallery.blurb}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
