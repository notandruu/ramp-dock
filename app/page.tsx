import type { ReactNode } from "react";
import { HeroThreads, type HeroPanel } from "@/components/hero-threads";
import { Avatar, RampMark, Scaled } from "@/components/phone";
import { ScreenApprove, ScreenHeadsUp, ScreenHold, ScreenRenewal, ScreenRequest } from "@/components/screens";

/* ---------- small building blocks ---------- */

function Icon({ d, color, size = 22 }: { d: string; color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICON = {
  message: "M4 5h16v11H9l-5 4z",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  key: "M15 7a4 4 0 1 1-3.9 5H4v3h3v2h3v-2.1A4 4 0 0 1 15 7z",
  columns: "M4 20V10M10 20V4M16 20v-8M3 20h18",
  reply: "M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 6 6v3",
  check: "M5 12.5l4.5 4.5L19 7.5",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  hand: "M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-6.5a1.5 1.5 0 0 1 3 0V12m0-5a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-12.4 4.5L3.5 14a1.6 1.6 0 0 1 2.6-1.8L8 14",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  dollar: "M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.4-4.5 3.3 0 4.4 9 2.2 9 6.9 0 2-1.8 3.5-4.5 3.5-2.4 0-4.3-1.1-4.8-2.8",
  rings: "M12 21a9 9 0 1 1 0-18M12 16a4 4 0 1 1 0-8",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  calendar: "M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4",
};

function CtaButton({ children = "See how it works" }: { children?: ReactNode }) {
  return (
    <a
      href="#request"
      className="inline-flex items-center gap-3 rounded-[22px] bg-[#1b1b1d] py-3 pl-3 pr-6 text-[17px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition hover:bg-black"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#34c759]">
        <Icon d={ICON.message} color="#ffffff" size={20} />
      </span>
      {children}
    </a>
  );
}

/* ---------- hero ---------- */

// One panel per step of Procure to Pay. The second exchange in each shows another kind of business.
const heroPanels: HeroPanel[] = [
  {
    icon: <Icon d={ICON.message} color="#34c759" size={24} />,
    title: "1. Ask for it.",
    body: "Text what you need. Ramp finds the vendor, checks the budget and sends it for approval.",
    label: "A designer texts that they need 2 monitors. Ramp Dock finds them for $598 and sends the request to the approver.",
    exchanges: [
      [
        { from: "me", text: "need 2 monitors for the new designers, under $700" },
        { from: "them", text: "found them at Northwind Supply. $598 for both, and it fits the design budget" },
        { from: "them", text: "sent to Priya to approve. I'll text you when it's done" },
      ],
      [
        { from: "me", text: "we're almost out of olive oil. order the usual" },
        { from: "them", text: "6 cases from Harbor Foods, $312. same as last month" },
        { from: "them", text: "it's under your $500 limit, so it's already approved. arrives tomorrow at 7am" },
      ],
    ],
  },
  {
    icon: <Icon d={ICON.check} color="#2f6fe4" size={24} />,
    title: "2. Approve it.",
    body: "The approver gets a text with the price and the budget left. One reply approves it.",
    label: "The design lead is asked to approve 2 monitors for $598. She replies yes and the order goes out.",
    exchanges: [
      [
        { from: "them", text: "Jordan needs 2 monitors from Northwind Supply" },
        { from: "them", text: "$598. the design budget has $2,140 left. reply yes to approve" },
        { from: "me", text: "yes" },
        { from: "them", text: "approved. order sent, arriving Thursday" },
      ],
      [
        { from: "them", text: "Marco needs 40 sheets of drywall for Elm St" },
        { from: "them", text: "$1,900 from Ridgeline Lumber. under the job budget. approve?" },
        { from: "me", text: "yes" },
        { from: "them", text: "done. Ridgeline delivers Monday" },
      ],
    ],
  },
  {
    icon: <Icon d={ICON.receipt} color="#a2453b" size={24} />,
    title: "3. Pay the right amount.",
    body: "Ramp checks each bill against the order and what arrived, then asks before paying.",
    label: "Ramp Dock finds a bill for 45 sheets when 40 arrived. The controller replies 1 to pay $1,900 and dispute the rest.",
    exchanges: [
      [
        { from: "them", text: "Ridgeline billed 45 sheets, but Marco's photo of the slip shows 40" },
        { from: "them", text: "reply 1 to pay $1,900 for what arrived and dispute the other $237.50" },
        { from: "me", text: "1" },
        { from: "them", text: "done. $1,900 goes out Nov 3 and the dispute is sent with the photo" },
      ],
      [
        { from: "them", text: "Northwind's bill matches the order, and Jordan says both monitors arrived" },
        { from: "them", text: "reply 1 to pay $598 on the due date" },
        { from: "me", text: "1" },
        { from: "them", text: "scheduled for Nov 14" },
      ],
    ],
  },
  {
    icon: <Icon d={ICON.calendar} color="#b07a1f" size={24} />,
    title: "4. Stay ahead of renewals.",
    body: "A text before each contract renews, with what you actually use and what to ask for.",
    label: "Ramp Dock texts that a software contract renews in 14 days with 6 unused seats. The controller replies yes to ask for fewer.",
    exchanges: [
      [
        { from: "them", text: "heads up. Canvas Cloud renews in 14 days for $18,000" },
        { from: "them", text: "only 24 of your 30 seats are used. want me to ask for 24? saves $3,600 a year" },
        { from: "me", text: "yes" },
        { from: "them", text: "sent to their account rep. I'll text you when they answer" },
      ],
      [
        { from: "them", text: "Ridgeline billed for more than they delivered on 3 of their last 8 orders" },
        { from: "them", text: "their prices renew Dec 1. add this to the review?" },
        { from: "me", text: "yes" },
        { from: "them", text: "added, with all 3 delivery photos" },
      ],
    ],
  },
];

function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-10 md:pt-14">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <h1 className="max-w-[1000px] text-balance text-[44px] font-normal leading-[1.05] tracking-[-0.035em] text-ink md:text-[68px]">
          Buy, approve and pay for things by text.
          <span className="mt-5 block max-w-[760px] text-[22px] leading-[1.35] tracking-[-0.015em] text-[#8b8f97] md:text-[28px]">
            Ramp Dock puts Ramp&apos;s Procure to Pay in a text thread. Anyone can ask for what they need, approve it and
            pay the right amount without opening the dashboard.
          </span>
        </h1>
        <div className="shrink-0">
          <CtaButton />
        </div>
      </div>

      <HeroThreads panels={heroPanels} />
    </section>
  );
}

/* ---------- feature sections ---------- */

type Feature = {
  id: string;
  eyebrow: string;
  color: string;
  title: ReactNode;
  body: string;
  bullets: { icon: string; text: string }[];
  screen: ReactNode;
};

const features: Feature[] = [
  {
    id: "request",
    eyebrow: "Procurement",
    color: "#c2346a",
    title: <>Ask for anything in one text.</>,
    body: "Text Ramp Dock what you need, like you would a coworker. It picks a vendor you already use, checks the budget and your company's rules, and sends the request to the right approver. No forms.",
    bullets: [
      { icon: ICON.message, text: "Ask in plain words" },
      { icon: ICON.shield, text: "Checks budget and company rules" },
      { icon: ICON.reply, text: "Goes to the right approver" },
    ],
    screen: <ScreenRequest />,
  },
  {
    id: "approve",
    eyebrow: "Approvals",
    color: "#2f6fe4",
    title: <>Approve with one reply.</>,
    body: "Approvers are usually busy and away from the dashboard, so requests sit and wait. Ramp Dock texts them what it is, what it costs and how much budget is left. They reply yes and it's done.",
    bullets: [
      { icon: ICON.list, text: "Price, budget and rules in one text" },
      { icon: ICON.check, text: "Reply yes or no" },
      { icon: ICON.key, text: "No login needed" },
    ],
    screen: <ScreenApprove />,
  },
  {
    id: "receive",
    eyebrow: "Receiving",
    color: "#d9662b",
    title: <>Whoever gets the delivery sends a photo.</>,
    body: "When an order is due, Ramp Dock texts the person receiving it: a site lead, a chef or an office manager. They reply with a photo of the delivery slip, and Ramp records what actually arrived.",
    bullets: [
      { icon: ICON.bell, text: "A text on delivery day" },
      { icon: ICON.camera, text: "Reads the slip, even handwriting" },
      { icon: ICON.key, text: "No Ramp account for the receiver" },
    ],
    screen: <ScreenHeadsUp />,
  },
  {
    id: "pay",
    eyebrow: "Accounts Payable",
    color: "#3f8a4a",
    title: <>Every bill is checked before it&apos;s paid.</>,
    body: "When a bill comes in, Ramp matches it to the order and to what arrived. If it's right, one reply schedules the payment. If it asks for too much, you pay for what came and dispute the rest, with the photo as proof.",
    bullets: [
      { icon: ICON.columns, text: "Checks the order, delivery and bill" },
      { icon: ICON.dollar, text: "Pays only for what arrived" },
      { icon: ICON.hand, text: "Nothing is paid until you say yes" },
    ],
    screen: <ScreenHold />,
  },
  {
    id: "renew",
    eyebrow: "Vendor Management",
    color: "#9a7a3a",
    title: <>Hear about renewals before they charge you.</>,
    body: "Two weeks before a contract renews, Ramp Dock texts you the price, how much of it you actually use and what to ask for. Reply yes and it reaches out to the vendor for you.",
    bullets: [
      { icon: ICON.calendar, text: "A text before every renewal" },
      { icon: ICON.rings, text: "Shows what you actually use" },
      { icon: ICON.reply, text: "Asks the vendor for you" },
    ],
    screen: <ScreenRenewal />,
  },
];

function FeatureSection({ f, flip }: { f: Feature; flip: boolean }) {
  return (
    <section id={f.id} className="mx-auto max-w-[1280px] scroll-mt-10 px-6 py-14 md:py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={flip ? "lg:order-2" : ""}>
          <div className="text-[19px] font-medium" style={{ color: f.color }}>
            {f.eyebrow}
          </div>
          <h2 className="mt-5 text-balance text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-ink md:text-[56px]">
            {f.title}
          </h2>
          <p className="mt-7 max-w-[560px] text-[19px] leading-[1.55] text-muted md:text-[21px]">{f.body}</p>
          <ul className="mt-9 flex flex-col gap-5">
            {f.bullets.map((b) => (
              <li key={b.text} className="flex items-center gap-4 text-[19px] md:text-[21px]" style={{ color: f.color }}>
                <Icon d={b.icon} color={f.color} size={26} />
                {b.text}
              </li>
            ))}
          </ul>
        </div>
        <div className={`flex justify-center overflow-hidden rounded-[40px] bg-[#f7f7f5] pt-14 ${flip ? "lg:order-1" : ""}`}>
          <div className="-mb-10">
            <Scaled scale={0.8}>{f.screen}</Scaled>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- built on Ramp ---------- */

const stack = [
  {
    name: "Procurement",
    today: "Purchase requests and approvals, made in the dashboard.",
    dock: "Ask for things and approve them by text. The person asking needs no Ramp account.",
  },
  {
    name: "Accounts Payable",
    today: "Bills read, checked against the order and paid, by someone at a desk.",
    dock: "Bills also checked against a photo of what arrived. Pay the right amount with one reply.",
  },
  {
    name: "Vendor Management",
    today: "Contracts, renewal dates and price comparisons, in the dashboard.",
    dock: "A text before each renewal, with what you use and what to ask for.",
  },
];

function BuiltOnRamp() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-20 md:py-28">
      <div className="max-w-[1000px]">
        <div className="text-[19px] font-medium text-[#6a4fd0]">Built on Ramp</div>
        <h2 className="mt-5 text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-ink md:text-[58px]">
          This is Ramp&apos;s Procure to Pay.
          <span className="block text-[#8b8f97]">Now it works by text.</span>
        </h2>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {stack.map((s) => (
          <div key={s.name} className="flex flex-col gap-6 rounded-[28px] bg-[#f7f7f5] p-8">
            <div className="text-[24px] font-normal tracking-[-0.02em] text-ink">{s.name}</div>
            <div>
              <div className="text-[14px] font-medium text-muted">In Ramp today</div>
              <p className="mt-1.5 text-[17px] leading-[1.5] text-[#3d4048]">{s.today}</p>
            </div>
            <div className="h-px bg-[#e4e4e0]" />
            <div>
              <div className="text-[14px] font-medium text-[#6a4fd0]">With Ramp Dock</div>
              <p className="mt-1.5 text-[17px] leading-[1.5] text-ink">{s.dock}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- trust ---------- */

const rules = [
  {
    icon: ICON.key,
    title: "Anyone can be a phone number",
    body: "People who ask, approve or receive only need a phone number. No Ramp account, no app, no training.",
  },
  {
    icon: "ramp",
    title: "Ramp knows when to text",
    body: "A new request, a delivery date, a bill or a renewal each texts the right person at the right time.",
  },
  {
    icon: ICON.shield,
    title: "Your rules still apply",
    body: "Same approvers, limits and policies as the dashboard, and every reply is saved in Ramp.",
  },
];

function Trust() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20 md:pb-28">
      <div className="rounded-[40px] bg-[#111214] px-8 py-14 text-white md:px-16 md:py-20">
        <div className="text-[19px] font-medium text-lime">Safe by design</div>
        <h2 className="mt-5 max-w-[760px] text-[38px] font-normal leading-[1.1] tracking-[-0.03em] md:text-[54px]">
          The same Ramp rules, just by text.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {rules.map((r) => (
            <div key={r.title}>
              {r.icon === "ramp" ? (
                <span className="text-lime">
                  <RampMark size={28} />
                </span>
              ) : (
                <Icon d={r.icon} color="#DFF50A" size={28} />
              )}
              <div className="mt-5 text-[21px] font-medium tracking-[-0.01em]">{r.title}</div>
              <p className="mt-2 text-[17px] leading-[1.55] text-[#a6a8ad]">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- opportunity ---------- */

const stats = [
  { value: "80%", label: "Of workers don't sit at a desk", source: "Emergence Capital" },
  { value: "98%", label: "Of texts get opened", source: "Gartner" },
  { value: "50,000+", label: "Businesses already using Ramp", source: "ramp.com" },
  { value: "2.5%", label: "Of bills have a mistake, on average", source: "Medius benchmark" },
];

function Opportunity() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20 md:pb-28">
      <div className="max-w-[1000px]">
        <div className="text-[19px] font-medium text-[#2f6fe4]">The opportunity</div>
        <h2 className="mt-5 text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-ink md:text-[58px]">
          Most people who buy and approve things aren&apos;t at a desk.
          <span className="block text-[#8b8f97]">But they all read their texts.</span>
        </h2>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-[#e7e7e4] pt-12 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-[48px] font-normal leading-none tracking-[-0.04em] text-ink md:text-[64px]">{s.value}</div>
            <div className="mt-3 text-[17px] leading-[1.4] text-[#3d4048]">{s.label}</div>
            <div className="mt-1 text-[13px] text-muted">{s.source}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- close ---------- */

function Close() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-24 text-center md:pb-32">
      <div className="flex justify-center">
        <Avatar size={72} />
      </div>
      <h2 className="mx-auto mt-8 max-w-[1150px] text-balance text-[42px] font-normal leading-[1.06] tracking-[-0.035em] text-ink md:text-[68px]">
        Buy, approve and pay for things by text.
        <span className="block text-[#8b8f97]">All of Ramp&apos;s Procure to Pay, no dashboard needed.</span>
      </h2>
      <div className="mt-10 flex justify-center">
        <CtaButton>See the demo</CtaButton>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#ececea]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-6 py-8 text-[14px] text-muted md:flex-row md:justify-between">
        <span>Ramp Dock · a concept for the Berkeley Business Society × Ramp hackathon</span>
        <span>Not affiliated with or endorsed by Ramp. Demo data is illustrative.</span>
      </div>
    </footer>
  );
}

function Nav() {
  return (
    <header className="mx-auto flex max-w-[1280px] items-center justify-between px-6 pt-6">
      <div className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.01em] text-ink">
        <Avatar size={30} />
        Ramp Dock
      </div>
      <nav className="hidden gap-8 text-[15px] text-muted md:flex">
        <a href="#request" className="hover:text-ink">Requests</a>
        <a href="#approve" className="hover:text-ink">Approvals</a>
        <a href="#pay" className="hover:text-ink">Bills</a>
        <a href="#renew" className="hover:text-ink">Renewals</a>
      </nav>
    </header>
  );
}

export default function Page() {
  return (
    <main>
      <Nav />
      <Hero />
      {features.map((f, i) => (
        <FeatureSection key={f.id} f={f} flip={i % 2 === 1} />
      ))}
      <BuiltOnRamp />
      <Trust />
      <Opportunity />
      <Close />
      <Footer />
    </main>
  );
}
