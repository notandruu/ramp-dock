"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/*
 * A 1:1 rebuild of the "Text your agent" iPhone clip (8.45s, 60fps), from the foundations.
 * Every number here was measured off the video frame by frame:
 *   - the phone screen is 708 x 1533 px in the clip, an iPhone 16 Pro at 1.8015 px per pt,
 *     so all sizes below are iOS points and the screen is 393 x 852
 *   - every event is keyed to the clip's frame number at 60fps (see `F`)
 * Pure CSS + Web Animations, no libraries.
 */

const F = (frame: number) => (frame * 1000) / 60;
const CYCLE = 507; // the clip is 8.45s; it loops back to frame 0

const MESSAGE = "Remind me to send Sam the deck";
// Frame each character lands on. Spaces were interpolated; every other key was read off the clip.
const KEY_FRAMES = [4, 7, 11, 14, 17, 19, 24, 28, 31, 36, 40, 45, 50, 55, 57, 61, 65, 70, 74, 77, 79, 85, 90, 93, 98, 102, 106, 110, 113, 116];
const SEND = 150;

const SENT_BLUE = "#83b2e6";
const THEM_GRAY = "#eeeeee";
const SCREEN = "#fdfdfd";

/* ---------- measured motion ---------- */

/**
 * The sent bubble's flight, per frame: its bottom edge in clip px (the settled bubble ends at 992)
 * and its scale (height / settled height). It starts behind the frosted input, rises, overshoots
 * about 6pt and settles. Origin is bottom right: the right edge never moves.
 */
const FLIGHT: [frame: number, bottom: number, scale: number, opacity: number][] = [
  [150, 1555, 0.68, 0.55],
  [152, 1550, 0.68, 0.6],
  [153, 1495, 0.7, 0.8],
  [154, 1441, 0.71, 1],
  [155, 1387, 0.74, 1],
  [156, 1333, 0.78, 1],
  [157, 1279, 0.8, 1],
  [158, 1231, 0.84, 1],
  [159, 1187, 0.88, 1],
  [160, 1147, 0.9, 1],
  [161, 1111, 0.92, 1],
  [162, 1083, 0.94, 1],
  [163, 1059, 0.96, 1],
  [164, 1037, 0.97, 1],
  [165, 1023, 0.985, 1],
  [166, 1010, 0.99, 1],
  [167, 1000, 1, 1],
  [168, 993, 1, 1],
  [169, 987, 1, 1],
  [170, 984, 1, 1],
  [171, 982, 1, 1],
  [172, 981, 1, 1],
  [175, 981, 1, 1],
  [178, 983, 1, 1],
  [181, 987, 1, 1],
  [184, 989, 1, 1],
  [186, 991, 1, 1],
  [192, 992, 1, 1],
];

/** The thread scroll when the card lands: progress per frame from 381 to 397 (111pt total). */
const SCROLL = [0, 0.02, 0.16, 0.25, 0.35, 0.44, 0.53, 0.62, 0.69, 0.76, 0.81, 0.86, 0.9, 0.93, 0.96, 0.98, 0.99, 1];
const SCROLL_PT = 111;

const PX_PER_PT = 1.8015;

/** Keyframes with offsets from absolute frame numbers. */
function track<T extends Record<string, string | number>>(points: [number, T][]) {
  const start = points[0][0];
  const end = points[points.length - 1][0];
  return {
    keyframes: points.map(([f, k]) => ({ ...k, offset: (f - start) / (end - start) })),
    delay: F(start),
    duration: F(end - start),
  };
}

/** Blur-in used by the send button, the dots, the reply and the card. */
function blurIn(points: [frame: number, blur: number, opacity: number, scale?: number][]) {
  return track(
    points.map(([f, blur, opacity, scale = 1]) => [
      f,
      { filter: `blur(${blur}px)`, opacity, transform: `scale(${scale})` },
    ]),
  );
}

/* ---------- pieces ---------- */

function Tail({ side, color }: { side: "left" | "right"; color: string }) {
  // The little hook under the last bubble of a run, measured at about 16 x 9pt.
  const style: CSSProperties =
    side === "right"
      ? { position: "absolute", right: -4, bottom: -1, transform: "scaleX(-1)" }
      : { position: "absolute", left: -4, bottom: -1 };
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" style={style} aria-hidden="true">
      <path d="M6 0 C6 7 4 12 0 16 C7 15 12 12 15 7 Z" fill={color} />
    </svg>
  );
}

function Sent({ children, style, innerRef }: { children: ReactNode; style?: CSSProperties; innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px", ...style }}>
      <div
        ref={innerRef}
        style={{
          position: "relative",
          background: SENT_BLUE,
          color: "#fff",
          borderRadius: 22,
          padding: "11px 14.5px",
          fontSize: 17,
          lineHeight: "21px",
          letterSpacing: -0.2,
          transformOrigin: "100% 100%",
          willChange: "transform",
        }}
      >
        {children}
        <Tail side="right" color={SENT_BLUE} />
      </div>
    </div>
  );
}

function Them({ children, style, innerRef }: { children: ReactNode; style?: CSSProperties; innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div style={{ display: "flex", padding: "0 20px", ...style }}>
      <div
        ref={innerRef}
        style={{
          position: "relative",
          background: THEM_GRAY,
          color: "#0c0c0c",
          borderRadius: 20,
          padding: "9px 15px",
          fontSize: 17,
          lineHeight: "21px",
          letterSpacing: -0.2,
        }}
      >
        {children}
        <Tail side="left" color={THEM_GRAY} />
      </div>
    </div>
  );
}

const softCard: CSSProperties = {
  background: "#f7f7f7",
  border: "1px solid #ececec",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 6px 16px rgba(0,0,0,0.04)",
};

function CalendarCard() {
  const gray = { color: "#8a8a8a" };
  return (
    <div style={{ margin: "14px 19px 0 20px", height: 188, borderRadius: 20, position: "relative", ...softCard }}>
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 16.5,
          width: 71,
          height: 77,
          borderRadius: 9,
          overflow: "hidden",
          background: "linear-gradient(180deg, #84b8f9 0%, #b7d6fc 100%)",
          boxShadow: "0 2px 4px rgba(40,90,160,0.25)",
        }}
      >
        <div
          style={{
            height: 25,
            background: "linear-gradient(180deg, #6ba8f6, #7cb3f8)",
            borderBottom: "1px solid rgba(60,120,200,0.35)",
            color: "#fff",
            fontSize: 12.5,
            textAlign: "center",
            lineHeight: "25px",
          }}
        >
          Sat
        </div>
        <div style={{ color: "#fff", fontSize: 40, fontWeight: 300, textAlign: "center", lineHeight: "50px", letterSpacing: -1 }}>10</div>
      </div>
      <div style={{ position: "absolute", left: 102.5, top: 18, fontSize: 17, color: "#6e6e6e" }}>Mom&apos;s birthday</div>
      <div style={{ position: "absolute", left: 18, top: 108, fontSize: 17, lineHeight: "20.5px", color: "#0c0c0c", letterSpacing: -0.2 }}>
        Market with Mom <span style={gray}>at</span> 11am<span style={gray}>,</span> lunch <span style={gray}>at</span> 1pm
        <span style={gray}>,</span>
        <br />
        <span style={gray}>then</span> call Mom <span style={gray}>at</span> 5:55pm<span style={gray}>.</span>
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 168.5, display: "flex", gap: 4.4 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: "linear-gradient(180deg, #7db6fa, #9cc8fc)" }} />
        ))}
      </div>
    </div>
  );
}

function Bell() {
  return (
    <svg width="112" height="126" viewBox="0 0 96 108" aria-hidden="true" style={{ position: "absolute", left: 54, top: -36, transform: "rotate(27deg)", transformOrigin: "50% 60%" }}>
      <defs>
        <linearGradient id="bell-g" x1="0.85" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#6eaaf8" />
          <stop offset="1" stopColor="#b9d8fd" />
        </linearGradient>
        <linearGradient id="clap-g" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#9cc6fb" />
          <stop offset="1" stopColor="#5f9ff3" />
        </linearGradient>
      </defs>
      <path d="M48 4 C24 4 18 26 18 46 C18 62 12 72 4 80 L92 80 C84 72 78 62 78 46 C78 26 72 4 48 4 Z" fill="url(#bell-g)" />
      <path d="M36 88 A12 12 0 0 0 60 88 Z" fill="url(#clap-g)" />
    </svg>
  );
}

function ReminderCard() {
  return (
    <div style={{ width: 158, height: 158, borderRadius: 14.5, position: "relative", overflow: "hidden", ...softCard }}>
      <Bell />
      <div style={{ position: "absolute", left: 20, top: 74, display: "flex", alignItems: "baseline", gap: 3, color: "#0c0c0c" }}>
        <span style={{ fontSize: 42, lineHeight: "42px", letterSpacing: -1 }}>4</span>
        <span style={{ fontSize: 16 }}>PM</span>
      </div>
      <div style={{ position: "absolute", left: 20, top: 122, fontSize: 12.5, color: "#6e6e6e" }}>Thu - Deck to Sam</div>
    </div>
  );
}

function GlassButton({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 61.6,
        [side]: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        background: "rgba(252,252,252,0.62)",
        backdropFilter: "blur(10px) saturate(1.4)",
        WebkitBackdropFilter: "blur(10px) saturate(1.4)",
        border: "0.5px solid rgba(255,255,255,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07), inset 0 0 0 0.5px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{ position: "absolute", inset: "0 0 auto 0", height: 54, zIndex: 6 }}>
      <div style={{ position: "absolute", left: 34, top: 19, fontSize: 17, fontWeight: 600, letterSpacing: -0.3 }}>9:41</div>
      <div style={{ position: "absolute", left: 133.5, top: 11, width: 126, height: 37, borderRadius: 19, background: "#000" }} />
      <svg width="18" height="12" viewBox="0 0 18 12" style={{ position: "absolute", left: 309, top: 24 }} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.8} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.8" fill="#000" />
        ))}
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" style={{ position: "absolute", left: 332, top: 23.5 }} aria-hidden="true">
        <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="#000" strokeOpacity="0.35" />
        <rect x="2" y="2" width="19" height="9" rx="2" fill="#000" />
        <path d="M24.5 4.5 v4 a2 2 0 0 0 0 -4 Z" fill="#000" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

function Header() {
  return (
    <>
      {/* Content scrolling under the header blurs progressively and washes out toward the top. */}
      {[
        { blur: 2, stop: 100 },
        { blur: 5, stop: 78 },
        { blur: 12, stop: 58 },
      ].map((l) => (
        <div
          key={l.blur}
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 132,
            zIndex: 4,
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: `linear-gradient(to bottom, black ${l.stop - 30}%, transparent ${l.stop}%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black ${l.stop - 30}%, transparent ${l.stop}%)`,
            pointerEvents: "none",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 150,
          zIndex: 5,
          background: "linear-gradient(180deg, rgba(253,253,253,0.75) 0%, rgba(253,253,253,0.6) 70%, rgba(253,253,253,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none" }}>
        <GlassButton side="left">
          <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true">
            <path d="M10 2 L2 10 L10 18" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </GlassButton>
        <GlassButton side="right">
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
            {[1, 7, 13].map((y) => (
              <path key={y} d={`M1 ${y} H19`} stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round" />
            ))}
          </svg>
        </GlassButton>
        <div
          style={{
            position: "absolute",
            left: 162.6,
            top: 55.5,
            width: 68,
            height: 68,
            borderRadius: 34,
            background: "#fdfdfd",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 6,
          }}
        >
          <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true">
            <path d="M12 0 L24 18 H18.2 L12 8.6 L5.8 18 H0 Z" fill="#0c0c0c" />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: 155.4,
            top: 113.8,
            width: 82,
            height: 29.4,
            borderRadius: 15,
            background: "rgba(249,249,249,0.96)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            fontSize: 15,
            color: "#0c0c0c",
          }}
        >
          Acme
          <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">
            <path d="M1 1 L5 5 L1 9" fill="none" stroke="#8e8e93" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </>
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
    reply: useRef<HTMLDivElement>(null),
    card: useRef<HTMLDivElement>(null),
  };

  // Fit the 852pt-tall phone (plus its frame) in the window.
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 48) / 880, (window.innerWidth - 32) / 421));
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
      play(el.sendBtn, blurIn([[4, 6, 0, 0.4], [6, 5, 0.5, 0.7], [8, 3, 0.75, 0.95], [10, 1.5, 0.9, 1], [13, 0, 1, 1]]));

      // Send: the text leaves the field, the bubble rises out from behind the frosted input.
      at(SEND, () => {
        el.typed.textContent = "";
        show(el.placeholder);
        show(el.sent);
      });
      play(
        el.sent,
        track(
          FLIGHT.map(([f, bottom, s, o]) => [f, { transform: `translateY(${((bottom - 992) / PX_PER_PT).toFixed(2)}px) scale(${s})`, opacity: o }]),
        ),
      );
      at(153, () => {
        hide(el.sendArrow);
        show(el.sendMic);
        show(el.mic);
      });
      play(el.sendBtn, track([[152, { opacity: 1 }], [158, { opacity: 0 }]]));

      // The agent starts typing.
      at(203, () => show(el.dots));
      play(el.dots, blurIn([[203, 8, 0], [205, 6, 0.6], [210, 0, 1]]));

      // The reply replaces the dots in place.
      at(294, () => {
        hide(el.dots);
        show(el.reply);
      });
      play(el.reply, blurIn([[294, 10, 0.35], [295, 6, 0.6], [296, 3, 0.8], [298, 0, 1]]));

      // The reminder card lands and the thread scrolls it into view.
      at(378, () => show(el.card));
      play(el.card, blurIn([[378, 14, 0.2], [382, 6, 0.6], [385, 1, 0.95], [387, 0, 1]]));
      play(el.content, track(SCROLL.map((p, i) => [380 + i, { transform: `translateY(${(-p * SCROLL_PT).toFixed(2)}px)` }])));

      at(CYCLE, () => run());
    }

    run();
    (window as unknown as { __agentSeek?: (f?: number) => void }).__agentSeek = (f) => (f === undefined ? run() : run(f, true));
    return () => {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: 421 * scale, height: 880 * scale }}>
      <div style={{ width: 421, height: 880, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        {/* Titanium rim, black bezel, screen. */}
        <div
          style={{
            width: 421,
            height: 880,
            borderRadius: 69,
            padding: 4,
            background: "linear-gradient(145deg, #e9e9eb 0%, #c9c9cc 30%, #f4f4f5 55%, #bdbdc1 100%)",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 65, background: "#000", padding: 10 }}>
            <div
              className="font-ios"
              style={{
                position: "relative",
                width: 393,
                height: 852,
                borderRadius: 55,
                overflow: "hidden",
                background: SCREEN,
                color: "#0c0c0c",
                WebkitFontSmoothing: "antialiased",
              }}
            >
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
                  <Them innerRef={r.reply}>
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
                    <Tail side="left" color={THEM_GRAY} />
                  </div>
                </div>
                <div ref={r.card} style={{ marginTop: 13.5, paddingLeft: 20 }}>
                  <ReminderCard />
                </div>
              </div>

              <Header />
              <StatusBar />

              {/* Frosted input: the sent bubble starts behind it, which is why it rises out blurred. */}
              <div
                style={{
                  position: "absolute",
                  left: 20.5,
                  top: 760,
                  width: 353.5,
                  height: 57,
                  borderRadius: 28.5,
                  zIndex: 8,
                  background: "rgba(250,250,250,0.78)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "0.5px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 12.2,
                    top: 13.2,
                    width: 30.6,
                    height: 30.6,
                    borderRadius: 16,
                    background: "#eeeeee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
                    <path d="M7.5 1 V14 M1 7.5 H14" stroke="#1c1c1e" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ position: "absolute", left: 51.5, top: 0, height: 57, display: "flex", alignItems: "center", fontSize: 17, letterSpacing: -0.2 }}>
                  <span ref={r.placeholder} style={{ position: "absolute", color: "#949494" }}>
                    Message
                  </span>
                  <span ref={r.typed} style={{ color: "#0c0c0c", whiteSpace: "pre" }} />
                </div>
                <svg ref={r.mic} width="14" height="22" viewBox="0 0 14 22" style={{ position: "absolute", left: 317, top: 17.5 }} aria-hidden="true">
                  <rect x="3.5" y="1" width="7" height="12" rx="3.5" fill="none" stroke="#1c1c1e" strokeWidth="1.6" />
                  <path d="M1 10 a6 6 0 0 0 12 0 M7 16 v4" fill="none" stroke="#1c1c1e" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div
                  ref={r.sendBtn}
                  style={{
                    position: "absolute",
                    left: 306.5,
                    top: 11.5,
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: "linear-gradient(180deg, #5ba1f6 0%, #a9ccf9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                  }}
                >
                  <svg ref={r.sendArrow} width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
                    <path d="M7 15 V2 M1.5 7.5 L7 2 L12.5 7.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg ref={r.sendMic} width="12" height="18" viewBox="0 0 14 22" style={{ position: "absolute" }} aria-hidden="true">
                    <rect x="3.5" y="1" width="7" height="12" rx="3.5" fill="none" stroke="#1c1c1e" strokeWidth="1.6" />
                    <path d="M1 10 a6 6 0 0 0 12 0 M7 16 v4" fill="none" stroke="#1c1c1e" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div style={{ position: "absolute", left: 129.5, top: 838, width: 134, height: 5, borderRadius: 3, background: "#000", zIndex: 9 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
