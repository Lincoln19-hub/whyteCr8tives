"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";

/**
 * The gallery grid used by /gallery-1, /gallery-2 and /gallery-4.
 * Nine images each, masonry-style, click to open the lightbox.
 */
export default function GalleryView({
  images,
  title,
}: {
  images: readonly string[];
  title: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const items = images.map((src, i) => ({
    src,
    alt: `${title} — frame ${i + 1}`,
    ratio: undefined,
  }));

  return (
    <>
      <div className="masonry">
        {images.map((src, i) => (
          <Reveal key={src} delay={(i % 3) * 90} as="div">
            <button
              type="button"
              className="frame r-auto"
              onClick={() => setIndex(i)}
              aria-label={`Open image ${i + 1} of ${images.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${title} — frame ${i + 1}`} loading="lazy" decoding="async" />
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={items}
        index={index}
        title={title}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
