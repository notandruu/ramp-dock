"use client";

import { useId, type CSSProperties, type Ref } from "react";

/*
 * The in-thread widget, measured off the reminder card in the "Text your agent" clip. Sizes are
 * iOS points. A new widget is a new glyph plus three strings; the card, the type, where the glyph
 * sits and how it rings all come from here, so every widget matches the bell.
 */

/** The card surface. Also used by the larger thread cards. */
export const softCard: CSSProperties = {
  background: "#f7f7f7",
  border: "1px solid #ececec",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 6px 16px rgba(0,0,0,0.04)",
};

export const WIDGET_SIZE = 158;
const RADIUS = 14.5;
const INK = "#0c0c0c";
const CAPTION = "#6e6e6e";

/*
 * Glyphs are drawn upright in one shared frame: x from about -46 to 46, the heavy part on top
 * (y down to about -88), the bottom edge near y = -12, and an optional accent piece hanging a few
 * points below it, like the bell's clapper. The card tilts every glyph 24deg and parks it in its
 * top right corner so the top runs off the card. That bleed, the tilt and the ring are the look.
 */
const ANCHOR = { x: 91.5, y: 74.1 };
const TILT = 24;
/** Where a glyph hangs from when it rings: up in its top, on its axis. */
const PIVOT = -60;

export const glyphPose = (swing: number) =>
  `translate(${ANCHOR.x}px, ${ANCHOR.y}px) rotate(${TILT}deg) translate(0px, ${PIVOT}px) rotate(${swing.toFixed(2)}deg) translate(0px, ${-PIVOT}px)`;

export type GlyphShape = {
  /** Main silhouette. Holes cut with evenodd show the card through. */
  body: string;
  /** A separate smaller piece in the deeper tone, a few points off the body. */
  accent?: string;
  /** Vertical span of the accent, for its gradient. */
  accentSpan?: [top: number, bottom: number];
};

/** One blue: deeper at the glyph's top, lighter toward its open edge, sampled off the clip's bell. */
function GlyphPaint({ id, accentSpan = [-6.3, 7.8] }: { id: string; accentSpan?: [number, number] }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" x1="0" y1="-88" x2="0" y2="-12">
        <stop offset="0" stopColor="#6aa9fa" />
        <stop offset="0.9" stopColor="#a8ccfb" />
        <stop offset="1" stopColor="#b0d1fb" />
      </linearGradient>
      <linearGradient id={`${id}-accent`} gradientUnits="userSpaceOnUse" x1="0" y1={accentSpan[0]} x2="0" y2={accentSpan[1]}>
        <stop offset="0" stopColor="#70acfb" />
        <stop offset="1" stopColor="#a4cafb" />
      </linearGradient>
    </defs>
  );
}

export function Glyph({ shape, innerRef }: { shape: GlyphShape; innerRef?: Ref<SVGGElement> }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={WIDGET_SIZE} height={WIDGET_SIZE} viewBox={`0 0 ${WIDGET_SIZE} ${WIDGET_SIZE}`} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0 }}>
      <GlyphPaint id={id} accentSpan={shape.accentSpan} />
      <g ref={innerRef} style={{ transform: glyphPose(0), transformBox: "view-box", transformOrigin: "0 0" }}>
        <path d={shape.body} fill={`url(#${id}-body)`} fillRule="evenodd" />
        {shape.accent && <path d={shape.accent} fill={`url(#${id}-accent)`} />}
      </g>
    </svg>
  );
}

/**
 * The small square card: glyph in the corner, a big value with a small unit, one gray line.
 * Keep the value and unit inside about 70pt (a number of one to three digits and a short word):
 * past that they run under the glyph's accent. Put longer facts in the caption.
 */
export function Widget({
  glyph,
  value,
  unit,
  caption,
  glyphRef,
}: {
  glyph: GlyphShape;
  value: string;
  unit?: string;
  caption: string;
  glyphRef?: Ref<SVGGElement>;
}) {
  return (
    <div style={{ width: WIDGET_SIZE, height: WIDGET_SIZE, borderRadius: RADIUS, position: "relative", overflow: "hidden", ...softCard }}>
      <Glyph shape={glyph} innerRef={glyphRef} />
      <div style={{ position: "absolute", left: 20, top: 74, display: "flex", alignItems: "baseline", gap: 3, color: INK }}>
        <span style={{ fontSize: 42, lineHeight: "42px", letterSpacing: -1 }}>{value}</span>
        {unit && <span style={{ fontSize: 16 }}>{unit}</span>}
      </div>
      <div style={{ position: "absolute", left: 20, right: 12, top: 122, fontSize: 12.5, color: CAPTION, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {caption}
      </div>
    </div>
  );
}

/* ---------- glyphs ---------- */

/**
 * The reminder bell, traced from the clip and mirror-filled where the card edge cuts it: 92pt
 * across the flared rim, a round dome, a half-disc clapper 5pt below.
 */
export const BELL: GlyphShape = {
  body:
    "M-39.5 -11.8 C-43.5 -11.8 -46.2 -14.5 -46 -17.8 C-44 -23 -36 -27 -35.5 -34 L-35.5 -52.5 " +
    "A35.5 35.5 0 0 1 35.5 -52.5 L35.5 -34 C36 -27 44 -23 46 -17.8 C46.2 -14.5 43.5 -11.8 39.5 -11.8 Z",
  accent: "M-14.1 -6.3 A14.1 14.1 0 0 0 14.1 -6.3 Z",
  accentSpan: [-6.3, 7.8],
};

/** A delivery box with a strip of tape, sitting on a small pallet as the accent. */
export const BOX: GlyphShape = {
  body:
    "M-28 -84 L28 -84 Q34 -84 34 -78 L34 -20 Q34 -14 28 -14 L-28 -14 Q-34 -14 -34 -20 L-34 -78 Q-34 -84 -28 -84 Z " +
    "M-7 -84 L7 -84 L7 -62 Q7 -60 5 -60 L-5 -60 Q-7 -60 -7 -62 Z",
  accent: "M-20 -8 L20 -8 Q24 -8 24 -4 Q24 0 20 0 L-20 0 Q-24 0 -24 -4 Q-24 -8 -20 -8 Z",
  accentSpan: [-8, 0],
};

/** A paid bill: a slip with a torn bottom edge and two lines, and a coin dropping out under it. */
export const BILL: GlyphShape = {
  body:
    "M-30 -88 L30 -88 Q36 -88 36 -82 L36 -12 L30 -17 L24 -12 L18 -17 L12 -12 L6 -17 L0 -12 L-6 -17 L-12 -12 " +
    "L-18 -17 L-24 -12 L-30 -17 L-36 -12 L-36 -82 Q-36 -88 -30 -88 Z " +
    "M-22 -46 L22 -46 Q24 -46 24 -44 L24 -41 Q24 -39 22 -39 L-22 -39 Q-24 -39 -24 -41 L-24 -44 Q-24 -46 -22 -46 Z " +
    "M-22 -32 L8 -32 Q10 -32 10 -30 L10 -27 Q10 -25 8 -25 L-22 -25 Q-24 -25 -24 -27 L-24 -30 Q-24 -32 -22 -32 Z",
  accent: "M0 -6 A10 10 0 1 1 0 14 A10 10 0 1 1 0 -6 Z",
  accentSpan: [-6, 14],
};
