"use client";

import { useCallback, useEffect, useState } from "react";
import type { GalleryImage } from "@/data/galleries";

type LightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title?: string;
};

/**
 * Full-screen image viewer with keyboard + swipe navigation.
 * Escape closes, ← → move, Home/End jump to the ends.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  title,
}: LightboxProps) {
  const open = index !== null;
  const [touchX, setTouchX] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      const next = (index + delta + images.length) % images.length;
      onIndexChange(next);
    },
    [index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          step(1);
          break;
        case "ArrowLeft":
          step(-1);
          break;
        case "Home":
          onIndexChange(0);
          break;
        case "End":
          onIndexChange(images.length - 1);
          break;
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, step, onIndexChange, images.length]);

  const current = index !== null ? images[index] : null;

  return (
    <div
      className="lightbox"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} image viewer` : "Image viewer"}
      onClick={onClose}
      onTouchStart={(e) => setTouchX(e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
        setTouchX(null);
      }}
    >
      <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <span>{title ?? ""}</span>
        <button
          className="lightbox__btn"
          onClick={onClose}
          aria-label="Close viewer (Esc)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.src}
          alt={current.alt}
          onClick={(e) => e.stopPropagation()}
        />
      ) : null}

      {current ? (
        <p className="lightbox__caption">{current.alt}</p>
      ) : null}

      <div className="lightbox__nav" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox__btn"
          onClick={() => step(-1)}
          aria-label="Previous image (left arrow)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M10 2L4 8l6 6"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
        </button>
        <span className="lightbox__count">
          {index !== null ? index + 1 : 0} / {images.length}
        </span>
        <button
          className="lightbox__btn"
          onClick={() => step(1)}
          aria-label="Next image (right arrow)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M6 2l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
