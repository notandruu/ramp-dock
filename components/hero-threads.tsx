"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, TicketPhoto } from "./phone";

/*
 * The hero's four live iMessage threads, modeled on Flip's "Texts, first." card.
 * They play as a relay: one panel runs a short exchange, then hands off to the next.
 * Timings were measured off fliptexts.com: typing dots ~700ms, bubbles fade in over
 * 200ms while scaling up from 0.96, and the whole thread glides up as a new row lands.
 */

export type HeroMessage = { from: "them" | "me"; text?: string; photo?: "ticket" };

export type HeroPanel = {
  title: string;
  body: string;
  icon: ReactNode;
  /** Accessible description of the thread. */
  label: string;
  /** The first exchange is on screen at load; each turn plays the next one, looping. */
  exchanges: HeroMessage[][];
};

type Gap = "topic" | "switch" | "same";

type Row = HeroMessage & { id: number; gap: Gap; typing?: boolean; fresh: boolean };

const GAP: Record<Gap, number> = { topic: 12, switch: 8, same: 3 };

const TYPING_MS = 700;
const THEM_AFTER_MS = 650;
const REPLY_AFTER_MS = 600;
const TURN_START_MS = 350;
const HANDOFF_MS = 1400;
const MAX_ROWS = 12;

function gapFor(exchange: HeroMessage[], i: number): Gap {
  if (i === 0) return "topic";
  return exchange[i - 1].from === exchange[i].from ? "same" : "switch";
}

function Typing() {
  return (
    <div className="hero-bubble-in flex origin-bottom-left items-center gap-1 rounded-[16px] bg-[#e9e9eb] px-3 py-2.5">
      {[0, 200, 400].map((delay) => (
        <span key={delay} className="hero-dot h-2 w-2 rounded-full bg-[#8e8e93]" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </div>
  );
}

function Bubble({ row }: { row: Row }) {
  const me = row.from === "me";
  const enter = row.fresh ? "hero-bubble-in" : "";

  if (row.typing) return <Typing />;

  if (row.photo === "ticket") {
    // TicketPhoto is drawn for the 390px phone; shrink it to fit this one.
    return (
      <div className={`relative h-[123px] w-[105px] origin-bottom-right ${enter}`}>
        <div className="absolute left-0 top-0 origin-top-left scale-[0.7]">
          <TicketPhoto />
        </div>
      </div>
    );
  }

  return (
    <span
      className={`block max-w-[82%] whitespace-pre-wrap rounded-[16px] px-3 py-[7px] text-[13px] leading-[1.3] ${
        me ? "origin-bottom-right bg-[#0b6beb] text-white" : "origin-bottom-left bg-[#e9e9eb] text-[#111111]"
      } ${enter}`}
    >
      {row.text}
    </span>
  );
}

function Thread({ panel, turn, onDone }: { panel: HeroPanel; turn: number; onDone: () => void }) {
  const [rows, setRows] = useState<Row[]>(() =>
    panel.exchanges[0].map((m, i) => ({ ...m, id: i, gap: gapFor(panel.exchanges[0], i), fresh: false })),
  );
  const nextId = useRef(panel.exchanges[0].length);
  const viewRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const anchor = useRef<{ id: string; top: number } | null>(null);
  const slide = useRef<Animation | null>(null);
  const done = useRef(onDone);
  done.current = onDone;

  // Remember where the newest row sits on screen, so the next render can glide from there.
  const update = useCallback((fn: (rows: Row[]) => Row[]) => {
    const view = viewRef.current;
    const last = innerRef.current?.lastElementChild as HTMLElement | null | undefined;
    if (view && last?.dataset.id) {
      anchor.current = {
        id: last.dataset.id,
        top: last.getBoundingClientRect().top - view.getBoundingClientRect().top,
      };
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
    const exchange = panel.exchanges[turn % panel.exchanges.length];
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
      if (!cancelled) done.current();
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [turn, panel.exchanges, update]);

  return (
    <div
      role="img"
      aria-label={panel.label}
      className="relative flex h-[440px] w-[272px] flex-col overflow-hidden rounded-[44px] border-[8px] border-[#121212] bg-white text-[#111111] shadow-[0_30px_60px_-30px_rgba(16,19,26,0.35)]"
    >
      <div className="absolute left-1/2 top-[8px] h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-[#0a0a0a]" />
      <div className="flex flex-col items-center gap-1 pb-2 pt-[38px]">
        <Avatar size={40} />
        <div className="rounded-full bg-[#f2f2f1] px-2 py-[2px] text-[11px] font-semibold">Ramp Dock</div>
      </div>
      {/* The panel crops the bottom 40px of the phone, so the padding keeps the newest bubble in view. */}
      <div
        ref={viewRef}
        className="relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-2.5 pb-[46px]"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 22%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 22%)",
        }}
      >
        <div ref={innerRef} className="flex flex-col">
          {rows.map((r) => (
            <div
              key={r.id}
              data-id={r.id}
              className={`flex shrink-0 ${r.from === "me" ? "justify-end" : "justify-start"} ${r.fresh ? "hero-row-in" : ""}`}
              style={{ marginTop: GAP[r.gap] }}
            >
              <Bubble row={r} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroThreads({ panels }: { panels: HeroPanel[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [turns, setTurns] = useState(0);
  const liveRef = useRef(false);
  const pending = useRef(false);

  // Only run while the hero is on screen, the tab is visible, and motion is allowed.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const sync = () => {
      const next = inView && !motion.matches && document.visibilityState === "visible";
      liveRef.current = next;
      setLive(next);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      // A margin instead of a ratio: stacked on a phone, the grid is far taller than the screen.
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(grid);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Start the relay the first time it comes into view, and resume a handoff that waited while hidden.
  useEffect(() => {
    if (!live) return;
    if (turns === 0 || pending.current) {
      pending.current = false;
      setTurns((t) => t + 1);
    }
  }, [live]);

  const handoff = useCallback(() => {
    if (liveRef.current) setTurns((t) => t + 1);
    else pending.current = true;
  }, []);

  return (
    <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {panels.map((p, i) => (
        <div key={p.title} className="flex flex-col gap-5">
          <div className="flex h-[440px] justify-center overflow-hidden rounded-[32px] bg-gradient-to-b from-[#f4f5f7] to-[#eceef2] pt-10">
            <Thread panel={p} turn={turns > i ? Math.floor((turns - 1 - i) / panels.length) + 1 : 0} onDone={handoff} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 text-[22px] font-semibold tracking-[-0.01em] text-ink">
              {p.icon}
              {p.title}
            </div>
            <p className="mt-1.5 text-[18px] leading-[1.45] text-muted">{p.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
