import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormValue, type ObjectItem } from "sanity";
import { Card, Stack, Text } from "@sanity/ui";

/* ------------------------------------------------------------------
   FlexCanvas — a drag-and-drop editor for the Flex grid.

   Replaces typing 12 numbers per element (4 per breakpoint × 3) with a
   scaled-down picture of the real page grid. Drag a chip to move it,
   drag its handles to resize, use arrow keys to nudge.

   Everything snaps to whole cells, because the site's layout model is a
   grid of square cells: 26 columns on desktop and tablet, 10 on mobile.
   ------------------------------------------------------------------ */

type Breakpoint = "desktop" | "tablet" | "mobile";

type Box = { top: number; left: number; width: number; height: number };

type DragMode = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type ElementValue = {
  _key?: string;
  _type?: string;
  kind?: string;
  text?: string;
  level?: string;
  linkText?: string;
  href?: string;
  align?: string;
  valign?: string;
  zIndex?: number;
  boxDesktop?: Box;
  boxTablet?: Box;
  boxMobile?: Box;
};

const COLUMNS: Record<Breakpoint, number> = {
  desktop: 26,
  tablet: 26,
  mobile: 10,
};

const ROWS_PATH: Record<Breakpoint, string> = {
  desktop: "rowsDesktop",
  tablet: "rowsTablet",
  mobile: "rowsMobile",
};

const BOX_FIELD: Record<Breakpoint, keyof ElementValue> = {
  desktop: "boxDesktop",
  tablet: "boxTablet",
  mobile: "boxMobile",
};

const DEFAULT_ROWS: Record<Breakpoint, number> = {
  desktop: 12,
  tablet: 16,
  mobile: 24,
};

const KIND_LABEL: Record<string, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  eyebrow: "Eyebrow",
  subtitle: "Subtitle",
  image: "Image",
  button: "Button",
  textlink: "Text link",
  list: "List",
  price: "Price",
  carousel: "Carousel",
  card: "Card",
  form: "Form",
  spacer: "Spacer",
};

const IMAGE_KINDS = new Set(["image", "carousel", "card"]);

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function normaliseBox(raw: unknown, cols: number, rows: number): Box {
  const b = (raw ?? {}) as Partial<Box>;
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback;
  return {
    top: clamp(num(b.top, 1), 1, rows),
    left: clamp(num(b.left, 1), 1, cols),
    width: clamp(num(b.width, 4), 1, cols),
    height: clamp(num(b.height, 2), 1, rows),
  };
}

/** Short label shown inside a chip. */
function chipLabel(el: ElementValue): string {
  const text = (el.text ?? el.linkText ?? "").trim();
  if (text) {
    const first = text.split(/\n/)[0].trim();
    return first.length > 42 ? `${first.slice(0, 42)}…` : first;
  }
  if (el.href) return el.href;
  return KIND_LABEL[el.kind ?? ""] ?? "Element";
}

const STYLE_ID = "flex-canvas-styles";

/** Load the canvas stylesheet (public/flex-canvas.css) once per document. */
function useCanvasStyles() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const link = document.createElement("link");
    link.id = STYLE_ID;
    link.rel = "stylesheet";
    link.href = "/flex-canvas.css";
    document.head.appendChild(link);
  }, []);
}

export default function FlexCanvas(props: {
  value?: ObjectItem[];
  onChange: (patch: unknown) => void;
}) {
  const { value, onChange } = props;
  useCanvasStyles();

  // The enclosing block's row counts — read from the surrounding form so the
  // canvas always matches the block it belongs to.
  const blockValue = (useFormValue([]) ?? {}) as Record<string, unknown>;
  const blockName = typeof blockValue.name === "string" ? blockValue.name : "";

  const [bp, setBp] = useState<Breakpoint>("desktop");
  const [showGrid, setShowGrid] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [cellPx, setCellPx] = useState(24);

  const cols = COLUMNS[bp];
  const rowsRaw = blockValue[ROWS_PATH[bp]];
  const rows = clamp(
    typeof rowsRaw === "number" && Number.isFinite(rowsRaw)
      ? Math.round(rowsRaw)
      : DEFAULT_ROWS[bp],
    1,
    160
  );

  const items = useMemo<ElementValue[]>(
    () =>
      (value ?? [])
        .filter((v): v is ObjectItem => v != null && typeof v === "object")
        .map((v) => v as unknown as ElementValue),
    [value]
  );

  /* ---- keep the cell size in sync with the container ---- */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => setCellPx(el.clientWidth / cols);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cols]);

  /* ---- write one element's box back into the array ---- */
  const patchBox = useCallback(
    (key: string, box: Box) => {
      const index = items.findIndex((it) => it._key === key);
      if (index < 0) return;
      const next = items.slice();
      next[index] = { ...next[index], [BOX_FIELD[bp]]: box };
      onChange({ set: next });
    },
    [items, onChange, bp]
  );

  const patchElement = useCallback(
    (key: string, patch: Partial<ElementValue>) => {
      const index = items.findIndex((it) => it._key === key);
      if (index < 0) return;
      const next = items.slice();
      next[index] = { ...next[index], ...patch };
      onChange({ set: next });
    },
    [items, onChange]
  );

  /* ---- dragging ---- */
  const drag = useRef<{
    key: string;
    mode: DragMode;
    startX: number;
    startY: number;
    origin: Box;
    moved: boolean;
  } | null>(null);

  const [dragKey, setDragKey] = useState<string | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, key: string, mode: DragMode) => {
      e.preventDefault();
      e.stopPropagation();
      const item = items.find((it) => it._key === key);
      if (!item) return;
      const origin = normaliseBox(item[BOX_FIELD[bp]], cols, rows);
      drag.current = {
        key,
        mode,
        startX: e.clientX,
        startY: e.clientY,
        origin,
        moved: false,
      };
      setDragKey(key);
      setSelected(key);
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [items, bp, cols, rows]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dxCells = Math.round((e.clientX - d.startX) / cellPx);
      const dyCells = Math.round((e.clientY - d.startY) / cellPx);
      if (dxCells === 0 && dyCells === 0) return;
      d.moved = true;

      const o = d.origin;
      let next: Box = { ...o };

      if (d.mode === "move") {
        next.left = clamp(o.left + dxCells, 1, cols - o.width + 1);
        next.top = clamp(o.top + dyCells, 1, rows - o.height + 1);
      } else {
        // horizontal edges
        if (d.mode.includes("e")) {
          const w = clamp(o.width + dxCells, 1, cols - o.left + 1);
          next.width = w;
        }
        if (d.mode.includes("w")) {
          const newLeft = clamp(o.left + dxCells, 1, o.left + o.width - 1);
          next.width = o.width - (newLeft - o.left);
          next.left = newLeft;
        }
        // vertical edges
        if (d.mode.includes("s")) {
          next.height = clamp(o.height + dyCells, 1, rows - o.top + 1);
        }
        if (d.mode === "n" || d.mode === "nw" || d.mode === "ne") {
          const newTop = clamp(o.top + dyCells, 1, o.top + o.height - 1);
          next.height = o.height - (newTop - o.top);
          next.top = newTop;
        }
      }

      if (
        next.top !== o.top ||
        next.left !== o.left ||
        next.width !== o.width ||
        next.height !== o.height
      ) {
        patchBox(d.key, next);
      }
    };

    const onUp = () => {
      drag.current = null;
      setDragKey(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [cellPx, cols, rows, patchBox]);

  /* ---- keyboard nudging on the selected element ---- */
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // don't hijack typing in inputs
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (!e.key.startsWith("Arrow")) return;

      const item = items.find((it) => it._key === selected);
      if (!item) return;
      const o = normaliseBox(item[BOX_FIELD[bp]], cols, rows);
      const dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
      const dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
      if (!dx && !dy) return;
      e.preventDefault();

      const next = e.shiftKey
        ? {
            ...o,
            width: clamp(o.width + dx, 1, cols - o.left + 1),
            height: clamp(o.height + dy, 1, rows - o.top + 1),
          }
        : {
            ...o,
            left: clamp(o.left + dx, 1, cols - o.width + 1),
            top: clamp(o.top + dy, 1, rows - o.height + 1),
          };
      patchBox(selected, next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, items, bp, cols, rows, patchBox]);

  /* ---- element housekeeping ---- */
  const selectedEl = items.find((it) => it._key === selected) ?? null;

  const addElement = () => {
    const key = `el${Math.random().toString(36).slice(2, 9)}`;
    const fresh: ElementValue = {
      _key: key,
      _type: "element",
      kind: "heading",
      level: "h2",
      text: "New heading",
      align: "left",
      valign: "top",
      boxDesktop: { top: 1, left: 2, width: 10, height: 3 },
      boxTablet: { top: 1, left: 2, width: 14, height: 4 },
      boxMobile: { top: 1, left: 2, width: 8, height: 3 },
      zIndex: 0,
    };
    onChange({ set: [...items, fresh] });
    setSelected(key);
  };

  const duplicateSelected = () => {
    if (!selectedEl) return;
    const key = `el${Math.random().toString(36).slice(2, 9)}`;
    const b = normaliseBox(selectedEl[BOX_FIELD[bp]], cols, rows);
    const copy: ElementValue = {
      ...selectedEl,
      _key: key,
      [BOX_FIELD[bp]]: {
        ...b,
        top: clamp(b.top + b.height, 1, Math.max(1, rows - b.height)),
      },
    };
    onChange({ set: [...items, copy] });
    setSelected(key);
  };

  const removeSelected = () => {
    if (!selectedEl?._key) return;
    onChange({ set: items.filter((it) => it._key !== selectedEl._key) });
    setSelected(null);
  };

  const nudgeField = (field: keyof Box, delta: number) => {
    if (!selectedEl?._key) return;
    const b = normaliseBox(selectedEl[BOX_FIELD[bp]], cols, rows);
    const next = { ...b, [field]: b[field] + delta };
    patchBox(selectedEl._key, normaliseBox(next, cols, rows));
  };

  const setField = (field: keyof Box, raw: string) => {
    if (!selectedEl?._key) return;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return;
    const b = normaliseBox(selectedEl[BOX_FIELD[bp]], cols, rows);
    patchBox(selectedEl._key, normaliseBox({ ...b, [field]: n }, cols, rows));
  };

  const canvasStyle = {
    aspectRatio: `${cols} / ${rows}`,
    ["--fc-cell" as string]: `${cellPx}px`,
  } as React.CSSProperties;

  return (
    <div className="fc">
      <div className="fc-bar">
        <div className="fc-tabs" role="tablist" aria-label="Breakpoint">
          {(["desktop", "tablet", "mobile"] as Breakpoint[]).map((b) => (
            <button
              key={b}
              type="button"
              role="tab"
              className="fc-tab"
              data-on={bp === b}
              aria-selected={bp === b}
              onClick={() => setBp(b)}
            >
              {b}
              <span style={{ opacity: 0.6 }}> · {COLUMNS[b]}col</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="fc-toggle"
          data-on={showGrid}
          aria-pressed={showGrid}
          onClick={() => setShowGrid((v) => !v)}
        >
          Grid
        </button>

        <button type="button" className="fc-btn" onClick={addElement}>
          + Add element
        </button>

        <span className="fc-hint">
          Drag to move · handles to resize · arrows to nudge · ⇧+arrows to resize
        </span>
      </div>

      <div
        className="fc-canvas"
        ref={canvasRef}
        style={canvasStyle}
        onPointerDown={() => setSelected(null)}
        role="application"
        aria-label={`Layout canvas — ${bp}, ${cols} columns by ${rows} rows`}
      >
        <div className="fc-grid" data-off={!showGrid} />

        {showGrid && cols <= 26 ? (
          <div className="fc-ruler" aria-hidden="true">
            {Array.from({ length: cols }, (_, i) => (
              <span key={i}>{i % 2 === 0 ? i + 1 : ""}</span>
            ))}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="fc-empty">
            No elements yet. Click <strong>+ Add element</strong>, then drag it
            into place.
          </div>
        ) : null}

        {items.map((el) => {
          const key = el._key;
          if (!key) return null;
          const box = normaliseBox(el[BOX_FIELD[bp]], cols, rows);
          const isSel = selected === key;
          const isImg = IMAGE_KINDS.has(el.kind ?? "");

          const style: React.CSSProperties = {
            left: `${((box.left - 1) / cols) * 100}%`,
            top: `${((box.top - 1) / rows) * 100}%`,
            width: `${(box.width / cols) * 100}%`,
            height: `${(box.height / rows) * 100}%`,
            zIndex: isSel ? undefined : (el.zIndex ?? 0) + 1,
          };

          return (
            <div
              key={key}
              className={`fc-el${isImg ? " fc-el--image" : ""}`}
              style={style}
              data-sel={isSel}
              data-drag={dragKey === key}
              onPointerDown={(e) => onPointerDown(e, key, "move")}
              title={`${KIND_LABEL[el.kind ?? ""] ?? el.kind} — row ${box.top}, col ${box.left}, ${box.width}×${box.height}`}
            >
              <span>
                <span className="fc-el__label">{chipLabel(el)}</span>
                <span className="fc-el__kind">
                  {KIND_LABEL[el.kind ?? ""] ?? el.kind} · {box.width}×
                  {box.height}
                </span>
              </span>

              {(
                [
                  ["n", "fc-h--n"],
                  ["s", "fc-h--s"],
                  ["e", "fc-h--e"],
                  ["w", "fc-h--w"],
                  ["nw", "fc-h--nw"],
                  ["ne", "fc-h--ne"],
                  ["sw", "fc-h--sw"],
                  ["se", "fc-h--se"],
                ] as const
              ).map(([mode, cls]) => (
                <span
                  key={mode}
                  className={`fc-h ${cls}`}
                  onPointerDown={(e) => onPointerDown(e, key, mode)}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* ---- inspector ---- */}
      {selectedEl ? (
        <div className="fc-inspector">
          <div className="fc-inspector__head">
            <span>
              {KIND_LABEL[selectedEl.kind ?? ""] ?? selectedEl.kind}
            </span>
            <span className="fc-inspector__sub">
              {blockName ? `in “${blockName}” · ` : ""}
              {bp} · {cols}×{rows}
            </span>
          </div>

          <div className="fc-fields">
            {(
              [
                ["top", "Top"],
                ["left", "Left"],
                ["width", "Width"],
                ["height", "Height"],
              ] as const
            ).map(([field, label]) => {
              const box = normaliseBox(
                selectedEl[BOX_FIELD[bp]],
                cols,
                rows
              );
              return (
                <div className="fc-field" key={field}>
                  <label htmlFor={`fc-${field}`}>{label}</label>
                  <input
                    id={`fc-${field}`}
                    type="number"
                    min={1}
                    max={field === "left" || field === "width" ? cols : rows}
                    value={box[field]}
                    onChange={(e) => setField(field, e.target.value)}
                  />
                </div>
              );
            })}
          </div>

          <div className="fc-actions">
            <button type="button" className="fc-btn" onClick={() => nudgeField("top", -1)}>↑ up</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("top", 1)}>↓ down</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("left", -1)}>← left</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("left", 1)}>→ right</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("width", 1)}>wider</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("width", -1)}>narrower</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("height", 1)}>taller</button>
            <button type="button" className="fc-btn" onClick={() => nudgeField("height", -1)}>shorter</button>
            <button type="button" className="fc-btn" onClick={duplicateSelected}>Duplicate</button>
            <button
              type="button"
              className="fc-btn fc-btn--danger"
              onClick={removeSelected}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <Card padding={3} tone="default" border radius={2}>
          <Stack space={2}>
            <Text size={1} muted>
              Click an element on the canvas to move, resize, duplicate or delete
              it. {blockName ? `Block: “${blockName}”.` : ""} Set the block's row
              counts in the fields above to change how tall this section is.
            </Text>
          </Stack>
        </Card>
      )}
    </div>
  );
}
