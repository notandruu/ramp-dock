"use client";

import type { CSSProperties, ReactNode } from "react";
import { CAPTION, INK, softCard } from "./widget";

/*
 * Every other card the agent can send, all in the clip's language: the soft card, one blue, 17pt
 * facts in ink with the joining words gray, 12.5pt gray labels, the calendar's tile and its blue
 * bars. Sizes follow iOS widgets so a thread can mix them: small 158 square, medium 354 x 158,
 * large 354 square, plus a thread-wide row and reply chips. 354 is the thread's width.
 *
 * Nothing here animates itself. Parts that may move carry `data-cue` (see `cascade` in motion.ts):
 * only what the content really does when it shows up.
 */

export const WIDE = 354;
const GRAY = "#8a8a8a";
const LINE = "#e6e6e6";
const BLUE = "linear-gradient(180deg, #7db6fa, #9cc8fc)";
const TILE_BLUE = "linear-gradient(180deg, #84b8f9 0%, #b7d6fc 100%)";
const TRACK = "#e8edf5";

const big: CSSProperties = { fontSize: 42, lineHeight: "42px", letterSpacing: -1, color: INK };
const body: CSSProperties = { fontSize: 17, lineHeight: "20.5px", letterSpacing: -0.2, color: INK };
const small: CSSProperties = { fontSize: 12.5, lineHeight: "15px", color: CAPTION };

/** Gray words in a sentence: the joining words, so the facts stand out. */
export function Dim({ children }: { children: ReactNode }) {
  return <span style={{ color: GRAY }}>{children}</span>;
}

function Card({ width = WIDE, height, radius = 20, children, style }: { width?: number; height?: number; radius?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ width, height, borderRadius: radius, position: "relative", overflow: "hidden", ...softCard, ...style }}>{children}</div>;
}

/** The calendar's tile: a label strip over a big light number. */
export function Tile({ label, value, style }: { label: string; value: string; style?: CSSProperties }) {
  return (
    <div style={{ width: 71, height: 77, borderRadius: 9, overflow: "hidden", background: TILE_BLUE, boxShadow: "0 2px 4px rgba(40,90,160,0.25)", ...style }}>
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
        {label}
      </div>
      <div style={{ color: "#fff", fontSize: 40, fontWeight: 300, textAlign: "center", lineHeight: "50px", letterSpacing: -1 }}>{value}</div>
    </div>
  );
}

/** The tile's little sibling for a person or a vendor: initials on the same blue. */
export function Initials({ children, size = 40 }: { children: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: size * 0.24,
        background: TILE_BLUE,
        boxShadow: "0 1.5px 3px rgba(40,90,160,0.22)",
        color: "#fff",
        fontSize: size * 0.4,
        lineHeight: `${size}px`,
        textAlign: "center",
        letterSpacing: -0.3,
      }}
    >
      {children}
    </div>
  );
}

/** One of the calendar's blue bars. `amount` (0 to 1) fills it from the left; the fill is a `fill` cue. */
export function Bar({ amount = 1, cue = amount < 1 }: { amount?: number; cue?: boolean }) {
  return (
    <div style={{ height: 3, borderRadius: 2, background: amount < 1 ? TRACK : "transparent", flex: 1, position: "relative" }}>
      <div data-cue={cue ? "fill" : undefined} style={{ position: "absolute", inset: 0, width: `${amount * 100}%`, borderRadius: 2, background: BLUE, transformOrigin: "0 50%" }} />
    </div>
  );
}

function Hairline() {
  return <div style={{ height: 1, background: LINE }} />;
}

function Pill({ children, primary = false }: { children: ReactNode; primary?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        height: 40,
        borderRadius: 20,
        fontSize: 16,
        lineHeight: "40px",
        textAlign: "center",
        letterSpacing: -0.2,
        color: primary ? "#fff" : INK,
        background: primary ? "linear-gradient(180deg, #6ba8f6, #84b8f9)" : "#ececec",
        boxShadow: primary ? "0 1.5px 3px rgba(40,90,160,0.22)" : undefined,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- wide ---------- */

/**
 * The clip's calendar card: tile, gray title, a two-line sentence (facts dark, joining words in
 * `Dim`), one blue bar per step. It holds still: the thread's scroll is its only motion.
 */
export function PlanCard({ tile, title, steps = 3, children }: { tile: { label: string; value: string }; title: string; steps?: number; children: ReactNode }) {
  return (
    <div style={{ height: 188, borderRadius: 20, position: "relative", ...softCard }}>
      <Tile label={tile.label} value={tile.value} style={{ position: "absolute", left: 18, top: 16.5 }} />
      <div style={{ position: "absolute", left: 102.5, top: 18, fontSize: 17, color: CAPTION }}>{title}</div>
      <div style={{ position: "absolute", left: 18, top: 108, ...body }}>{children}</div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 168.5, display: "flex", gap: 4.4 }}>
        {Array.from({ length: steps }, (_, i) => (
          <Bar key={i} />
        ))}
      </div>
    </div>
  );
}

/* ---------- small, 158 square ---------- */

/** What's left of a budget, like a fuel gauge: gray title, the amount left, a bar showing how much of it remains. */
export function MeterWidget({ title, value, left, note }: { title: string; value: string; left: number; note: string }) {
  return (
    <Card width={158} height={158} radius={14.5}>
      <div style={{ position: "absolute", left: 18, right: 18, top: 18, fontSize: 15, color: CAPTION, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      <div style={{ position: "absolute", left: 18, top: 50, display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={big}>{value}</span>
        <span style={{ fontSize: 16, color: INK }}>left</span>
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 110, display: "flex" }}>
        <Bar amount={left} />
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 122, ...small, whiteSpace: "nowrap" }}>{note}</div>
    </Card>
  );
}

/** Things waiting on you: gray title, the count, and the faces of who's waiting, one after another. */
export function WaitingWidget({ title, count, people }: { title: string; count: string; people: string[] }) {
  return (
    <Card width={158} height={158} radius={14.5}>
      <div style={{ position: "absolute", left: 18, right: 18, top: 18, fontSize: 15, color: CAPTION, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      <div style={{ position: "absolute", left: 18, top: 50, display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={big}>{count}</span>
        <span style={{ fontSize: 16, color: INK }}>waiting</span>
      </div>
      <div style={{ position: "absolute", left: 18, top: 108, display: "flex", gap: 6 }}>
        {people.map((p) => (
          <div key={p} data-cue="pop">
            <Initials size={30}>{p}</Initials>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- medium, 354 x 158 ---------- */

/** Where a delivery is: the time it lands, and a line of steps filled up to the one it's on. */
export function TrackerCard({ title, time, unit, status, steps, at }: { title: string; time: string; unit?: string; status: string; steps: string[]; at: number }) {
  const span = WIDE - 36;
  const x = (i: number) => (span * i) / (steps.length - 1);
  return (
    <Card height={158}>
      <div style={{ position: "absolute", left: 18, top: 18, fontSize: 17, color: CAPTION }}>{title}</div>
      <div style={{ position: "absolute", right: 18, top: 20, ...small }}>{status}</div>
      <div style={{ position: "absolute", left: 18, top: 50, display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={big}>{time}</span>
        {unit && <span style={{ fontSize: 16, color: INK }}>{unit}</span>}
      </div>
      <div style={{ position: "absolute", left: 18, width: span, top: 112, height: 3, borderRadius: 2, background: TRACK }}>
        <div data-cue="fill" style={{ width: x(at), height: 3, borderRadius: 2, background: BLUE, transformOrigin: "0 50%" }} />
      </div>
      {steps.map((s, i) => (
        <div key={s}>
          <div
            data-cue={i <= at ? "pop" : undefined}
            style={{
              position: "absolute",
              left: 18 + x(i) - 5,
              top: 108.5,
              width: 10,
              height: 10,
              borderRadius: 5,
              background: i <= at ? "linear-gradient(180deg, #6ba8f6, #84b8f9)" : "#dcdcdc",
              boxShadow: i === at ? "0 0 0 4px rgba(107,168,246,0.22)" : undefined,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 126,
              left: 18 + x(i),
              transform: `translateX(${i === 0 ? 0 : i === steps.length - 1 ? -100 : -50}%)`,
              ...small,
              color: i === at ? INK : CAPTION,
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </div>
        </div>
      ))}
    </Card>
  );
}

/** Spend so far with the weeks as bars that grow up from the base, one after another. */
export function ChartCard({ title, total, note, weeks }: { title: string; total: string; note: string; weeks: number[] }) {
  const max = Math.max(...weeks);
  return (
    <Card height={158}>
      <div style={{ position: "absolute", left: 18, top: 18, fontSize: 17, color: CAPTION }}>{title}</div>
      <div style={{ position: "absolute", left: 18, top: 58, ...big }}>{total}</div>
      <div style={{ position: "absolute", left: 18, top: 114, ...small }}>{note}</div>
      <div style={{ position: "absolute", right: 18, bottom: 22, height: 96, display: "flex", alignItems: "flex-end", gap: 7 }}>
        {weeks.map((w, i) => (
          <div
            key={i}
            data-cue="grow"
            style={{
              width: 14,
              height: (96 * w) / max,
              borderRadius: 4,
              background: i === weeks.length - 1 ? "linear-gradient(180deg, #6ba8f6, #84b8f9)" : "linear-gradient(180deg, #a9cbfa, #c6dcfb)",
              transformOrigin: "50% 100%",
            }}
          />
        ))}
      </div>
    </Card>
  );
}

/** A paper as a little tile: the same blue as the calendar's, with lines of writing on it. */
function Paper() {
  return (
    <div style={{ width: 30, height: 38, flexShrink: 0, borderRadius: 6, background: TILE_BLUE, boxShadow: "0 1.5px 3px rgba(40,90,160,0.22)", padding: "9px 6px", display: "flex", flexDirection: "column", gap: 4 }}>
      {[1, 0.65, 0.85].map((w, i) => (
        <div key={i} style={{ height: 2.5, width: `${w * 100}%`, borderRadius: 2, background: "rgba(255,255,255,0.9)" }} />
      ))}
    </div>
  );
}

/**
 * Two papers that should say the same thing, side by side with what each says, a check between them
 * that draws itself once they agree, and what happens next underneath.
 */
export function MatchCard({ title, papers, children }: { title: string; papers: [[label: string, says: string], [label: string, says: string]]; children: ReactNode }) {
  const paper = ([label, says]: [string, string]) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
      <Paper />
      <div>
        <div style={small}>{label}</div>
        <div style={{ ...body, marginTop: 2 }}>{says}</div>
      </div>
    </div>
  );
  return (
    <Card height={158}>
      <div style={{ position: "absolute", left: 18, top: 18, fontSize: 17, color: CAPTION }}>{title}</div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 52, display: "flex", alignItems: "center", gap: 8 }}>
        {paper(papers[0])}
        <svg width="26" height="26" viewBox="0 0 26 26" style={{ flexShrink: 0 }} aria-hidden="true">
          <circle cx="13" cy="13" r="13" fill="#eaf2fe" />
          <path data-cue="draw" d="M7.5 13.5 L11.5 17.5 L18.5 9.5" fill="none" stroke="#5f9ff3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" style={{ strokeDashoffset: 0 }} />
        </svg>
        {paper(papers[1])}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, top: 110 }}>
        <Hairline />
        <div data-cue="row" style={{ ...body, marginTop: 11 }}>
          {children}
        </div>
      </div>
    </Card>
  );
}

/* ---------- large, 354 square ---------- */

/** Someone wants to buy something: who and what, the price, what it leaves in the budget, and the two answers. */
export function ApprovalCard({
  who,
  initials,
  what,
  price,
  budget,
  left,
  used,
  facts,
}: {
  who: string;
  initials: string;
  what: string;
  price: string;
  budget: string;
  left: string;
  used: number;
  /** Short gray-label, dark-value rows: where it comes from, who it's for. */
  facts: [label: string, value: string][];
}) {
  return (
    <Card height={WIDE} style={{ padding: 18, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Initials>{initials}</Initials>
        <div>
          <div style={{ fontSize: 17, color: CAPTION }}>{who} wants to buy</div>
          <div style={body}>{what}</div>
        </div>
      </div>
      <div data-cue="row" style={{ ...big, marginTop: 30 }}>
        {price}
      </div>
      <div data-cue="row" style={{ marginTop: 26, display: "flex", justifyContent: "space-between", ...small }}>
        <span>{budget}</span>
        <span style={{ color: INK }}>{left}</span>
      </div>
      <div style={{ marginTop: 9, display: "flex" }}>
        <Bar amount={used} />
      </div>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 9 }}>
        {facts.map(([label, value]) => (
          <div key={label} data-cue="row" style={{ display: "flex", fontSize: 15, letterSpacing: -0.2 }}>
            <span style={{ color: GRAY, width: 54 }}>{label}</span>
            <span style={{ color: INK }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div data-cue="row" style={{ display: "flex", gap: 10 }}>
        <Pill primary>Approve</Pill>
        <Pill>Not now</Pill>
      </div>
    </Card>
  );
}

/** An order written out line by line, with its total under a hairline. */
export function ListCard({ tile, title, note, lines, total }: { tile: { label: string; value: string }; title: string; note: string; lines: [item: string, qty: string, price: string][]; total: string }) {
  return (
    <Card height={WIDE} style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 13 }}>
        <Tile label={tile.label} value={tile.value} />
        <div style={{ paddingTop: 1 }}>
          <div style={{ fontSize: 17, color: CAPTION }}>{title}</div>
          <div style={{ ...small, marginTop: 6 }}>{note}</div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 11 }}>
        {lines.map(([item, qty, price]) => (
          <div key={item} data-cue="row" style={{ display: "flex", ...body }}>
            <span>{item}</span>
            <span style={{ color: GRAY, marginLeft: 6 }}>{qty}</span>
            <span style={{ marginLeft: "auto" }}>{price}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
        <Hairline />
        <div data-cue="row" style={{ display: "flex", ...body, marginTop: 12 }}>
          <span style={{ color: CAPTION }}>Total</span>
          <span style={{ marginLeft: "auto", fontSize: 22, letterSpacing: -0.4 }}>{total}</span>
        </div>
      </div>
    </Card>
  );
}

/* ---------- in the thread ---------- */

/** A vendor or a person as one thread-wide row. */
export function ContactRow({ initials, name, detail }: { initials: string; name: string; detail: string }) {
  return (
    <Card height={64} radius={16}>
      <div style={{ position: "absolute", inset: "0 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <Initials>{initials}</Initials>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={body}>{name}</div>
          <div style={{ ...small, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{detail}</div>
        </div>
        <svg width="8" height="13" viewBox="0 0 8 13" aria-hidden="true">
          <path d="M1.5 1.5 L6.5 6.5 L1.5 11.5" fill="none" stroke="#c4c4c4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Card>
  );
}

/** The answers you can tap instead of typing, one after another. */
export function ReplyChips({ options }: { options: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, width: WIDE }}>
      {options.map((o, i) => (
        <div
          key={o}
          data-cue="row"
          style={{
            height: 36,
            padding: "0 15px",
            borderRadius: 18,
            fontSize: 15.5,
            lineHeight: "36px",
            letterSpacing: -0.2,
            color: i === 0 ? "#2f7be6" : INK,
            ...softCard,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {o}
        </div>
      ))}
    </div>
  );
}
