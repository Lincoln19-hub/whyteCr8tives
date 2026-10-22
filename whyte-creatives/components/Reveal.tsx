"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** animation delay in ms */
  delay?: number;
  /** "mask" wipes the element up into view; default fades + lifts */
  variant?: "fade" | "mask";
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Reveals its children once they scroll into view.
 * Respects prefers-reduced-motion (CSS handles the fallback).
 */
export default function Reveal({
  children,
  delay = 0,
  variant = "fade",
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref as never}
      className={`${variant === "mask" ? "reveal--mask" : "reveal"} ${className}`.trim()}
      data-shown={shown}
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
