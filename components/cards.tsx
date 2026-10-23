import type { ReactNode } from "react";
import { RampMark } from "./phone";

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

const ReceiptIcon = () => (
  <svg {...iconProps}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);
const DocIcon = () => (
  <svg {...iconProps}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M9 12h6M9 16h6" />
  </svg>
);
const CheckIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12.2l2.4 2.4 4.6-4.9" />
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
      <Header icon={<RampMark size={16} />} title="Delivery logged" status="Matches the order" />
      <Title aside="Order #1042">40 sheets</Title>
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
      <DarkButton>Review bill</DarkButton>
      <Foot>Nothing is paid until you approve.</Foot>
    </Shell>
  );
}

const DarkButton = ({ children }: { children: ReactNode }) => (
  <button
    type="button"
    className="mt-0.5 h-[50px] rounded-full text-[16px] font-semibold text-white"
    style={{
      background: "linear-gradient(180deg, #3d3838 0%, #221e1e 100%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 6px 14px rgba(0,0,0,0.22)",
    }}
    tabIndex={-1}
  >
    {children}
  </button>
);

/** Procurement: a purchase request Ramp drafted from one text. */
export function RequestCard() {
  return (
    <Shell>
      <Header icon={<DocIcon />} title="Purchase request" status="Waiting on Priya" />
      <Title aside="2 items">$598</Title>
      <Rows
        rows={[
          { label: "Item", value: "27\" monitor × 2" },
          { label: "Vendor", value: "Northwind Supply" },
          { label: "Budget", value: "Design · $2,140 left" },
        ]}
      />
      <Foot>Made from your text. No form to fill out.</Foot>
    </Shell>
  );
}

/** Approvals: everything the approver needs, in the thread. */
export function ApprovalCard() {
  return (
    <Shell>
      <Header icon={<CheckIcon />} title="Needs your approval" status="From Jordan" />
      <Title aside="Northwind Supply">$598</Title>
      <Rows
        rows={[
          { label: "Item", value: "27\" monitor × 2" },
          { label: "Design budget after", value: "$1,542 left" },
          { label: "Policy", value: "Within limits" },
        ]}
      />
      <DarkButton>Approve</DarkButton>
      <Foot>Reply yes to approve or no to decline.</Foot>
    </Shell>
  );
}

/** Vendor Management: a renewal, with what's actually used. */
export function RenewalCard() {
  return (
    <Shell>
      <Header icon={<CalendarIcon />} title="Contract renewal" status="In 14 days" />
      <Title aside="per year">$18,000</Title>
      <Rows
        rows={[
          { label: "Vendor", value: "Canvas Cloud" },
          { label: "Seats", value: "30 paid · 24 used" },
          { label: "Unused", value: "$3,600 a year", color: RED },
        ]}
      />
      <Foot>Nothing changes until you say yes.</Foot>
    </Shell>
  );
}
