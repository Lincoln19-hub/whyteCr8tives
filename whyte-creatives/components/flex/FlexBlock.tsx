import type { CSSProperties, ReactNode } from "react";

/**
 * Faithful reimplementation of Pixieset's Flex "gridWithGaps" layout model.
 *
 * How the original works (extracted from the live site's CSS):
 *   • Each block is a CSS grid of `columns` × `rows` SQUARE cells.
 *   • Every element is absolutely placed with 1-based --top / --left / --width / --height.
 *   • The block's height comes from its aspect ratio: columns ÷ rows.
 *   • Columns are 26 on desktop (≥992px) and tablet (768–991px), 10 on mobile (≤767px).
 *   • Each breakpoint carries its own row count and its own element geometry.
 *
 * Because cells are square, giving the grid `aspect-ratio: columns / rows` and
 * `grid-template-rows: repeat(rows, 1fr)` reproduces the original proportions
 * exactly at any container width.
 */

export const COLUMNS = { desktop: 26, tablet: 26, mobile: 10 } as const;

export type Breakpoint = "desktop" | "tablet" | "mobile";

/** 1-based box in grid cells. */
export type Box = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type BlockGeometry = {
  /** rows per breakpoint — columns are fixed by COLUMNS */
  rows: Record<Breakpoint, number>;
  /** vertical padding as a multiple of the base unit, per breakpoint */
  padTop?: Record<Breakpoint, number>;
  padBottom?: Record<Breakpoint, number>;
};

type FlexBlockProps = {
  geometry: BlockGeometry;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** background colour token; defaults to the site's primary background */
  background?: string;
  as?: "section" | "div" | "footer" | "header";
  id?: string;
  ariaLabel?: string;
};

export default function FlexBlock({
  geometry,
  children,
  className = "",
  style,
  background,
  as = "section",
  id,
  ariaLabel,
}: FlexBlockProps) {
  const Tag = as;

  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={`fb-block-outer ${className}`.trim()}
      style={{ background, ...style }}
    >
      <div className="fb-block-padding-wrap">
        <div className="fb-block-wrap">
          <div
            className="fb-block fb-block--gridWithGaps"
            style={
              {
                "--cols-desktop": COLUMNS.desktop,
                "--cols-mobile": COLUMNS.mobile,
                "--rows-desktop": geometry.rows.desktop,
                "--rows-tablet": geometry.rows.tablet,
                "--rows-mobile": geometry.rows.mobile,
                "--pad-top-desktop": geometry.padTop?.desktop ?? 1,
                "--pad-bottom-desktop": geometry.padBottom?.desktop ?? 1,
                "--pad-top-tablet": geometry.padTop?.tablet ?? 1,
                "--pad-bottom-tablet": geometry.padBottom?.tablet ?? 1,
                "--pad-top-mobile": geometry.padTop?.mobile ?? 1,
                "--pad-bottom-mobile": geometry.padBottom?.mobile ?? 1,
              } as CSSProperties
            }
          >
            {children}
          </div>
        </div>
      </div>
    </Tag>
  );
}
