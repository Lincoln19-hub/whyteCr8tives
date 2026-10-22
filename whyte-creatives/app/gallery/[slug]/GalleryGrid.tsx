"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";
import { imageStyle, ratioClass } from "@/components/GalleryTile";
import type { GalleryImage } from "@/data/galleries";

/** Masonry grid of gallery frames that opens the lightbox on click. */
export default function GalleryGrid({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="masonry">
        {images.map((image, i) => (
          <Reveal key={`${image.src}-${i}`} delay={(i % 3) * 90} as="div">
            <button
              type="button"
              className={`frame ${ratioClass(image)}`}
              style={imageStyle(image)}
              onClick={() => setIndex(i)}
              aria-label={`Open image ${i + 1} of ${images.length}: ${image.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={images}
        index={index}
        title={title}
        onClose={() => setIndex(null)}
        onIndexChange={setIndex}
      />
    </>
  );
}
