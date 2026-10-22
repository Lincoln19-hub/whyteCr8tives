"use client";

/** The original has a back-to-top control in the footer's bottom-right cell. */
export default function BackToTop() {
  return (
    <button
      type="button"
      className="back-to-top"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
    >
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M8 14V3M3 8l5-5 5 5"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="none"
        />
      </svg>
    </button>
  );
}
