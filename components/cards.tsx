import type { ReactNode } from "react";

/*
 * In-thread rich cards, modeled on the "proposed trade" and rings cards in Flip:
 * off-white card, sentence-case gray header with a thin icon, a large regular-weight
 * title, gray-label / dark-value rows, plain-text status, no tinted badges.
 */

const GRAY = "#6f6f6a";
const INK = "#161616";
const RED = "#a2453b";

function Shell({ children, width = "88%", white = false }: { children: ReactNode; width?: string; white?: boolean }) {
  return (
    <div
      className="flex shrink-0 flex-col gap-3 self-start rounded-[22px] border px-[18px] pb-3.5 pt-4"
      style={{
        width,
        borderColor: white ? "#e8e8e5" : "#e6e6e3",
        background: white ? "#ffffff" : "linear-gradient(180deg, #f7f7f6 0%, #f1f1f0 100%)",
        boxShadow: "0 1px 1px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );
}

function Header({ icon, title, status }: { icon: ReactNode; title: string; status?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-[7px] text-[13px] font-medium" style={{ color: GRAY }}>
        {icon}
        {title}
      </div>
      {status ? (
        <div className="text-[12.5px]" style={{ color: GRAY }}>
          {status}
        </div>
      ) : null}
    </div>
  );
}

function Title({ children, aside, asideColor = GRAY }: { children: ReactNode; aside?: string; asideColor?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="whitespace-nowrap text-[32px] font-normal leading-[1.05] tracking-[-0.025em]" style={{ color: INK }}>
        {children}
      </div>
      {aside ? (
        <div className="whitespace-nowrap text-[15px]" style={{ color: asideColor }}>
          {aside}
        </div>
      ) : null}
    </div>
  );
}

function Rows({ rows }: { rows: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between text-[15px]">
          <span style={{ color: GRAY }}>{r.label}</span>
          <span className="font-semibold" style={{ color: r.color ?? INK }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function Foot({ children }: { children: ReactNode }) {
  return (
    <div className="text-center text-[12.5px]" style={{ color: GRAY }}>
      {children}
    </div>
  );
}

const iconProps = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: GRAY,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const TruckIcon = () => (
  <svg {...iconProps}>
    <path d="M3 6h11v10H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
const ReceiptIcon = () => (
  <svg {...iconProps}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);
const FlowIcon = () => (
  <svg {...iconProps}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M6 8.5V14a4 4 0 0 0 4 4h5.5" />
  </svg>
);
const CalendarIcon = () => (
  <svg {...iconProps}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export function DeliveryLoggedCard() {
  return (
    <Shell>
      <Header icon={<TruckIcon />} title="Delivery logged" status="Matches PO" />
      <Title aside="PO #1042">40 sheets</Title>
      <Rows
        rows={[
          { label: "Item", value: "5/8\" drywall, 4×8" },
          { label: "Vendor", value: "Ridgeline Lumber" },
          { label: "Signed", value: "Marco · 10:40 AM" },
        ]}
      />
      <Foot>Saved to Ramp. Nothing else to do.</Foot>
    </Shell>
  );
}

export function Ring({
  value,
  label,
  fraction,
  color = "#6f84a3",
  numberColor = INK,
  size = 72,
}: {
  value: string;
  label: string;
  fraction: number;
  color?: string;
  numberColor?: string;
  size?: number;
}) {
  const stroke = size >= 70 ? 4.5 : 4;
  const r = size / 2 - stroke - 0.5;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ebebe9" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap={fraction < 1 ? "round" : "butt"}
            strokeDasharray={`${fraction * c} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-normal tracking-[-0.02em]"
          style={{ color: numberColor, fontSize: size * 0.35 }}
        >
          {value}
        </div>
      </div>
      <div className="text-[12.5px]" style={{ color: GRAY }}>
        {label}
      </div>
    </div>
  );
}

/** Flip-style rings card. The rings are scaled to what was billed, so the gap is the overbill. */
export function TicketVsInvoiceCard() {
  return (
    <div
      role="img"
      aria-label="Ordered 40 sheets, delivered 40, billed 45"
      className="grid w-[88%] shrink-0 grid-cols-3 gap-1 self-start rounded-[22px] border border-[#e8e8e5] bg-white px-2 pb-4 pt-[18px]"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)" }}
    >
      <Ring value="40" label="Ordered" fraction={40 / 45} />
      <Ring value="40" label="Delivered" fraction={40 / 45} />
      <Ring value="45" label="Billed" fraction={1} color="#b5594e" numberColor={RED} />
    </div>
  );
}

export function BillOnHoldCard() {
  return (
    <Shell>
      <Header icon={<ReceiptIcon />} title="Bill on hold" status="For your review" />
      <Title aside="−$237.50 held" asideColor={RED}>
        Pay $1,900
      </Title>
      <Rows
        rows={[
          { label: "Vendor", value: "Ridgeline Lumber" },
          { label: "Ordered", value: "40 sheets" },
          { label: "Delivered", value: "40 sheets" },
          { label: "Billed", value: "45 sheets", color: RED },
        ]}
      />
      <button
        type="button"
        className="mt-0.5 h-[50px] rounded-full text-[16px] font-semibold text-white"
        style={{
          background: "linear-gradient(180deg, #3d3838 0%, #221e1e 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 14px rgba(0,0,0,0.22)",
        }}
        tabIndex={-1}
      >
        Review bill
      </button>
      <Foot>Nothing is paid until you approve.</Foot>
    </Shell>
  );
}

function Step({ kind, children }: { kind: "When" | "Action"; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-[#e6e6e3] bg-white p-2.5 text-[13.5px]" style={{ color: INK }}>
      <span
        className="shrink-0 rounded-md px-[7px] py-[3px] text-[11.5px] font-semibold"
        style={{ background: kind === "When" ? "#e2eafb" : "#e6f2c4", color: INK }}
      >
        {kind}
      </span>
      <span>{children}</span>
    </div>
  );
}

const Connector = () => <div className="ml-[26px] h-[7px] w-px bg-[#d9d9d5]" />;

export function WorkflowCard() {
  return (
    <Shell width="90%">
      <Header icon={<FlowIcon />} title="Workflow" />
      <div className="flex flex-col gap-1.5">
        <div className="text-[23px] font-normal leading-[1.18] tracking-[-0.02em]" style={{ color: INK }}>
          Check every delivery before it&apos;s paid
        </div>
        <div className="text-[12px]" style={{ color: GRAY }}>
          On · every materials PO · made by Ramp
        </div>
      </div>
      <div className="mt-0.5 text-[16px]" style={{ color: INK }}>
        How it runs
      </div>
      <div className="flex flex-col">
        <Step kind="When">a PO&apos;s delivery day starts</Step>
        <Connector />
        <Step kind="Action">text the site lead for the ticket</Step>
        <Connector />
        <Step kind="When">the vendor&apos;s invoice arrives</Step>
        <Connector />
        <Step kind="Action">match order, ticket and invoice</Step>
        <Connector />
        <Step kind="Action">off by 1%+? hold it, text Dana</Step>
      </div>
      <Foot>Pause or change it any time by text.</Foot>
    </Shell>
  );
}

export function RecapCard() {
  return (
    <Shell width="90%">
      <Header icon={<CalendarIcon />} title="This week at Hartwell" />
      <Title>$1,912 caught</Title>
      <Rows
        rows={[
          { label: "Deliveries checked", value: "38" },
          { label: "Held and disputed", value: "4" },
          { label: "Credits received", value: "+$1,180", color: "#3f6e44" },
        ]}
      />
      <div className="flex flex-col gap-2.5 rounded-[18px] border border-[#e8e8e5] bg-white px-2 pb-3 pt-3.5">
        <div className="text-center text-[12.5px]" style={{ color: GRAY }}>
          Delivered as billed
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Ring value="100" label="Bay Drywall" fraction={1} size={64} />
          <Ring value="63" label="Ridgeline" fraction={0.63} size={64} color="#b5594e" numberColor={RED} />
        </div>
      </div>
    </Shell>
  );
}
