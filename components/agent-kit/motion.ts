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
export function playTrack(node: Element, t: Track) {
  return node.animate(t.keyframes, { delay: t.delay, duration: t.duration, easing: "linear", fill: "forwards" });
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
 * Pendulum motion through turning points: each swing eases out of one point and into the next,
 * the way a hanging thing slows at the top of its arc.
 */
export function swing(points: [frame: number, value: number][], pose: (value: number) => string): Track {
  const out: [number, { transform: string }][] = [];
  points.forEach(([f0, a0], i) => {
    const next = points[i + 1];
    if (!next) return out.push([f0, { transform: pose(a0) }]);
    const [f1, a1] = next;
    for (let f = f0; f < f1; f += 0.25) out.push([f, { transform: pose(a0 + ((a1 - a0) * (1 - Math.cos((Math.PI * (f - f0)) / (f1 - f0)))) / 2) }]);
  });
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

/**
 * Feeds out like a slip from a printer: slides down its own length at an even pace over two BEATs,
 * stops with a small give, then its accent pops in (a BEAT, overshooting by DECAY's worth and back).
 */
export const feed =
  (length = 40): Gesture =>
  (start) => {
    const f0 = start + RELEASE;
    const f1 = f0 + 2 * BEAT;
    const body = track([
      [start, { transform: `translateY(${-length}px)` }],
      [f0, { transform: `translateY(${-length}px)` }],
      [f1, { transform: "translateY(0px)" }],
      [f1 + BEAT / 3, { transform: "translateY(-1.2px)" }],
      [f1 + BEAT, { transform: "translateY(0px)" }],
    ]);
    const pop = spring(Math.round(BEAT * 1.5), { stiffness: 520, damping: 20, velocity: 8 });
    const accent = track([
      [start, { transform: "scale(0)" }],
      [f1, { transform: "scale(0)" }],
      ...pop.map((p, i): [number, { transform: string }] => [f1 + 1 + i, { transform: `scale(${p.toFixed(3)})` }]),
    ]);
    return { body, accent };
  };

/** The whole entrance for a widget landing at `start`: the card, plus its glyph's gesture. */
export function widgetEntrance(start: number, gesture?: Gesture) {
  return {
    card: blurIn(WIDGET_BLUR.map(([f, b, o]) => [start + f, b, o])),
    parts: gesture ? gesture(start) : {},
  };
}
