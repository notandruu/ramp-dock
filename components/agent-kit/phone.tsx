"use client";

import type { CSSProperties, ReactNode } from "react";

/*
 * The phone and the thread's pieces from the "Text your agent" clip, shared by the replica (/lab)
 * and the demo (/lab/demo). Sizes are iOS points, measured off the clip at 1.8015 px per pt.
 */

export const SENT_BLUE = "#83b2e6";
export const THEM_GRAY = "#eeeeee";
export const SCREEN = "#fdfdfd";

/* ---------- measured motion ---------- */

/**
 * The sent bubble's flight, per frame: its bottom edge in clip px (the settled bubble ends at 992)
 * and its scale (height / settled height). It starts behind the frosted input, rises, overshoots
 * about 6pt and settles. Origin is bottom right: the right edge never moves.
 */
export const FLIGHT: [frame: number, bottom: number, scale: number, opacity: number][] = [
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
export const SCROLL = [0, 0.02, 0.16, 0.25, 0.35, 0.44, 0.53, 0.62, 0.69, 0.76, 0.81, 0.86, 0.9, 0.93, 0.96, 0.98, 0.99, 1];
export const SCROLL_PT = 111;

export const PX_PER_PT = 1.8015;

export function Tail({ side, color }: { side: "left" | "right"; color: string }) {
  // The little hook under the last bubble of a run, measured at about 16 x 9pt.
  const style: CSSProperties =
    side === "right" ? { position: "absolute", right: -4, bottom: -1, transform: "scaleX(-1)" } : { position: "absolute", left: -4, bottom: -1 };
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" style={style} aria-hidden="true">
      <path d="M6 0 C6 7 4 12 0 16 C7 15 12 12 15 7 Z" fill={color} />
    </svg>
  );
}

export function Sent({ children, style, innerRef }: { children: ReactNode; style?: CSSProperties; innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "0 20px",
        ...style,
      }}
    >
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

export function Them({
  children,
  style,
  innerRef,
  ghost = false,
}: {
  children: ReactNode;
  style?: CSSProperties;
  innerRef?: React.Ref<HTMLDivElement>;
  /** Text only: something else paints the bubble behind it. */
  ghost?: boolean;
}) {
  return (
    <div style={{ display: "flex", padding: "0 20px", ...style }}>
      <div
        ref={innerRef}
        style={{
          position: "relative",
          zIndex: ghost ? 1 : undefined,
          background: ghost ? "transparent" : THEM_GRAY,
          color: "#0c0c0c",
          borderRadius: 20,
          padding: "9px 15px",
          fontSize: 17,
          lineHeight: "21px",
          letterSpacing: -0.2,
        }}
      >
        {children}
        {!ghost && <Tail side="left" color={THEM_GRAY} />}
      </div>
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

export function StatusBar() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "0 0 auto 0",
        height: 54,
        zIndex: 6,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 19,
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: -0.3,
        }}
      >
        9:41
      </div>
      <div
        style={{
          position: "absolute",
          left: 133.5,
          top: 11,
          width: 126,
          height: 37,
          borderRadius: 19,
          background: "#000",
        }}
      />
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

export function Header({ name = "Acme", logo }: { name?: string; logo?: ReactNode }) {
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 7,
          pointerEvents: "none",
        }}
      >
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
          {logo ?? (
            <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true">
              <path d="M12 0 L24 18 H18.2 L12 8.6 L5.8 18 H0 Z" fill="#0c0c0c" />
            </svg>
          )}
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
          {name}
          <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true">
            <path d="M1 1 L5 5 L1 9" fill="none" stroke="#8e8e93" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </>
  );
}

export type ComposerRefs = {
  typed: React.RefObject<HTMLSpanElement | null>;
  placeholder: React.RefObject<HTMLSpanElement | null>;
  mic: React.RefObject<SVGSVGElement | null>;
  sendBtn: React.RefObject<HTMLDivElement | null>;
  sendArrow: React.RefObject<SVGSVGElement | null>;
  sendMic: React.RefObject<SVGSVGElement | null>;
};

/** The frosted message field with its send button. */
export function Composer({ refs }: { refs: ComposerRefs }) {
  return (
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
      <div
        style={{
          position: "absolute",
          left: 51.5,
          top: 0,
          height: 57,
          display: "flex",
          alignItems: "center",
          fontSize: 17,
          letterSpacing: -0.2,
        }}
      >
        <span ref={refs.placeholder} style={{ position: "absolute", color: "#949494" }}>
          Message
        </span>
        <span ref={refs.typed} style={{ color: "#0c0c0c", whiteSpace: "pre" }} />
      </div>
      <svg ref={refs.mic} width="14" height="22" viewBox="0 0 14 22" style={{ position: "absolute", left: 317, top: 17.5 }} aria-hidden="true">
        <rect x="3.5" y="1" width="7" height="12" rx="3.5" fill="none" stroke="#1c1c1e" strokeWidth="1.6" />
        <path d="M1 10 a6 6 0 0 0 12 0 M7 16 v4" fill="none" stroke="#1c1c1e" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div
        ref={refs.sendBtn}
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
        <svg ref={refs.sendArrow} width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
          <path d="M7 15 V2 M1.5 7.5 L7 2 L12.5 7.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg ref={refs.sendMic} width="12" height="18" viewBox="0 0 14 22" style={{ position: "absolute" }} aria-hidden="true">
          <rect x="3.5" y="1" width="7" height="12" rx="3.5" fill="none" stroke="#1c1c1e" strokeWidth="1.6" />
          <path d="M1 10 a6 6 0 0 0 12 0 M7 16 v4" fill="none" stroke="#1c1c1e" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/** iPhone 16 Pro: titanium rim, black bezel, a 393 x 852 screen. Scaled to fit by the caller. */
export function PhoneFrame({ scale = 1, children }: { scale?: number; children: ReactNode }) {
  return (
    <div style={{ width: 421 * scale, height: 880 * scale }}>
      <div
        style={{
          width: 421,
          height: 880,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
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
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 65,
              background: "#000",
              padding: 10,
            }}
          >
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
              {children}
              <div
                style={{
                  position: "absolute",
                  left: 129.5,
                  top: 838,
                  width: 134,
                  height: 5,
                  borderRadius: 3,
                  background: "#000",
                  zIndex: 9,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Scale that fits the phone and its frame in the window. */
export function fitScale() {
  return Math.min(1, (window.innerHeight - 48) / 880, (window.innerWidth - 32) / 421);
}
