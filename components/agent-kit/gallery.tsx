"use client";

import { useEffect, useRef, useState } from "react";
import { playTrack, readSlow, widgetEntrance } from "./motion";
import { BELL, BILL, BOX, Widget, glyphPose, type GlyphShape } from "./widget";

const WIDGETS: { name: string; glyph: GlyphShape; value: string; unit?: string; caption: string }[] = [
  { name: "Reminder", glyph: BELL, value: "4", unit: "PM", caption: "Thu - Deck to Sam" },
  { name: "Delivery", glyph: BOX, value: "40", unit: "sheets", caption: "Drywall - Elm St" },
  { name: "Bills paid", glyph: BILL, value: "3", unit: "paid", caption: "Bills - $8,410 in all" },
];

/** Each widget lands this many frames after the one before it. */
const STAGGER = 24;

/** Every widget in the kit, landing one after another with the same entrance as the clip's card. */
export function WidgetGallery() {
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const glyphs = useRef<(SVGGElement | null)[]>([]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    readSlow();
    const anims = WIDGETS.flatMap((_, i) => {
      const card = cards.current[i];
      const glyph = glyphs.current[i];
      if (!card || !glyph) return [];
      const e = widgetEntrance(12 + i * STAGGER, glyphPose);
      return [playTrack(card, e.card), playTrack(glyph, e.glyph)];
    });
    return () => anims.forEach((a) => a.cancel());
  }, [run]);

  return (
    <div className="font-ios flex flex-col items-center gap-10">
      <div className="flex flex-wrap justify-center gap-12">
        {WIDGETS.map((w, i) => (
          <figure key={w.name} className="flex flex-col items-center gap-4">
            <div style={{ transform: "scale(1.6)", transformOrigin: "top center", height: 158 * 1.6, width: 158 * 1.6, display: "flex", justifyContent: "center" }}>
              <div
                ref={(n) => {
                  cards.current[i] = n;
                }}
                style={{ opacity: 0 }}
              >
                <Widget
                  glyph={w.glyph}
                  value={w.value}
                  unit={w.unit}
                  caption={w.caption}
                  glyphRef={(n) => {
                    glyphs.current[i] = n;
                  }}
                />
              </div>
            </div>
            <figcaption className="text-[13px] text-[#8a8a8a]">{w.name}</figcaption>
          </figure>
        ))}
      </div>
      <button onClick={() => setRun((n) => n + 1)} className="rounded-full bg-[#0c0c0c] px-5 py-2 text-[14px] text-white">
        Replay
      </button>
    </div>
  );
}
