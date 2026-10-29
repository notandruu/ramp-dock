/*
 * Motion for the agent's in-thread widgets. Everything is keyed to frames at 60fps because it was
 * measured off a 60fps screen recording, one frame at a time. Use these instead of writing new
 * curves: a widget that animates with its own easing will look like it came from another app.
 */

/** `?slow=4` plays everything 4x slower, to check motion by eye. */
let slow = 1;
export const setSlow = (factor: number) => (slow = Math.max(1, factor || 1));
export const readSlow = () => setSlow(Number(new URLSearchParams(location.search).get("slow")));

/** Frames at 60fps to milliseconds. */
export const F = (frame: number) => ((frame * 1000) / 60) * slow;

export type Track = { keyframes: Keyframe[]; delay: number; duration: number };

/** Keyframes with offsets from absolute frame numbers. */
export function track<T extends Record<string, string | number>>(points: [number, T][]): Track {
  const start = points[0][0];
  const end = points[points.length - 1][0];
  return {
    keyframes: points.map(([f, k]) => ({ ...k, offset: (f - start) / (end - start) })),
    delay: F(start),
    duration: F(end - start),
  };
}

/** Play a track from now and hold its last frame. */
export function playTrack(node: Element, t: Track, fill: FillMode = "forwards") {
  return node.animate(t.keyframes, { delay: t.delay, duration: t.duration, easing: "linear", fill });
}

/**
 * Measured tracks are one sample per clip frame. Played as straight lines between samples they
 * read as steppy on 120Hz screens, so fill each frame with a Catmull-Rom curve through the samples.
 */
export function resample(points: [frame: number, ...values: number[]][], perFrame = 4): [number, ...number[]][] {
  const out: [number, ...number[]][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const steps = Math.max(1, Math.round((p2[0] - p1[0]) * perFrame));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const v = (k: number) =>
        0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
      out.push(p1.map((_, k) => (k === 0 ? p1[0] + (p2[0] - p1[0]) * t : v(k))) as [number, ...number[]]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/**
 * Damped spring from 0 to 1 sampled per frame, for the pieces the clip shows settling with a small bounce.
 * `velocity` (per second) gives it the head start that makes it snap out instead of easing in.
 */
export function spring(frames: number, { stiffness = 320, damping = 22, velocity = 0 } = {}) {
  const dt = 1 / 240;
  let x = 0;
  let v = velocity;
  const out: number[] = [];
  for (let i = 0; i <= frames * 4; i++) {
    if (i % 4 === 0) out.push(x);
    const a = stiffness * (1 - x) - damping * v;
    v += a * dt;
    x += v * dt;
  }
  out[out.length - 1] = 1;
  return out;
}

/** Blur-in used by the send button, the dots, the reply and the card. */
export function blurIn(points: [frame: number, blur: number, opacity: number, scale?: number][]) {
  return track(
    points.map(([f, blur, opacity, scale = 1]) => [
      f,
      { filter: `blur(${blur}px)`, opacity, transform: `scale(${scale})` },
    ]),
  );
}

/**
 * Value at frame `f` moving through turning points: each move eases out of one point and into the
 * next, the way a hanging thing slows at the top of its arc. Holds the end values outside the span.
 */
export function through(points: [frame: number, value: number][], f: number) {
  if (f <= points[0][0]) return points[0][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [f0, a0] = points[i];
    const [f1, a1] = points[i + 1];
    if (f < f1) return a0 + ((a1 - a0) * (1 - Math.cos((Math.PI * (f - f0)) / (f1 - f0)))) / 2;
  }
  return points[points.length - 1][1];
}

/** A transform track moving through turning points, sampled every quarter frame. */
export function swing(points: [frame: number, value: number][], pose: (value: number) => string): Track {
  const out: [number, { transform: string }][] = [];
  const end = points[points.length - 1][0];
  for (let f = points[0][0]; f < end; f += 0.25) out.push([f, { transform: pose(through(points, f)) }]);
  out.push([end, { transform: pose(points[points.length - 1][1]) }]);
  return track(out);
}

/* ---------- the widget entrance, measured off the reminder card ---------- */

/*
 * Every widget lands the same way: the card blurs in, its glyph is held while it does, and is let go
 * at RELEASE. What the glyph does once let go depends on what it is (a bell rings, a box drops, a
 * bill prints), but every gesture is built from the clip's timing: BEAT frames per move, and each
 * move smaller than the last by about DECAY. A glyph never does something its real object wouldn't.
 */

/** How the card itself arrives, frames after it lands: soft and pale, crisp by 9. */
export const WIDGET_BLUR: [frame: number, blur: number, opacity: number][] = [
  [0, 14, 0.2],
  [4, 6, 0.6],
  [7, 1, 0.95],
  [9, 0, 1],
];

/** Frames after landing when the glyph is let go: the card is nearly crisp by then. */
export const RELEASE = 8;
/** One move, measured as the bell's half swing. */
export const BEAT = 12.75;
/** Each move against the one before it, from the bell's peaks (7.1, 4.1, 2, 1). */
export const DECAY = 0.55;

/**
 * The bell's ring as swing in degrees (clockwise) at each turning point: held lifted while the card
 * blurs in, let go at RELEASE, then about a BEAT per swing until it hangs still at 111.
 */
export const RING: [frame: number, swing: number][] = [
  [0, 7.4],
  [8, 7.4],
  [20.5, -7.1],
  [33.5, 4.1],
  [46.5, -4],
  [59, 2],
  [72, -1],
  [85, 0.5],
  [98, -0.2],
  [111, 0],
];

/** Parts of a widget's glyph that a gesture can move. */
export type GlyphPart = "glyph" | "body" | "accent";
export type Gesture = (start: number) => Partial<Record<GlyphPart, Track>>;

/** Rings like a bell, on the whole glyph (body and clapper together). */
export const ring =
  (pose: (swing: number) => string): Gesture =>
  (start) => ({ glyph: swing(RING.map(([f, a]) => [start + f, a]), pose) });

/**
 * Held up while the card blurs in, then dropped: falls a BEAT, lands, and bounces lower each time
 * until it sits. Ball arcs (fast at the ground, slow at the top), the accent stays put as the ground.
 */
export const drop =
  (height = 16): Gesture =>
  (start) => {
    const out: [number, { transform: string }][] = [[start, { transform: `translateY(${-height}px)` }]];
    const at = (f: number, y: number) => out.push([f, { transform: `translateY(${y.toFixed(2)}px)` }]);
    let f = start + RELEASE;
    at(f, -height);
    for (let s = 1; s <= 8; s++) at(f + (BEAT * s) / 8, -height * (1 - (s / 8) ** 2));
    f += BEAT;
    for (let bounce = height * DECAY * DECAY, beat = BEAT * DECAY; bounce > 0.4; bounce *= DECAY * DECAY, beat *= DECAY) {
      for (let s = 1; s <= 8; s++) at(f + (beat * s) / 8, -bounce * 4 * (s / 8) * (1 - s / 8));
      f += beat;
    }
    return { body: track(out) };
  };

/** Samples `pose` every quarter frame from `from` to `to`, for gestures that are easier to write as a formula. */
function curve(from: number, to: number, pose: (f: number) => Record<string, string>): [number, Record<string, string>][] {
  const out: [number, Record<string, string>][] = [];
  for (let f = from; f < to; f += 0.25) out.push([f, pose(f)]);
  out.push([to, pose(to)]);
  return out;
}

/** 0 to 1 over a span, easing in like something falling. */
const fall = (f: number, from: number, to: number) => Math.min(1, Math.max(0, (f - from) / (to - from))) ** 2;
/** 0 to 1 over a span, easing out like something braking. */
const brake = (f: number, from: number, to: number) => 1 - (1 - Math.min(1, Math.max(0, (f - from) / (to - from)))) ** 3;

/**
 * Feeds out like a slip from a printer: slides down its own length at an even pace over two BEATs,
 * then stops with a small give.
 */
export const feed =
  (length = 40): Gesture =>
  (start) => {
    const f0 = start + RELEASE;
    const f1 = f0 + 2 * BEAT;
    return {
      body: track([
        [start, { transform: `translateY(${-length}px)` }],
        [f0, { transform: `translateY(${-length}px)` }],
        [f1, { transform: "translateY(0px)" }],
        [f1 + BEAT / 3, { transform: "translateY(-1.2px)" }],
        [f1 + BEAT, { transform: "translateY(0px)" }],
      ]),
    };
  };

/** Tapped on a reader: presses in for half a BEAT, springs back past flat, and settles. */
export const tap =
  (depth = 0.1): Gesture =>
  (start) => {
    const f0 = start + RELEASE;
    return {
      body: swing(
        [
          [start, 1],
          [f0, 1],
          [f0 + BEAT / 2, 1 - depth],
          [f0 + BEAT, 1 + depth * DECAY * DECAY],
          [f0 + 1.5 * BEAT, 1 - depth * DECAY ** 4],
          [f0 + 2 * BEAT, 1],
        ],
        (k) => `scale(${k.toFixed(4)})`,
      ),
    };
  };

/**
 * A rubber stamp: held up, slammed down in half a BEAT, a small recoil, and the ink mark (the accent)
 * spreads out from the middle the moment it hits.
 */
export const stamp =
  (height = 14): Gesture =>
  (start) => {
    const f0 = start + RELEASE;
    const hit = f0 + BEAT / 2;
    const body = track(
      curve(start, hit + BEAT, (f) => {
        const y = f < hit ? -height * (1 - fall(f, f0, hit)) : -1.5 * Math.sin((Math.PI * (f - hit)) / BEAT);
        return { transform: `translateY(${y.toFixed(2)}px)` };
      }),
    );
    const accent = track(
      curve(start, hit + BEAT / 2, (f) => {
        const k = f < hit ? 0 : brake(f, hit, hit + BEAT / 2);
        return { transform: `scaleX(${(0.6 + 0.4 * k).toFixed(3)})`, opacity: f < hit ? "0" : "1" };
      }),
    );
    return { body, accent };
  };

/**
 * A truck pulling up: drives in from off the card over two BEATs, braking, and the cab dips forward
 * as it stops and rocks back, each rock DECAY of the last. The wheels (the accent) roll in with it
 * but do not rock.
 */
export const pullUp =
  (distance = 110): Gesture =>
  (start) => {
    const f0 = start + RELEASE;
    const stop = f0 + 2 * BEAT;
    const x = (f: number) => distance * (1 - brake(f, f0, stop));
    const rock: [number, number][] = [
      [stop - BEAT / 2, 0],
      [stop + BEAT / 4, -2.5],
      [stop + 0.75 * BEAT, 2.5 * DECAY],
      [stop + 1.25 * BEAT, -2.5 * DECAY * DECAY],
      [stop + 1.75 * BEAT, 0],
    ];
    const pitch = (f: number) => through(rock, f);
    return {
      body: track(curve(start, stop + 1.75 * BEAT, (f) => ({ transform: `translateX(${x(f).toFixed(2)}px) rotate(${pitch(f).toFixed(2)}deg)` }))),
      accent: track(curve(start, stop, (f) => ({ transform: `translateX(${x(f).toFixed(2)}px)` }))),
    };
  };

/** The whole entrance for a widget landing at `start`: the card, plus its glyph's gesture. */
export function widgetEntrance(start: number, gesture?: Gesture) {
  return {
    card: blurIn(WIDGET_BLUR.map(([f, b, o]) => [start + f, b, o])),
    parts: gesture ? gesture(start) : {},
  };
}

/* ---------- cues: the honest motion inside bigger cards ---------- */

/*
 * Cards mark what may move with `data-cue`, and `cascade` times it all after the card lands. Each cue
 * is something the content really does when it shows up, and they go one after another down the
 * card, so a card reads top to bottom the way it would be written out.
 *   row   a line arrives: clears from soft and pale, rising 3pt (like the reply's words), half a BEAT
 *   fill  a bar fills to its amount, braking, over two BEATs (the element is drawn at its full amount)
 *   grow  a chart bar grows up from its base; bars follow each other a quarter BEAT apart
 *   pop   a dot or badge appears, overshooting by DECAY's worth and settling
 *   draw  a stroke draws itself, braking (pathLength="1"; a part-way stroke sets data-draw to its length)
 */
export type Cue = "row" | "fill" | "grow" | "pop" | "draw";

/** How long after a cue starts the next one may start. */
const NEXT: Record<Cue, number> = { row: BEAT / 2, fill: BEAT / 2, grow: BEAT / 4, pop: BEAT / 2, draw: BEAT / 2 };

function cueTrack(cue: Cue, t: number, length: number): Track {
  switch (cue) {
    case "row":
      return track(
        curve(t, t + BEAT / 2, (f) => {
          const k = brake(f, t, t + BEAT / 2);
          return { opacity: k.toFixed(3), filter: `blur(${(5 * (1 - k)).toFixed(2)}px)`, transform: `translateY(${(3 * (1 - k)).toFixed(2)}px)` };
        }),
      );
    case "fill":
      return track(curve(t, t + 2 * BEAT, (f) => ({ transform: `scaleX(${brake(f, t, t + 2 * BEAT).toFixed(4)})` })));
    case "grow":
      return track(curve(t, t + 1.5 * BEAT, (f) => ({ transform: `scaleY(${brake(f, t, t + 1.5 * BEAT).toFixed(4)})` })));
    case "pop": {
      const k = spring(Math.round(1.5 * BEAT), { stiffness: 520, damping: 20, velocity: 8 });
      return track(k.map((p, i): [number, Record<string, string>] => [t + i, { transform: `scale(${p.toFixed(3)})` }]));
    }
    case "draw":
      return track(curve(t, t + 1.5 * BEAT, (f) => ({ strokeDashoffset: (length * (1 - brake(f, t, t + 1.5 * BEAT))).toFixed(4) })));
  }
}

/** Every cue inside `root`, in reading order, timed to start once the card lands at `start`. Play with fill "both". */
export function cascade(root: Element, start: number): [Element, Track][] {
  let t = start + RELEASE;
  return [...root.querySelectorAll<HTMLElement | SVGElement>("[data-cue]")].map((node) => {
    const cue = node.dataset.cue as Cue;
    const out: [Element, Track] = [node, cueTrack(cue, t, Number(node.dataset.draw ?? 1))];
    t += NEXT[cue];
    return out;
  });
}
