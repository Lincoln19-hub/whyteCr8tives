import type { CSSProperties, ReactNode } from "react";
import type { Box, Breakpoint } from "./FlexBlock";

type FlexItemProps = {
  /** geometry per breakpoint; desktop is required, others fall back to it */
  box: Partial<Record<Breakpoint, Box>> & { desktop: Box };
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
  zIndex?: number;
};

/**
 * One absolutely-placed element inside a FlexBlock.
 *
 * Mirrors the original's `.fb-element` rule shape:
 *   grid-area: var(--top) / var(--left) / span var(--height) / span var(--width)
 * with 1-based coordinates and per-breakpoint overrides.
 */
export default function FlexItem({
  box,
  children,
  className = "",
  style,
  as = "div",
  zIndex,
}: FlexItemProps) {
  const Tag = as as React.ElementType;
  const d = box.desktop;
  const t = box.tablet ?? d;
  const m = box.mobile ?? d;

  return (
    <Tag
      className={`fb-element ${className}`.trim()}
      style={
        {
          "--top": d.top,
          "--left": d.left,
          "--width": d.width,
          "--height": d.height,
          "--top-t": t.top,
          "--left-t": t.left,
          "--width-t": t.width,
          "--height-t": t.height,
          "--top-m": m.top,
          "--left-m": m.left,
          "--width-m": m.width,
          "--height-m": m.height,
          ...(zIndex !== undefined ? { "--z": zIndex } : {}),
          ...style,
        } as CSSProperties
      }
    >
      <div className="fb-element__content">{children}</div>
    </Tag>
  );
}
