"use client";

import { useEffect, useRef, useState } from "react";
import { playTrack, readSlow, widgetEntrance } from "./motion";
import { BELL, BILL, BOX, CARD, Dim, PlanCard, STAMP, TRUCK, Widget, WIDGET_SIZE, type GlyphShape } from "./widget";

const WIDGETS: { name: string; glyph: GlyphShape; value: string; unit?: string; caption: string }[] = [
  { name: "Reminder: the bell rings", glyph: BELL, value: "4", unit: "PM", caption: "Thu - Deck to Sam" },
  { name: "Card: tapped like at a reader", glyph: CARD, value: "$60", caption: "Dana - Tools" },
  { name: "Bill paid: prints out", glyph: BILL, value: "3", unit: "paid", caption: "Bills - $8,410 in all" },
  { name: "Approved: stamped", glyph: STAMP, value: "OK", caption: "Laptop for Priya" },
  { name: "Delivered: box dropped in", glyph: BOX, value: "40", unit: "sheets", caption: "Drywall - Elm St" },
  { name: "On the way: truck pulls up", glyph: TRUCK, value: "10", unit: "AM", caption: "Ridgeline - Elm St" },
];

/** Each widget lands this many frames after the one before it. */
const STAGGER = 20;
const ZOOM = 1.4;

/** Every widget in the kit, landing one after another with the clip's entrance and its own gesture. */
export function WidgetGallery() {
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    readSlow();
    const anims = cards.current.flatMap((card, i) => {
      if (!card) return [];
      const e = widgetEntrance(12 + i * STAGGER, WIDGETS[i]?.glyph.gesture);
      return [
        playTrack(card, e.card),
        ...Object.entries(e.parts).map(([part, t]) =>
          playTrack(card.querySelector(`[data-part=${part}]`)!, t),
        ),
      ];
    });
    return () => anims.forEach((a) => a.cancel());
  }, [run]);

  const land = (i: number) => (n: HTMLDivElement | null) => {
    cards.current[i] = n;
  };

  return (
    <div className="font-ios flex flex-col items-center gap-12">
      <div className="flex flex-wrap justify-center gap-12">
        {WIDGETS.map((w, i) => (
          <figure key={w.name} className="flex flex-col items-center gap-4">
            <div
              style={{ width: WIDGET_SIZE * ZOOM, height: WIDGET_SIZE * ZOOM }}
            >
              <div
                style={{
                  transform: `scale(${ZOOM})`,
                  transformOrigin: "0 0",
                  width: WIDGET_SIZE,
                }}
              >
                <div ref={land(i)} style={{ opacity: 0 }}>
                  <Widget
                    glyph={w.glyph}
                    value={w.value}
                    unit={w.unit}
                    caption={w.caption}
                  />
                </div>
              </div>
            </div>
            <figcaption className="text-[13px] text-[#8a8a8a]">
              {w.name}
            </figcaption>
          </figure>
        ))}
      </div>
      <figure className="flex flex-col items-center gap-4">
        <div style={{ width: 354 * ZOOM, height: 188 * ZOOM }}>
          <div
            style={{
              transform: `scale(${ZOOM})`,
              transformOrigin: "0 0",
              width: 354,
            }}
          >
            <div ref={land(WIDGETS.length)} style={{ opacity: 0 }}>
              <PlanCard
                tile={{ label: "Fri", value: "12" }}
                title="Drywall for Elm St"
              >
                40 sheets <Dim>from</Dim> Ridgeline <Dim>by</Dim> 10am
                <Dim>,</Dim>
                <br />
                <Dim>then</Dim> Marco snaps the slip<Dim>.</Dim>
              </PlanCard>
            </div>
          </div>
        </div>
        <figcaption className="text-[13px] text-[#8a8a8a]">
          Plan card: holds still, like the clip&apos;s calendar
        </figcaption>
      </figure>
      <button
        onClick={() => setRun((n) => n + 1)}
        className="rounded-full bg-[#0c0c0c] px-5 py-2 text-[14px] text-white"
      >
        Replay
      </button>
    </div>
  );
}
