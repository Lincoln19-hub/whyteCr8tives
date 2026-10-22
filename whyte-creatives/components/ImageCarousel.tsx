"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The full-width image carousel from block 4 of the original home page.
 * Pixieset's version auto-advances with arrow controls (arrows-style 4, 30px);
 * this reproduces that behaviour: auto-advance, pause on hover, arrow keys,
 * swipe, and clickable arrows — all disabled under prefers-reduced-motion.
 */
export default function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = (delta: number) =>
    setIndex((i) => (i + delta + count) % count);

  useEffect(() => {
    if (paused || count < 2) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => go(1), 4200);
    return () => clearInterval(id);
  }, [paused, count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Portfolio highlights"
    >
      <div
        className="carousel__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <figure className="carousel__slide" key={src} aria-hidden={i !== index}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </figure>
        ))}
      </div>

      <button
        type="button"
        className="carousel__arrow carousel__arrow--prev"
        onClick={() => go(-1)}
        aria-label="Previous image"
      >
        <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
          <path d="M19 6L10 15l9 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>
      <button
        type="button"
        className="carousel__arrow carousel__arrow--next"
        onClick={() => go(1)}
        aria-label="Next image"
      >
        <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
          <path d="M11 6l9 9-9 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>

      <div className="carousel__dots">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className="carousel__dot"
            data-active={i === index}
            onClick={() => setIndex(i)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  );
}
