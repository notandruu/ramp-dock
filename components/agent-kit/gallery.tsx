"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cascade, playTrack, readSlow, widgetEntrance, type Gesture } from "./motion";
import { BELL, BILL, BOX, CARD, STAMP, TRUCK, Widget, type GlyphShape } from "./widget";
import { ApprovalCard, ChartCard, ContactRow, Dim, ListCard, MatchCard, MeterWidget, PlanCard, ReplyChips, TrackerCard, WaitingWidget } from "./cards";

type Item = { name: string; card: ReactNode; gesture?: Gesture };

const glyph = (name: string, g: GlyphShape, value: string, unit: string | undefined, caption: string): Item => ({
  name,
  gesture: g.gesture,
  card: <Widget glyph={g} value={value} unit={unit} caption={caption} />,
});

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "Small",
    items: [
      glyph("Reminder: the bell rings", BELL, "4", "PM", "Thu - Deck to Sam"),
      glyph("Card spend: tapped", CARD, "$60", undefined, "Dana - Tools"),
      glyph("Bills paid: prints out", BILL, "3", "paid", "Bills - $8,410 in all"),
      glyph("Approved: stamped", STAMP, "OK", undefined, "Laptop for Priya"),
      glyph("Delivered: box dropped in", BOX, "40", "sheets", "Drywall - Elm St"),
      glyph("On the way: truck pulls up", TRUCK, "10", "AM", "Ridgeline - Elm St"),
      { name: "Budget left: the bar fills to what's left", card: <MeterWidget title="Office snacks" value="$240" left={0.24} note="of $1,000 for May" /> },
      { name: "Waiting on you: faces pop in", card: <WaitingWidget title="Approvals for you" count="3" people={["DK", "SR", "PL"]} /> },
    ],
  },
  {
    title: "Medium",
    items: [
      {
        name: "Delivery: line fills to where it is",
        card: <TrackerCard title="Drywall to Elm St" time="10:40" unit="AM" status="On the truck" steps={["Ordered", "Packed", "On the truck", "Here"]} at={2} />,
      },
      {
        name: "Spend: weeks grow in",
        card: <ChartCard title="Spent in May" total="$12,480" note="$2,100 less than April" weeks={[2100, 3400, 2600, 3900, 2900, 1800]} />,
      },
      {
        name: "Slip and bill agree: the check draws",
        card: (
          <MatchCard
            title="Drywall for Elm St"
            papers={[
              ["Delivery slip", "40 sheets"],
              ["Bill", "40 sheets"],
            ]}
          >
            They match<Dim>, so</Dim> $2,180 <Dim>gets paid</Dim> Friday<Dim>.</Dim>
          </MatchCard>
        ),
      },
      {
        name: "Plan: holds still, like the clip's calendar",
        card: (
          <div style={{ width: 354 }}>
            <PlanCard tile={{ label: "Fri", value: "12" }} title="Drywall for Elm St">
              40 sheets <Dim>from</Dim> Ridgeline <Dim>by</Dim> 10am<Dim>,</Dim>
              <br />
              <Dim>then</Dim> Marco snaps the slip<Dim>.</Dim>
            </PlanCard>
          </div>
        ),
      },
    ],
  },
  {
    title: "Large",
    items: [
      {
        name: "Ask to buy: price, budget fills, answers",
        card: <ApprovalCard who="Dana" initials="DK" what="A laptop for the new hire" price="$1,299" budget="Team budget after this" left="$3,701 of $5,000"
            used={0.26}
            facts={[
              ["From", "Apple, ships Tuesday"],
              ["For", "Priya, starts Monday"],
            ]}
          />,
      },
      {
        name: "Order: written out line by line",
        card: (
          <ListCard
            tile={{ label: "Fri", value: "12" }}
            title="Kitchen order"
            note="Harbor Produce, by 7am"
            lines={[
              ["Romaine", "6 cases", "$108"],
              ["Lemons", "2 boxes", "$64"],
              ["Olive oil", "4 tins", "$152"],
              ["Chicken thighs", "40 lb", "$136"],
              ["To-go cups", "2 sleeves", "$38"],
            ]}
            total="$498"
          />
        ),
      },
    ],
  },
  {
    title: "In the thread",
    items: [
      { name: "Vendor", card: <ContactRow initials="RL" name="Ridgeline Lumber" detail="Paid in 30 days - 12 orders this year" /> },
      { name: "Vendor", card: <ContactRow initials="HP" name="Harbor Produce" detail="Comes Tue and Fri - last order $498" /> },
      { name: "Tap instead of typing: one at a time", card: <ReplyChips options={["Approve", "Ask Sam first", "Not now"]} /> },
    ],
  },
];

/** Each card lands this many frames after the one before it. */
const STAGGER = 14;

/** Every card in the kit, landing one after another with the clip's entrance and only honest motion. */
export function WidgetGallery() {
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    readSlow();
    const items = SECTIONS.flatMap((s) => s.items);
    const anims = cards.current.flatMap((card, i) => {
      if (!card) return [];
      const start = 12 + i * STAGGER;
      const e = widgetEntrance(start, items[i]?.gesture);
      return [
        playTrack(card, e.card),
        ...Object.entries(e.parts).flatMap(([part, t]) => {
          const node = card.querySelector(`[data-part=${part}]`);
          return node ? [playTrack(node, t)] : [];
        }),
        ...cascade(card, start).map(([node, t]) => playTrack(node, t, "both")),
      ];
    });
    return () => anims.forEach((a) => a.cancel());
  }, [run]);

  let n = 0;
  return (
    <div className="font-ios flex w-full max-w-[1180px] flex-col gap-14">
      {SECTIONS.map((s) => (
        <section key={s.title} className="flex flex-col gap-5">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#8a8a8a]">{s.title}</h2>
          <div className="flex flex-wrap items-start gap-x-8 gap-y-10">
            {s.items.map((item) => {
              const i = n++;
              return (
                <figure key={i} className="flex flex-col gap-3">
                  <div
                    ref={(node) => {
                      cards.current[i] = node;
                    }}
                    style={{ opacity: 0 }}
                  >
                    {item.card}
                  </div>
                  <figcaption className="max-w-[354px] text-[12.5px] text-[#8a8a8a]">{item.name}</figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
      <button onClick={() => setRun((k) => k + 1)} className="self-center rounded-full bg-[#0c0c0c] px-5 py-2 text-[14px] text-white">
        Replay
      </button>
    </div>
  );
}
