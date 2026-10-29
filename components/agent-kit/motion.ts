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

/** How the card itself arrives, frames after it lands: soft and pale, crisp by 9. */
export const WIDGET_BLUR: [frame: number, blur: number, opacity: number][] = [
  [0, 14, 0.2],
  [4, 6, 0.6],
  [7, 1, 0.95],
  [9, 0, 1],
];

/**
 * How its glyph rings, frames after the card lands, as swing in degrees (clockwise) at each turning
 * point. Held lifted while the card blurs in, let go at 8, about 13 frames per swing, still at 111.
 */
export const WIDGET_RING: [frame: number, swing: number][] = [
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

/** The whole entrance for a widget landing at `start`: one track for the card, one for its glyph. */
export function widgetEntrance(start: number, glyphPose: (swing: number) => string) {
  return {
    card: blurIn(WIDGET_BLUR.map(([f, b, o]) => [start + f, b, o])),
    glyph: swing(
      WIDGET_RING.map(([f, a]) => [start + f, a]),
      glyphPose,
    ),
  };
}
