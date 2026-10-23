import type { ReactNode } from "react";

/** Ramp's logo mark, taken from the wordmark on ramp.com. Fills with the current text color. */
export function RampMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="50.9 -1.6 20 19" fill="currentColor" aria-hidden="true">
      <path d="M70.028 15.612v.07h-9.983v-.07c1.439-.82 2.432-1.654 3.327-2.526h4.1zm-2.473-13.11L65.027 0h-.074s.042 4.664-4.205 8.906c-4.156 4.15-9.046 4.16-9.046 4.16v.074l2.578 2.546s4.819.05 9.074-4.16c4.24-4.195 4.205-9.022 4.205-9.022z" />
    </svg>
  );
}

/** The Ramp Dock contact avatar: full-bleed lime circle with the Ramp mark. */
export function Avatar({ size = 56 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full bg-lime text-[#111111]"
      style={{ width: size, height: size }}
    >
      <RampMark size={size * 0.56} />
    </div>
  );
}

/** An iPhone-style iMessage thread with Ramp Dock. 390 x 844, like an iPhone 14/15. */
export function Phone({
  children,
  label,
}: {
  children: ReactNode;
  /** Accessible description of the whole screen. */
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[56px] border-[10px] border-[#121212] bg-white text-[#111111] shadow-[0_30px_60px_-30px_rgba(16,19,26,0.35)]"
    >
      <div className="absolute left-1/2 top-[10px] h-8 w-[110px] -translate-x-1/2 rounded-2xl bg-[#0a0a0a]" />
      <div className="flex flex-col items-center gap-1.5 px-4 pb-2.5 pt-[54px]">
        <Avatar />
        <div className="rounded-full bg-[#f2f2f1] px-2.5 py-[3px] text-[13px] font-semibold">Ramp Dock</div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3.5 py-3">{children}</div>
      <div className="flex items-center gap-2 px-3 pb-[22px] pt-2">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#ececee]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#55554f" strokeWidth={2.4} strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <div className="flex h-[34px] flex-1 items-center rounded-full border border-[#d4d4d6] px-3.5 text-[15px] text-[#8e8e93]">
          Text Message
        </div>
      </div>
    </div>
  );
}

/** Renders a Phone at a smaller size without leaving empty layout space. */
export function Scaled({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: 390 * scale, height: 844 * scale }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

export function Stamp({ children }: { children: ReactNode }) {
  return <div className="mb-0.5 mt-2 shrink-0 self-center text-[11px] font-medium text-[#6b6b66]">{children}</div>;
}

/** A message from Ramp Dock (gray, left). */
export function Them({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[80%] shrink-0 self-start rounded-[18px] bg-[#e9e9eb] px-3 py-2 text-[15px] leading-[1.3]">
      {children}
    </div>
  );
}

/** A message from the person (blue, right). */
export function Me({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[80%] shrink-0 self-end rounded-[18px] bg-[#0b6beb] px-3 py-2 text-[15px] leading-[1.3] text-white">
      {children}
    </div>
  );
}

export function Read({ children }: { children: ReactNode }) {
  return <div className="shrink-0 self-end pr-1 text-[11px] font-medium text-[#6b6b66]">{children}</div>;
}

/** The photo Marco sends: a signed, handwritten delivery ticket on a truck tailgate. */
export function TicketPhoto() {
  return (
    <div className="h-[176px] w-[150px] shrink-0 self-end overflow-hidden rounded-[18px] bg-[#8c8a84] px-[13px] py-[14px]">
      <div className="flex h-full -rotate-3 flex-col gap-1 bg-[#fbf6e6] p-[9px] shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <div className="text-[7.5px] font-bold tracking-[0.06em]">RIDGELINE LUMBER</div>
        <div className="text-[6px] font-semibold text-[#6b6b66]">DELIVERY TICKET No. 20417</div>
        <div className="my-0.5 h-px bg-[#c9c2a8]" />
        <div className="text-[6px] text-[#55554f]">PO 1042 · ELM ST</div>
        <div className="font-hand text-[20px] font-bold leading-none text-[#1d3a8a]">40 sh 5/8 DW</div>
        <div className="font-hand text-[12px] font-semibold leading-none text-[#1d3a8a]">5 b/o</div>
        <div className="mt-auto border-b border-[#55554f] font-hand text-[14px] leading-none text-[#1d3a8a]">M. Ortiz</div>
      </div>
    </div>
  );
}
