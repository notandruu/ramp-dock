/*
 * The thread's own motion, measured off the "Text your agent" clip and keyed so it can happen at any
 * frame: the send button, the sent bubble rising out of the field, the typing dots, the dots turning
 * into the reply, and the scroll. The replica plays them at the clip's frames, the demo wherever its
 * script puts them.
 */

import { blurIn, resample, spring, track, type Track } from "./motion";
import { FLIGHT, PX_PER_PT, SCROLL } from "./phone";

/** The send button blurs in as the first key lands at `key`. */
export const sendButtonIn = (key: number) =>
  blurIn([
    [key, 6, 0, 0.4],
    [key + 2, 5, 0.5, 0.7],
    [key + 4, 3, 0.75, 0.95],
    [key + 6, 1.5, 0.9, 1],
    [key + 9, 0, 1, 1],
  ]);

/** And fades as the message goes, `send` being the frame the field clears. */
export const sendButtonOut = (send: number) =>
  track([
    [send + 2, { opacity: 1 }],
    [send + 8, { opacity: 0 }],
  ]);

/** The frame after `send` when the button's arrow turns back into the mic. */
export const MIC_BACK = 3;

/** The sent bubble rising from behind the field, overshooting about 6pt and settling 42 frames later. */
export const flight = (send: number) =>
  track(
    resample(FLIGHT).map(([f, bottom, s, o]) => [
      f - 150 + send,
      { transform: `translateY(${((bottom - 992) / PX_PER_PT).toFixed(2)}px) scale(${s.toFixed(4)})`, opacity: Math.min(1, o) },
    ]),
  );
export const FLIGHT_FRAMES = 42;

/** The typing dots blurring in at `at`. */
export const typingIn = (at: number) =>
  blurIn([
    [at, 8, 0],
    [at + 2, 6, 0.6],
    [at + 7, 0, 1],
  ]);

/**
 * The dots bubble becoming a `w` x `h` reply at `at`: the dots blur away, the bubble is already the
 * reply's size, blurred and about 8pt low, and springs up into place in 9 frames. The words sit on top
 * and clear a beat behind the bubble.
 */
export function replyMorph(at: number, w: number, h: number): { dots: Track; dotsInner: Track; reply: Track } {
  const rise = spring(9, { stiffness: 1000, damping: 58, velocity: 22 }).map((p, i) => ({ f: at + i, y: 8 * (1 - p) }));
  const textBlur: [blur: number, opacity: number][] = [
    [7, 0.55],
    [2.6, 0.85],
    [1.8, 0.92],
    [1.1, 0.97],
    [0.45, 1],
    [0.1, 1],
  ];
  return {
    dotsInner: track([
      [at - 1, { opacity: 1, filter: "blur(0px)" }],
      [at, { opacity: 0, filter: "blur(4px)" }],
    ]),
    dots: track([
      [at - 1, { width: "61px", height: "34px", borderRadius: "17px", transform: "translateY(0px)", filter: "blur(0px)" }],
      ...rise.map(({ f, y }): [number, Record<string, string>] => [
        f,
        {
          width: `${w}px`,
          height: `${h}px`,
          borderRadius: "20px",
          transform: `translateY(${y.toFixed(2)}px)`,
          filter: `blur(${Math.max(0, 5 - 4 * (f - at)).toFixed(2)}px)`,
        },
      ]),
    ]),
    reply: track(
      rise.map(({ f, y }) => {
        const [blur, opacity] = textBlur[f - at] ?? [0, 1];
        return [f, { opacity, filter: `blur(${blur}px)`, transform: `translateY(${y.toFixed(2)}px)` }];
      }),
    ),
  };
}

/** The thread scrolling from `from` to `to` points (positive is up), on the clip's 17-frame curve starting at `at`. */
export const scroll = (at: number, from: number, to: number) =>
  track(resample(SCROLL.map((p, i) => [at + i, p])).map(([f, p]) => [f, { transform: `translateY(${(-(from + (to - from) * p)).toFixed(2)}px)` }]));
export const SCROLL_FRAMES = SCROLL.length - 1;
