"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { F, cascade, readSlow, widgetEntrance, type Gesture, type Track } from "./agent-kit/motion";
import { BELL, BILL, BOX, CARD, STAMP, TRUCK, Widget, type GlyphShape } from "./agent-kit/widget";
import { ApprovalCard, ChartCard, ContactRow, Dim, ListCard, MatchCard, MeterWidget, PlanCard, ReplyChips, TrackerCard, WaitingWidget } from "./agent-kit/cards";
import { Composer, Header, PhoneFrame, Sent, StatusBar, THEM_GRAY, Tail, Them, fitScale } from "./agent-kit/phone";
import { FLIGHT_FRAMES, MIC_BACK, flight, replyMorph, scroll, sendButtonIn, sendButtonOut, typingIn } from "./agent-kit/thread";
import { RampMark } from "./phone";

/*
 * A walk through every card the agent can send, as one text thread with Ramp: order drywall, get it
 * approved, track it, check the slip against the bill, pay it, look at spend, reorder for the kitchen,
 * approve a laptop and set a reminder. Every move is the clip's (see agent-kit); the script only says
 * what happens in what order. `/lab/demo?slow=4` slows it down, `window.__demoSeek(frame)` freezes it,
 * and `?record` plays it once at full size for recording.
 */

type Card = { node: ReactNode; gesture?: Gesture };
type Step = { me: string } | { them: ReactNode } | { day: string } | { cards: Card[] };

const glyph = (g: GlyphShape, value: string, unit: string | undefined, caption: string): Card => ({
  node: <Widget glyph={g} value={value} unit={unit} caption={caption} />,
  gesture: g.gesture,
});

const SCRIPT: Step[] = [
  { day: "Today 7:58 AM" },
  { me: "drywall for Elm St, 40 sheets" },
  { them: "Ridgeline has 40 sheets for $2,180. They can drop them off Friday by 10am." },
  { cards: [{ node: <ContactRow initials="RL" name="Ridgeline Lumber" detail="Paid in 30 days - 12 orders this year" /> }] },
  { cards: [{ node: <ReplyChips options={["Order it", "Find cheaper", "Not now"]} /> }] },
  { me: "order it" },
  { them: "Ordered. It's over $2,000, so I got Sam's OK first." },
  { cards: [glyph(STAMP, "OK", undefined, "Sam - Drywall")] },
  {
    cards: [
      {
        node: (
          <PlanCard tile={{ label: "Fri", value: "12" }} title="Drywall for Elm St">
            40 sheets <Dim>from</Dim> Ridgeline <Dim>by</Dim> 10am<Dim>,</Dim>
            <br />
            <Dim>then</Dim> Marco snaps the slip<Dim>.</Dim>
          </PlanCard>
        ),
      },
    ],
  },
  { day: "Friday 9:12 AM" },
  { them: "Ridgeline is on the way." },
  { cards: [glyph(TRUCK, "10", "AM", "Ridgeline - Elm St")] },
  { cards: [{ node: <TrackerCard title="Drywall to Elm St" time="10:40" unit="AM" status="On the truck" steps={["Ordered", "Packed", "On the truck", "Here"]} at={2} /> }] },
  { me: "dropped off, here's the slip" },
  { them: "Got it. The slip and the bill both say 40 sheets." },
  {
    cards: [
      {
        node: (
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
    ],
  },
  { cards: [glyph(BOX, "40", "sheets", "Drywall - Elm St"), glyph(BILL, "1", "paid", "Ridgeline - $2,180")] },
  { day: "Monday 8:30 AM" },
  { me: "what did we spend this month" },
  { them: "$12,480 so far, $2,100 less than April." },
  { cards: [{ node: <ChartCard title="Spent in May" total="$12,480" note="$2,100 less than April" weeks={[2100, 3400, 2600, 3900, 2900, 1800]} /> }] },
  {
    cards: [
      { node: <MeterWidget title="Office snacks" value="$240" left={0.24} note="of $1,000 for May" /> },
      { node: <WaitingWidget title="Approvals for you" count="2" people={["DK", "PL"]} /> },
    ],
  },
  { me: "the usual kitchen order" },
  { them: "Same as last Friday, from Harbor Produce." },
  {
    cards: [
      {
        node: (
          <ListCard
            tile={{ label: "Fri", value: "19" }}
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
  { them: "Also, Dana wants a laptop for the new hire." },
  {
    cards: [
      {
        node: (
          <ApprovalCard
            who="Dana"
            initials="DK"
            what="A laptop for the new hire"
            price="$1,299"
            budget="Team budget after this"
            left="$3,701 of $5,000"
            used={0.26}
            facts={[
              ["From", "Apple, ships Tuesday"],
              ["For", "Priya, starts Monday"],
            ]}
          />
        ),
      },
    ],
  },
  { me: "approve it" },
  { them: "Approved. Dana can buy it on her Ramp card now." },
  { cards: [glyph(CARD, "1", "card", "Dana - up to $1,299")] },
  { me: "nudge me thu to pay Harbor" },
  { them: "Done. I'll nudge you Thursday at 4." },
  { cards: [glyph(BELL, "4", "PM", "Thu - Pay Harbor")] },
];

/* Pacing, in frames at 60fps. The moves come from the clip; how long people take between them is ours. */
const KEY = 3; // per character typed
const BEFORE_SEND = 16; // a beat after the last key
const AFTER_SEND = FLIGHT_FRAMES + 14;
const DOTS_AFTER = 18; // the agent starts typing
const DOTS_FOR = 64; // and types for this long
const AFTER_REPLY = 26;
const CARD_AFTER = 12;
const PAIR_GAP = 8; // a second small card lands this long after the first
const DAY_FOR = 30;
const END_HOLD = 150;

/** The bottom of what the thread shows above the field. */
const VISIBLE_BOTTOM = 742;

export function AgentDemo() {
  const [scale, setScale] = useState(1);
  const [record, setRecord] = useState<boolean | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const composer = {
    typed: useRef<HTMLSpanElement>(null),
    placeholder: useRef<HTMLSpanElement>(null),
    mic: useRef<SVGSVGElement>(null),
    sendBtn: useRef<HTMLDivElement>(null),
    sendArrow: useRef<SVGSVGElement>(null),
    sendMic: useRef<SVGSVGElement>(null),
  };

  useEffect(() => setRecord(new URLSearchParams(location.search).has("record")), []);

  useEffect(() => {
    if (record !== false) return;
    const fit = () => setScale(fitScale());
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [record]);

  useEffect(() => {
    if (record === null) return;
    if (record) document.querySelector("main")?.setAttribute("style", "padding:0;align-items:flex-start;justify-content:flex-start;background:#fff");
    const thread = content.current!;
    const c = Object.fromEntries(Object.entries(composer).map(([k, v]) => [k, v.current!])) as { [K in keyof typeof composer]: NonNullable<(typeof composer)[K]["current"]> };
    let timers: number[] = [];
    let anims: Animation[] = [];
    let from = 0;
    let frozen = false;
    const at = (frame: number, fn: () => void) => {
      if (frame <= from) fn();
      else if (!frozen) timers.push(window.setTimeout(fn, F(frame - from)));
    };
    const play = (node: Element, t: Track, fill: FillMode = "forwards") => {
      const a = node.animate(t.keyframes, { delay: t.delay, duration: t.duration, easing: "linear", fill });
      a.currentTime = F(from);
      if (frozen) a.pause();
      anims.push(a);
    };
    const hide = (n: HTMLElement | SVGElement) => (n.style.visibility = "hidden");
    const show = (n: HTMLElement | SVGElement) => (n.style.visibility = "visible");

    function run(start = 0, freeze = false): number {
      from = start;
      frozen = freeze;
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      timers = [];
      anims = [];

      c.typed.textContent = "";
      show(c.placeholder);
      show(c.mic);
      c.sendBtn.style.opacity = "0";
      steps.current.forEach((s) => s && hide(s));

      // Keep whatever just landed above the field, scrolling on the clip's curve.
      let scrolled = 0;
      const reveal = (frame: number, bottom: number) => {
        const target = Math.max(0, bottom - VISIBLE_BOTTOM);
        if (target <= scrolled + 0.5) return;
        play(thread, scroll(frame, scrolled, target));
        scrolled = target;
      };
      const bottomOf = (node: HTMLElement, height = node.offsetHeight) => node.offsetTop + height;

      let f = 30;
      SCRIPT.forEach((step, i) => {
        const row = steps.current[i]!;

        if ("day" in step) {
          at(f, () => show(row));
          reveal(f, bottomOf(row));
          f += DAY_FOR;
        } else if ("me" in step) {
          const bubble = row.firstElementChild!.firstElementChild!;
          const typeAt = f;
          at(typeAt, () => {
            show(c.sendArrow);
            hide(c.sendMic);
          });
          [...step.me].forEach((_, k) =>
            at(typeAt + k * KEY, () => {
              c.typed.textContent = step.me.slice(0, k + 1);
              if (k === 0) {
                hide(c.placeholder);
                hide(c.mic);
              }
            }),
          );
          play(c.sendBtn, sendButtonIn(typeAt));
          const send = typeAt + step.me.length * KEY + BEFORE_SEND;
          at(send, () => {
            c.typed.textContent = "";
            show(c.placeholder);
            show(row);
          });
          reveal(send, bottomOf(row));
          play(bubble, flight(send));
          at(send + MIC_BACK, () => {
            hide(c.sendArrow);
            show(c.sendMic);
            show(c.mic);
          });
          play(c.sendBtn, sendButtonOut(send));
          f = send + AFTER_SEND;
        } else if ("them" in step) {
          const reply = row.firstElementChild!.firstElementChild as HTMLElement;
          const dots = row.children[1] as HTMLElement;
          const dotsInner = dots.firstElementChild!;
          const typing = f + DOTS_AFTER;
          at(typing, () => {
            show(row);
            hide(reply);
          });
          reveal(typing, bottomOf(row, 34));
          play(dots, typingIn(typing));
          const lands = typing + DOTS_FOR;
          at(lands, () => show(reply));
          const morph = replyMorph(lands, reply.offsetWidth, reply.offsetHeight);
          play(dotsInner, morph.dotsInner);
          play(dots, morph.dots);
          play(reply, morph.reply);
          reveal(lands, bottomOf(row));
          f = lands + AFTER_REPLY;
        } else {
          const lands = f + CARD_AFTER;
          at(lands, () => show(row));
          reveal(lands, bottomOf(row));
          let hold = 0;
          [...row.children].forEach((card, k) => {
            const start = lands + k * PAIR_GAP;
            const e = widgetEntrance(start, step.cards[k]?.gesture);
            play(card, e.card);
            for (const [part, t] of Object.entries(e.parts)) {
              const node = card.querySelector(`[data-part=${part}]`);
              if (node) play(node, t);
            }
            const cues = cascade(card, start);
            cues.forEach(([node, t]) => play(node, t, "both"));
            hold = Math.max(hold, k * PAIR_GAP + (step.cards[k]?.gesture ? 96 : 54 + cues.length * 6));
          });
          f = lands + hold;
        }
      });

      const length = f + END_HOLD;
      // The typing dots are a CSS loop; freeze them on the same clock when seeking.
      if (frozen)
        document.getAnimations().forEach((a) => {
          if (a instanceof CSSAnimation) {
            a.pause();
            a.currentTime = F(from);
          }
        });
      if (!record) at(length, () => run());
      return length;
    }

    readSlow();
    const length = run();
    const w = window as unknown as { __demoSeek?: (f?: number) => void; __demoLength?: number };
    w.__demoLength = length;
    w.__demoSeek = (frame) => void (frame === undefined ? run() : run(frame, true));
    return () => {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
    };
  }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PhoneFrame scale={scale}>
      <div ref={content} style={{ position: "absolute", inset: "0 0 auto 0", paddingTop: 150, paddingBottom: 40, willChange: "transform" }}>
        {SCRIPT.map((step, i) => {
          const ref = (n: HTMLDivElement | null) => {
            steps.current[i] = n;
          };
          if ("day" in step)
            return (
              <div key={i} ref={ref} style={{ marginTop: i ? 26 : 0, height: 16, lineHeight: "16px", textAlign: "center", fontSize: 12.5, color: "#a5a5a5" }}>
                {step.day}
              </div>
            );
          if ("me" in step)
            return (
              <div key={i} ref={ref} style={{ marginTop: 12 }}>
                <Sent>
                  <span style={{ display: "block", maxWidth: 262 }}>{step.me}</span>
                </Sent>
              </div>
            );
          if ("them" in step)
            return (
              <div key={i} ref={ref} style={{ position: "relative", marginTop: 14 }}>
                <Them ghost>
                  <span style={{ display: "block", maxWidth: 262 }}>{step.them}</span>
                </Them>
                <div style={{ position: "absolute", left: 20, top: 0, width: 61, height: 34, borderRadius: 17, background: THEM_GRAY, transformOrigin: "0% 100%" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: 61, height: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    {[0, 1, 2].map((k) => (
                      <span key={k} className="agent-dot" style={{ width: 7.6, height: 7.6, borderRadius: 4, background: "#8e8e8e", animationDelay: `${0.06 + k * 0.32}s` }} />
                    ))}
                  </div>
                  <Tail side="left" color={THEM_GRAY} />
                </div>
              </div>
            );
          return (
            <div key={i} ref={ref} style={{ marginTop: 13.5, padding: "0 19px 0 20px", display: "flex", gap: 12 }}>
              {step.cards.map((card, k) => (
                <div key={k} style={step.cards.length === 1 ? { flex: 1 } : undefined}>
                  {card.node}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <Header name="Ramp" logo={<RampMark size={26} />} />
      <StatusBar />
      <Composer refs={composer} />
    </PhoneFrame>
  );
}
