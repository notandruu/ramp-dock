"use client";

import { useEffect, useRef, useState } from "react";
import { F, readSlow, track, widgetEntrance } from "./agent-kit/motion";
import { MIC_BACK, flight, replyMorph, scroll, sendButtonIn, sendButtonOut, typingIn } from "./agent-kit/thread";
import { BELL, Widget } from "./agent-kit/widget";
import { Dim, PlanCard } from "./agent-kit/cards";
import { Composer, Header, PhoneFrame, SCROLL_PT, Sent, StatusBar, THEM_GRAY, Tail, Them, fitScale } from "./agent-kit/phone";

/*
 * A 1:1 rebuild of the "Text your agent" iPhone clip (8.45s, 60fps), from the foundations.
 * Every number here was measured off the video frame by frame:
 *   - the phone screen is 708 x 1533 px in the clip, an iPhone 16 Pro at 1.8015 px per pt,
 *     so all sizes below are iOS points and the screen is 393 x 852
 *   - every event is keyed to the clip's frame number at 60fps (see `F`)
 * Pure CSS + Web Animations, no libraries.
 */

const CYCLE = 507; // the clip is 8.45s; it loops back to frame 0

const MESSAGE = "Remind me to send Sam the deck";
// Frame each character lands on. Spaces were interpolated; every other key was read off the clip.
const KEY_FRAMES = [4, 7, 11, 14, 17, 19, 24, 28, 31, 36, 40, 45, 50, 55, 57, 61, 65, 70, 74, 77, 79, 85, 90, 93, 98, 102, 106, 110, 113, 116];
const SEND = 150;

function CalendarCard() {
  return (
    <div style={{ margin: "14px 19px 0 20px" }}>
      <PlanCard tile={{ label: "Sat", value: "10" }} title="Mom's birthday">
        Market with Mom <Dim>at</Dim> 11am<Dim>,</Dim> lunch <Dim>at</Dim> 1pm
        <Dim>,</Dim>
        <br />
        <Dim>then</Dim> call Mom <Dim>at</Dim> 5:55pm<Dim>.</Dim>
      </PlanCard>
    </div>
  );
}

/* ---------- the clip ---------- */

export function AgentReplica() {
  const [scale, setScale] = useState(1);
  const r = {
    content: useRef<HTMLDivElement>(null),
    typed: useRef<HTMLSpanElement>(null),
    placeholder: useRef<HTMLSpanElement>(null),
    mic: useRef<SVGSVGElement>(null),
    sendBtn: useRef<HTMLDivElement>(null),
    sendArrow: useRef<SVGSVGElement>(null),
    sendMic: useRef<SVGSVGElement>(null),
    sent: useRef<HTMLDivElement>(null),
    dots: useRef<HTMLDivElement>(null),
    dotsInner: useRef<HTMLDivElement>(null),
    reply: useRef<HTMLDivElement>(null),
    card: useRef<HTMLDivElement>(null),
  };

  // Fit the 852pt-tall phone (plus its frame) in the window.
  useEffect(() => {
    const fit = () => setScale(fitScale());
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const el = Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v.current])) as {
      [K in keyof typeof r]: NonNullable<(typeof r)[K]["current"]>;
    };
    let timers: number[] = [];
    let anims: Animation[] = [];
    // `from` lets the timeline start mid-clip; `frozen` holds it there (used to compare against the clip).
    let from = 0;
    let frozen = false;
    const at = (frame: number, fn: () => void) => {
      if (frame <= from) fn();
      else if (!frozen) timers.push(window.setTimeout(fn, F(frame - from)));
    };
    const play = (node: Element, t: ReturnType<typeof track>, easing = "linear") => {
      const a = node.animate(t.keyframes, { delay: t.delay, duration: t.duration, easing, fill: "forwards" });
      a.currentTime = F(from);
      if (frozen) a.pause();
      anims.push(a);
    };

    const hide = (n: HTMLElement | SVGElement) => (n.style.visibility = "hidden");
    const show = (n: HTMLElement | SVGElement) => (n.style.visibility = "visible");

    function run(start = 0, freeze = false) {
      from = start;
      frozen = freeze;
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      timers = [];
      anims = [];

      // Frame 0: empty input with the mic, thread as it starts in the clip.
      el.typed.textContent = "";
      show(el.placeholder);
      show(el.mic);
      [el.sent, el.dots, el.reply, el.card].forEach(hide);
      el.sendBtn.style.opacity = "0";
      show(el.sendArrow);
      hide(el.sendMic);

      // Typing, one key at a time on the clip's frames.
      KEY_FRAMES.forEach((f, i) =>
        at(f, () => {
          el.typed.textContent = MESSAGE.slice(0, i + 1);
          if (i === 0) {
            hide(el.placeholder);
            hide(el.mic);
          }
        }),
      );
      // The send button blurs in as the first key lands.
      play(el.sendBtn, sendButtonIn(4));

      // Send: the text leaves the field, the bubble rises out from behind the frosted input.
      at(SEND, () => {
        el.typed.textContent = "";
        show(el.placeholder);
        show(el.sent);
      });
      play(el.sent, flight(SEND));
      at(SEND + MIC_BACK, () => {
        hide(el.sendArrow);
        show(el.sendMic);
        show(el.mic);
      });
      play(el.sendBtn, sendButtonOut(SEND));

      // The agent starts typing.
      at(203, () => show(el.dots));
      play(el.dots, typingIn(203));

      // The dots bubble becomes the reply. On frame 294 it is already the reply's size, blurred and about
      // 8pt low; it springs up into place by 303. The words sit on top and clear a beat behind the bubble.
      at(294, () => show(el.reply));
      const morph = replyMorph(294, el.reply.offsetWidth, el.reply.offsetHeight);
      play(el.dotsInner, morph.dotsInner);
      play(el.dots, morph.dots);
      play(el.reply, morph.reply);

      // The reminder card lands and the thread scrolls it into view.
      at(378, () => show(el.card));
      // The reminder widget lands: the card blurs in and its bell rings.
      const widget = widgetEntrance(378, BELL.gesture);
      play(el.card, widget.card);
      for (const [part, t] of Object.entries(widget.parts)) {
        const node = el.card.querySelector(`[data-part=${part}]`);
        if (node) play(node, t);
      }
      play(el.content, scroll(380, 0, SCROLL_PT));
      at(CYCLE, () => run());
    }

    readSlow();
    run();
    (window as unknown as { __agentSeek?: (f?: number) => void }).__agentSeek = (f) => (f === undefined ? run() : run(f, true));
    return () => {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PhoneFrame scale={scale}>
      {/* Thread, top-aligned like iMessage with little history. */}
      <div ref={r.content} style={{ position: "absolute", inset: "0 0 auto 0", willChange: "transform" }}>
        <Sent style={{ paddingTop: 27 }}>
          Plan Saturday with Mom. She hates
          <br />
          feeling rushed
        </Sent>
        <Them style={{ marginTop: 14 }}>
          Here&apos;s a version where you&apos;re
          <br />
          never rushed. I left a gap before
          <br />
          lunch in case traffic is bad.
        </Them>
        <CalendarCard />
        <div style={{ marginTop: 26, height: 16, lineHeight: "16px", textAlign: "center", fontSize: 12.5, color: "#a5a5a5" }}>Today</div>
        <Sent style={{ marginTop: 12 }} innerRef={r.sent}>
          {MESSAGE}
        </Sent>
        <div style={{ position: "relative", marginTop: 14.4 }}>
          <Them innerRef={r.reply} ghost>
            Done. I&apos;ll nudge you Thursday at
            <br />
            4, and I&apos;ve attached the latest
            <br />
            version.
          </Them>
          {/* Typing indicator, in the reply's slot. */}
          <div
            ref={r.dots}
            style={{
              position: "absolute",
              left: 20,
              top: 0,
              width: 61,
              height: 34,
              borderRadius: 17,
              background: THEM_GRAY,
              transformOrigin: "0% 100%",
            }}
          >
            <div
              ref={r.dotsInner}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 61,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="agent-dot"
                  style={{ width: 7.6, height: 7.6, borderRadius: 4, background: "#8e8e8e", animationDelay: `${0.06 + i * 0.32}s` }}
                />
              ))}
            </div>
            <Tail side="left" color={THEM_GRAY} />
          </div>
        </div>
        <div ref={r.card} style={{ marginTop: 13.5, paddingLeft: 20 }}>
          <Widget glyph={BELL} value="4" unit="PM" caption="Thu - Deck to Sam" />
        </div>
      </div>

      <Header />
      <StatusBar />

      {/* Frosted input: the sent bubble starts behind it, which is why it rises out blurred. */}
      <Composer refs={r} />
    </PhoneFrame>
  );
}
