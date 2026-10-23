"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Avatar } from "./phone";

/*
 * Live iMessage threads, modeled on Flip's "Texts, first." card. Timings were measured off
 * fliptexts.com: typing dots ~700ms, bubbles fade in over 200ms while scaling up from 0.96,
 * and the whole thread glides up as a new row lands.
 */

export type Message = { from: "them" | "me"; text: string };
/** A thread shows its last exchange at load; each turn plays the next one, looping. */
export type Script = Message[][];

type Variant = "hero" | "card";
type Gap = "topic" | "switch" | "same";
type Row = Message & { id: number; gap: Gap; typing?: boolean; fresh: boolean };

const GAP: Record<Variant, Record<Gap, string>> = {
  hero: { topic: "3.7cqw", switch: "2.7cqw", same: "0.8cqw" },
  card: { topic: "12px", switch: "8px", same: "3px" },
};

const TYPING_MS = 700;
const THEM_AFTER_MS = 650;
const REPLY_AFTER_MS = 600;
const TURN_START_MS = 350;
const HANDOFF_MS = 1400;
const MAX_ROWS = 12;

function gapFor(exchange: Message[], i: number): Gap {
  if (i === 0) return "topic";
  return exchange[i - 1].from === exchange[i].from ? "same" : "switch";
}

/** How long one turn takes, so a progress bar can track it. */
export function turnDuration(exchange: Message[]) {
  return exchange.reduce(
    (ms, m, i) => ms + (i === 0 ? TURN_START_MS : m.from === "me" ? REPLY_AFTER_MS : THEM_AFTER_MS) + (m.from === "them" ? TYPING_MS : 0),
    HANDOFF_MS,
  );
}

/** True while the element is on screen, the tab is visible, and motion is allowed. */
export function useLive(ref: RefObject<HTMLElement | null>) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => setLive(inView && !motion.matches && document.visibilityState === "visible");
    // A margin instead of a ratio: stacked on a phone, some of these are taller than the screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref]);
  return live;
}

function Typing({ variant }: { variant: Variant }) {
  const dot = variant === "hero" ? "h-[2.4cqw] w-[2.4cqw]" : "h-2 w-2";
  return (
    <div
      className={`hero-bubble-in flex origin-bottom-left items-center gap-1 bg-[#e9e9eb] ${
        variant === "hero" ? "gap-[1.1cqw] rounded-[4.8cqw] px-[3.7cqw] py-[3.2cqw]" : "rounded-[16px] px-3 py-2.5"
      }`}
    >
      {[0, 200, 400].map((delay) => (
        <span key={delay} className={`hero-dot ${dot} rounded-full bg-[#8e8e93]`} style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}

function Bubble({ row, variant }: { row: Row; variant: Variant }) {
  if (row.typing) return <Typing variant={variant} />;
  const me = row.from === "me";
  return (
    <span
      className={`block whitespace-pre-wrap ${
        variant === "hero"
          ? "max-w-[78%] rounded-[4.8cqw] px-[3.2cqw] py-[1.9cqw] text-[4.53cqw] leading-[5.87cqw] tracking-[-0.2px]"
          : "max-w-[82%] rounded-[16px] px-3 py-[7px] text-[13px] leading-[1.3]"
      } ${me ? "origin-bottom-right bg-[#0b6beb] text-white" : "origin-bottom-left bg-[#e9e9eb] text-[#111111]"} ${
        row.fresh ? "hero-bubble-in" : ""
      }`}
    >
      {row.text}
    </span>
  );
}

/** The scrolling message column. Plays one exchange per `turn` and calls `onDone` after it. */
export function ThreadView({
  script,
  turn,
  onDone,
  variant,
  className = "",
}: {
  script: Script;
  turn: number;
  onDone?: () => void;
  variant: Variant;
  className?: string;
}) {
  const last = script[script.length - 1];
  const [rows, setRows] = useState<Row[]>(() => last.map((m, i) => ({ ...m, id: i, gap: gapFor(last, i), fresh: false })));
  const nextId = useRef(last.length);
  const viewRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const anchor = useRef<{ id: string; top: number } | null>(null);
  const slide = useRef<Animation | null>(null);
  const done = useRef(onDone);
  done.current = onDone;

  // Remember where the newest row sits on screen, so the next render can glide from there.
  const update = useCallback((fn: (rows: Row[]) => Row[]) => {
    const view = viewRef.current;
    const lastRow = innerRef.current?.lastElementChild as HTMLElement | null | undefined;
    if (view && lastRow?.dataset.id) {
      anchor.current = { id: lastRow.dataset.id, top: lastRow.getBoundingClientRect().top - view.getBoundingClientRect().top };
    }
    setRows(fn);
  }, []);

  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    const view = viewRef.current;
    const inner = innerRef.current;
    const el = a && inner?.querySelector<HTMLElement>(`[data-id="${a.id}"]`);
    if (!a || !view || !inner || !el) return;

    slide.current?.cancel();
    const delta = a.top - (el.getBoundingClientRect().top - view.getBoundingClientRect().top);
    if (Math.abs(delta) < 0.5) return;
    slide.current = inner.animate([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }], {
      duration: 450,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
  }, [rows]);

  useEffect(() => {
    if (turn === 0) return;
    const exchange = script[(turn - 1) % script.length];
    const timers: number[] = [];
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    (async () => {
      for (let i = 0; i < exchange.length; i++) {
        const m = exchange[i];
        await wait(i === 0 ? TURN_START_MS : m.from === "me" ? REPLY_AFTER_MS : THEM_AFTER_MS);
        if (cancelled) return;

        const id = nextId.current++;
        const row: Row = { ...m, id, gap: gapFor(exchange, i), fresh: true };
        if (m.from === "them") {
          update((rs) => [...rs, { ...row, typing: true }].slice(-MAX_ROWS));
          await wait(TYPING_MS);
          if (cancelled) return;
          update((rs) => rs.map((r) => (r.id === id ? row : r)));
        } else {
          update((rs) => [...rs, row].slice(-MAX_ROWS));
        }
      }
      await wait(HANDOFF_MS);
      if (!cancelled) done.current?.();
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [turn, script, update]);

  return (
    <div
      ref={viewRef}
      className={`relative flex min-h-0 flex-col justify-end overflow-hidden ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 20%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%)",
      }}
    >
      <div ref={innerRef} className="flex flex-col">
        {rows.map((r) => (
          <div
            key={r.id}
            data-id={r.id}
            className={`flex shrink-0 ${r.from === "me" ? "justify-end" : "justify-start"} ${r.fresh ? "hero-row-in" : ""}`}
            style={{ marginTop: GAP[variant][r.gap] }}
          >
            <Bubble row={r} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The hero art from the Figma: an iPhone on Ramp's blue gradient. The live thread sits over the
 * phone's message area, measured off the 1370px source image (screen x 309 to 1058, header ends y 497).
 */
export function HeroPhone({ script, label }: { script: Script; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  const [turn, setTurn] = useState(0);
  const pending = useRef(false);
  const liveRef = useRef(live);
  liveRef.current = live;

  useEffect(() => {
    if (!live) return;
    if (turn === 0 || pending.current) {
      pending.current = false;
      setTurn((t) => t + 1);
    }
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback(() => {
    if (liveRef.current) setTurn((t) => t + 1);
    else pending.current = true;
  }, []);

  return (
    <div ref={ref} role="img" aria-label={label} className="relative aspect-square w-full overflow-hidden rounded-[12px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ramp/hero-phone.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
      {/* Sized in container units: the screen is 375px wide at full size, a real iPhone in points. */}
      <div className="font-ios absolute bottom-0 left-[22.55%] top-[36.4%] w-[54.74%] bg-white [container-type:inline-size]">
        <ThreadView script={script} turn={turn} onDone={next} variant="hero" className="h-full px-[3.2%] pb-[6%]" />
      </div>
    </div>
  );
}

export type Step = { title: string; body: string; label: string; script: Script };

/** A phone in the Figma's gray showcase card: the earlier site's iMessage frame. */
function StepPhone({ step, turn, onDone }: { step: Step; turn: number; onDone: () => void }) {
  return (
    <div
      role="img"
      aria-label={step.label}
      className="font-ios flex h-[560px] w-[300px] flex-col overflow-hidden rounded-[48px] border-[9px] border-[#121212] bg-white text-[#111111] shadow-[0_30px_60px_-30px_rgba(16,19,26,0.35)]"
    >
      <div className="mx-auto mt-[9px] h-[24px] w-[88px] shrink-0 rounded-full bg-[#0a0a0a]" />
      <div className="flex shrink-0 flex-col items-center gap-1 pb-2 pt-3">
        <Avatar size={44} />
        <div className="text-[11px] text-[#6b6b66]">Ramp ›</div>
      </div>
      <div className="h-px shrink-0 bg-[#e5e5ea]" />
      {/* The card crops the bottom of the phone, so the padding keeps the newest bubble in view. */}
      <ThreadView script={step.script} turn={turn} onDone={onDone} variant="card" className="flex-1 px-3 pb-[52px]" />
    </div>
  );
}

/**
 * The Figma's tabbed showcase (Ramp's "Drag, drop, done." block), used for the four steps.
 * Steps play one at a time: the active step's phone runs its thread while its progress bar fills,
 * then hands off to the next. Clicking a step jumps to it.
 */
export function StepsShowcase({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useLive(ref);
  const [active, setActive] = useState(0);
  const [turns, setTurns] = useState<number[]>(() => steps.map(() => 0));
  const liveRef = useRef(live);
  liveRef.current = live;
  const pending = useRef(false);

  const play = useCallback((i: number) => {
    setActive(i);
    setTurns((ts) => ts.map((t, j) => (j === i ? t + 1 : t)));
  }, []);

  useEffect(() => {
    if (!live) return;
    if (turns.every((t) => t === 0)) play(0);
    else if (pending.current) {
      pending.current = false;
      play((active + 1) % steps.length);
    }
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps

  const handoff = useCallback(
    (i: number) => {
      if (i !== active) return;
      if (liveRef.current) play((i + 1) % steps.length);
      else pending.current = true;
    },
    [active, play, steps.length],
  );

  const playing = turns[active] > 0;
  const exchange = steps[active].script[(Math.max(turns[active], 1) - 1) % steps[active].script.length];

  return (
    <div ref={ref} className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
      <ol className="mx-auto w-full max-w-[421px]">
        {steps.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.title} className="border-b border-[#d2cecb] pt-4 first:pt-0">
              <button type="button" onClick={() => play(i)} className="w-full pb-4 text-left">
                <span className={`block text-[20px] leading-[26px] text-ink transition-opacity ${on ? "" : "opacity-20 hover:opacity-50"}`}>
                  {s.title}
                </span>
                <span
                  className={`grid text-[16px] leading-[22px] text-muted transition-[grid-template-rows,opacity] duration-300 ${
                    on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <span className="overflow-hidden">
                    <span className="block pt-3">{s.body}</span>
                  </span>
                </span>
              </button>
              <div className="-mb-px h-px pr-[30px]">
                {on && playing ? (
                  <div
                    key={turns[active]}
                    className="step-progress h-px bg-[#1a1919]"
                    style={{ animationDuration: `${turnDuration(exchange)}ms`, animationPlayState: live ? "running" : "paused" }}
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="relative flex h-[580px] justify-center overflow-hidden rounded-[12px] bg-[#f4f2f0] pt-12">
        {steps.map((s, i) => (
          <div
            key={s.title}
            aria-hidden={i !== active}
            className={`absolute top-12 transition-opacity duration-300 ${i === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <StepPhone step={s} turn={turns[i]} onDone={() => handoff(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}
