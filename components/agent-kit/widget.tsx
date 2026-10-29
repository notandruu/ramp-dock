"use client";

import { useId, type CSSProperties } from "react";
import { drop, feed, pullUp, ring, stamp, tap, type Gesture } from "./motion";

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
export const INK = "#0c0c0c";
export const CAPTION = "#6e6e6e";

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
  /** What it does once the card lets go of it, true to the real object. Leave out to hold still. */
  gesture?: Gesture;
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

/** Parts are tagged `data-part` so a gesture can find them: the whole glyph, its body, its accent. */
export function Glyph({ shape }: { shape: GlyphShape }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={WIDGET_SIZE} height={WIDGET_SIZE} viewBox={`0 0 ${WIDGET_SIZE} ${WIDGET_SIZE}`} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0 }}>
      <GlyphPaint id={id} accentSpan={shape.accentSpan} />
      <g data-part="glyph" style={{ transform: glyphPose(0), transformBox: "view-box", transformOrigin: "0 0" }}>
        <path data-part="body" d={shape.body} fill={`url(#${id}-body)`} fillRule="evenodd" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        {shape.accent && (
          <path data-part="accent" d={shape.accent} fill={`url(#${id}-accent)`} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        )}
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
}: {
  glyph: GlyphShape;
  value: string;
  unit?: string;
  caption: string;
}) {
  return (
    <div style={{ width: WIDGET_SIZE, height: WIDGET_SIZE, borderRadius: RADIUS, position: "relative", overflow: "hidden", ...softCard }}>
      <Glyph shape={glyph} />
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
  gesture: ring(glyphPose),
};

/** A card, face on: chip and name line cut out. Tapped like paying at a reader. */
export const CARD: GlyphShape = {
  body:
    "M-35 -68 L35 -68 Q42 -68 42 -61 L42 -21 Q42 -14 35 -14 L-35 -14 Q-42 -14 -42 -21 L-42 -61 Q-42 -68 -35 -68 Z " +
    "M-29 -52 L-17 -52 Q-15 -52 -15 -50 L-15 -42 Q-15 -40 -17 -40 L-29 -40 Q-31 -40 -31 -42 L-31 -50 Q-31 -52 -29 -52 Z " +
    "M-29 -27 L-1 -27 Q1 -27 1 -25 Q1 -23 -1 -23 L-29 -23 Q-31 -23 -31 -25 Q-31 -27 -29 -27 Z",
  gesture: tap(0.1),
};

/** A shipping box in three-quarter view: top and two sides, a thin gap at each fold. Dropped into place. */
export const BOX: GlyphShape = {
  body:
    "M0 -88 L40 -70 L0 -55 L-40 -70 Z " +
    "M-40 -67 L-1.5 -52.6 L-1.5 -12.6 L-40 -27 Z " +
    "M40 -67 L1.5 -52.6 L1.5 -12.6 L40 -27 Z",
  gesture: drop(16),
};

/** A paid bill: a slip with a torn bottom edge and two lines. It prints out of the corner. */
export const BILL: GlyphShape = {
  body:
    "M-30 -88 L30 -88 Q36 -88 36 -82 L36 -12 L30 -17 L24 -12 L18 -17 L12 -12 L6 -17 L0 -12 L-6 -17 L-12 -12 " +
    "L-18 -17 L-24 -12 L-30 -17 L-36 -12 L-36 -82 Q-36 -88 -30 -88 Z " +
    "M-22 -46 L22 -46 Q24 -46 24 -44 L24 -41 Q24 -39 22 -39 L-22 -39 Q-24 -39 -24 -41 L-24 -44 Q-24 -46 -22 -46 Z " +
    "M-22 -32 L8 -32 Q10 -32 10 -30 L10 -27 Q10 -25 8 -25 L-22 -25 Q-24 -25 -24 -27 L-24 -30 Q-24 -32 -22 -32 Z",
  gesture: feed(40),
};

/** An approval stamp: knob, neck, handle and rubber pad. Its accent is the ink line it leaves. */
export const STAMP: GlyphShape = {
  body:
    "M0 -88 A13 13 0 1 1 0 -62 A13 13 0 1 1 0 -88 Z " +
    "M-7 -60 L7 -60 L12 -42 L-12 -42 Z " +
    "M-35 -40 L35 -40 Q40 -40 40 -35 L40 -31 Q40 -26 35 -26 L-35 -26 Q-40 -26 -40 -31 L-40 -35 Q-40 -40 -35 -40 Z " +
    "M-34 -23.5 L34 -23.5 L34 -15 Q34 -13 32 -13 L-32 -13 Q-34 -13 -34 -15 Z",
  accent: "M-32 -7 L32 -7 Q35 -7 35 -4 Q35 -1 32 -1 L-32 -1 Q-35 -1 -35 -4 Q-35 -7 -32 -7 Z",
  accentSpan: [-7, -1],
  gesture: stamp(14),
};

/** A delivery truck facing left: cab with a window, the cargo box, wheels as the accent. It pulls up. */
export const TRUCK: GlyphShape = {
  body:
    "M-46 -38 L-37 -54 Q-35 -57 -32 -57 L-19 -57 L-19 -20 L-43 -20 Q-46 -20 -46 -23 Z " +
    "M-41 -40 L-35 -51 L-24 -51 L-24 -40 Z " +
    "M-15 -72 L42 -72 Q46 -72 46 -68 L46 -24 Q46 -20 42 -20 L-15 -20 Z",
  accent: "M-30 -22 A9 9 0 1 1 -30 -4 A9 9 0 1 1 -30 -22 Z M30 -22 A9 9 0 1 1 30 -4 A9 9 0 1 1 30 -22 Z",
  accentSpan: [-22, -4],
  gesture: pullUp(110),
};
