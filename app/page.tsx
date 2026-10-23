import type { ReactNode } from "react";
import { HeroThreads, type HeroPanel } from "@/components/hero-threads";
import { Avatar, Scaled } from "@/components/phone";
import { ScreenCatch, ScreenHeadsUp, ScreenHold, ScreenRecap, ScreenWorkflow } from "@/components/screens";

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
  question: "M4 5h16v11H9l-5 4zM10 9.2a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6 1M12 14h.01",
  reply: "M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 6 6v3",
  check: "M5 12.5l4.5 4.5L19 7.5",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  hand: "M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-6.5a1.5 1.5 0 0 1 3 0V12m0-5a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-12.4 4.5L3.5 14a1.6 1.6 0 0 1 2.6-1.8L8 14",
  loop: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
  bolt: "M13 3L5 13h6l-1 8 8-10h-6z",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  dollar: "M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.4-4.5 3.3 0 4.4 9 2.2 9 6.9 0 2-1.8 3.5-4.5 3.5-2.4 0-4.3-1.1-4.8-2.8",
  rings: "M12 21a9 9 0 1 1 0-18M12 16a4 4 0 1 1 0-8",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM17 19.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  calendar: "M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4",
};

function CtaButton({ children = "Text Ramp Dock" }: { children?: ReactNode }) {
  return (
    <a
      href="#demo"
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

const heroPanels: HeroPanel[] = [
  {
    icon: <Icon d={ICON.message} color="#34c759" size={24} />,
    title: "Texts first.",
    body: "Ramp messages your crew on delivery day. No app, no login.",
    label: "Ramp Dock texts the site foreman on delivery day. He replies with a photo of the ticket and Ramp logs 40 sheets.",
    exchanges: [
      [
        { from: "them", text: "morning Marco. Ridgeline is dropping 40 sheets of 5/8 drywall at Elm St today" },
        { from: "them", text: "snap the delivery ticket when the truck shows up. that's it" },
        { from: "me", photo: "ticket" },
        { from: "them", text: "got it. read 40 sheets off your ticket and logged it on PO 1042" },
      ],
      [
        { from: "them", text: "Kestrel Ready Mix pours at Pine Ave at 9. 12 yards on the PO" },
        { from: "me", text: "truck just left. ticket says 11.5" },
        { from: "them", text: "logged 11.5 yards. I'll check it against their bill" },
      ],
    ],
  },
  {
    icon: <Icon d={ICON.columns} color="#2f6fe4" size={24} />,
    title: "Asks who was there.",
    body: "When an invoice doesn't match, it checks with whoever signed.",
    label: "Ramp Dock tells the foreman the invoice says 45 sheets but his ticket says 40, and asks whether 5 more arrived.",
    exchanges: [
      [
        { from: "them", text: "quick one. Ridgeline billed 45 sheets for this morning's drop" },
        { from: "them", text: "your ticket says 40. did the other 5 show up after you signed?" },
        { from: "me", text: "no only 40. rest comes next week" },
        { from: "them", text: "that's all I needed. holding the bill. you're done" },
      ],
      [
        { from: "them", text: "Kestrel billed 12 yards for the Pine Ave pour" },
        { from: "them", text: "your ticket says 11.5. did the driver take the extra back?" },
        { from: "me", text: "yeah half a yard went back on the truck" },
        { from: "them", text: "perfect. asking them for an $85 credit" },
      ],
    ],
  },
  {
    icon: <Icon d={ICON.receipt} color="#a2453b" size={24} />,
    title: "Holds bad bills.",
    body: "Controllers approve the right amount with one reply.",
    label: "The controller is asked to pay $1,900 for what arrived and hold $237.50. She replies 1 and the dispute goes out.",
    exchanges: [
      [
        { from: "them", text: "caught one before it got paid. Ridgeline billed 45 sheets, Marco signed for 40" },
        { from: "them", text: "reply 1 to pay $1,900 for what arrived and hold $237.50" },
        { from: "me", text: "1" },
        { from: "them", text: "done. $1,900 goes out Nov 3 and Ridgeline has the dispute with Marco's ticket" },
      ],
      [
        { from: "them", text: "Kestrel billed $2,040 for 12 yards. 11.5 arrived" },
        { from: "them", text: "reply 1 to pay $1,955 and request an $85 credit" },
        { from: "me", text: "1" },
        { from: "them", text: "done. credit request sent with the signed ticket" },
      ],
    ],
  },
  {
    icon: <Icon d={ICON.calendar} color="#b07a1f" size={24} />,
    title: "Weekly recaps.",
    body: "What it caught, and which vendors keep shorting you.",
    label: "A Friday recap: $1,912 caught this week, and Ridgeline overbilled on 3 of their last 8 drops.",
    exchanges: [
      [
        { from: "them", text: "your week in deliveries: $1,912 caught before it got paid" },
        { from: "them", text: "Ridgeline overbilled on 3 of their last 8 drops" },
        { from: "them", text: "flag it before their pricing renews?" },
        { from: "me", text: "yes" },
        { from: "them", text: "flagged. it's on your renewal review with all 3 tickets" },
      ],
      [
        { from: "them", text: "your week in deliveries: 31 checked, 1 off, $85 credit requested" },
        { from: "them", text: "Kestrel matched the ticket on 9 of their last 10 pours" },
        { from: "me", text: "nice" },
      ],
    ],
  },
];

function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-10 md:pt-14">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <h1 className="max-w-[1000px] text-balance text-[44px] font-normal leading-[1.05] tracking-[-0.035em] text-ink md:text-[68px]">
          Introducing Ramp Dock
          <span className="block text-[#8b8f97]">Every delivery, checked before it&apos;s paid.</span>
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
    id: "demo",
    eyebrow: "Field crews",
    color: "#c2346a",
    title: (
      <>
        Snap the ticket.
        That&apos;s the whole job.
      </>
    ),
    body: "On delivery day, Ramp Dock texts the site lead before the truck arrives. They reply with a photo of the signed ticket, and Ramp reads the handwriting into a receipt on the PO.",
    bullets: [
      { icon: ICON.bell, text: "Texts on delivery day" },
      { icon: ICON.camera, text: "Reads handwritten tickets" },
      { icon: ICON.key, text: "No app, no Ramp login" },
    ],
    screen: <ScreenHeadsUp />,
  },
  {
    id: "catch",
    eyebrow: "The catch",
    color: "#2f6fe4",
    title: (
      <>
        Ramp asks the one person
        who saw the truck.
      </>
    ),
    body: "When the invoice doesn't match what came off the truck, Ramp Dock checks with the crew first, while they still remember, instead of AP chasing it three weeks later.",
    bullets: [
      { icon: ICON.columns, text: "Order, ticket and invoice, side by side" },
      { icon: ICON.question, text: "Asks only what it needs" },
      { icon: ICON.reply, text: "Answered in one reply" },
    ],
    screen: <ScreenCatch />,
  },
  {
    id: "approve",
    eyebrow: "Approvals",
    color: "#3f8a4a",
    title: (
      <>
        Ramp does the checking.
        You just say yes.
      </>
    ),
    body: "Controllers get the bill already matched and explained, with the overbilled amount held back. One reply pays for what arrived and sends the dispute with the crew's photo attached.",
    bullets: [
      { icon: ICON.dollar, text: "Pays for what arrived" },
      { icon: ICON.receipt, text: "Disputes the rest, with proof" },
      { icon: ICON.hand, text: "Nothing paid until you approve" },
    ],
    screen: <ScreenHold />,
  },
  {
    id: "workflows",
    eyebrow: "Workflows",
    color: "#d9662b",
    title: (
      <>
        Say it once. Every
        delivery gets checked.
      </>
    ),
    body: "Turn one catch into a rule. Ramp Dock builds the workflow, shows you every step, and runs it on every materials PO from then on.",
    bullets: [
      { icon: ICON.loop, text: "Runs on its own" },
      { icon: ICON.bolt, text: "Triggered by delivery day" },
      { icon: ICON.list, text: "See and pause every step" },
    ],
    screen: <ScreenWorkflow />,
  },
  {
    id: "recaps",
    eyebrow: "Recaps",
    color: "#9a7a3a",
    title: (
      <>
        See which vendors deliver
        what they bill.
      </>
    ),
    body: "Every Friday, a recap of what Dock checked and caught, plus delivery accuracy for each vendor, built from real tickets and surfaced before their pricing renews.",
    bullets: [
      { icon: ICON.dollar, text: "Dollars caught, every week" },
      { icon: ICON.rings, text: "Delivery accuracy per vendor" },
      { icon: ICON.bell, text: "Flags before renewals" },
    ],
    screen: <ScreenRecap />,
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
    today: "Requests, POs and item receipts, entered by someone at a desk.",
    dock: "Item receipts created from a photo of the delivery ticket, by crews with no Ramp seat.",
  },
  {
    name: "Accounts Payable",
    today: "OCR, AP agents and 3-way match, as long as someone logged the receipt.",
    dock: "Every bill matched against what actually arrived. Mismatches held before payment.",
  },
  {
    name: "Vendor Management",
    today: "Contracts, renewals and price benchmarks.",
    dock: "Delivery accuracy per vendor, from real tickets, surfaced before renewals.",
  },
];

function BuiltOnRamp() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-20 md:py-28">
      <div className="max-w-[1000px]">
        <div className="text-[19px] font-medium text-[#6a4fd0]">Built on Ramp</div>
        <h2 className="mt-5 text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-ink md:text-[58px]">
          Ramp already does the matching.
          <span className="block text-[#8b8f97]">Dock gives it eyes on the ground.</span>
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
    title: "Receivers are just phone numbers",
    body: "The PM assigns a number per job. No Ramp seat, no app, no training.",
  },
  {
    icon: ICON.truck,
    title: "Delivery day is the trigger",
    body: "The PO's delivery date works like a card swipe does for expenses: Ramp knows who to text and when.",
  },
  {
    icon: ICON.shield,
    title: "A text never moves money",
    body: "Crew texts only record what arrived. Payment still runs through Ramp's approvals.",
  },
];

function Trust() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20 md:pb-28">
      <div className="rounded-[40px] bg-[#111214] px-8 py-14 text-white md:px-16 md:py-20">
        <div className="text-[19px] font-medium text-lime">Safe by design</div>
        <h2 className="mt-5 max-w-[760px] text-[38px] font-normal leading-[1.1] tracking-[-0.03em] md:text-[54px]">
          Ramp&apos;s own SMS playbook, extended to Procure to Pay.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {rules.map((r) => (
            <div key={r.title}>
              <Icon d={r.icon} color="#DFF50A" size={28} />
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
  { value: "$2.2T", label: "US construction spending a year", source: "Census Bureau" },
  { value: "940k", label: "Construction businesses with payroll", source: "BLS, Q1 2025" },
  { value: "4,000+", label: "Contractors already on Ramp", source: "ramp.com/construction" },
  { value: "2.5%", label: "Average AP invoice error rate", source: "Medius benchmark" },
];

function Opportunity() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20 md:pb-28">
      <div className="max-w-[1000px]">
        <div className="text-[19px] font-medium text-[#2f6fe4]">The opportunity</div>
        <h2 className="mt-5 text-[40px] font-normal leading-[1.08] tracking-[-0.03em] text-ink md:text-[58px]">
          Construction still runs on carbon-copy tickets.
          <span className="block text-[#8b8f97]">Restaurants get deliveries every day.</span>
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
        Ramp already won the card swipe.
        <span className="block text-[#8b8f97]">Ramp Dock wins the delivery.</span>
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
        <a href="#demo" className="hover:text-ink">Field crews</a>
        <a href="#approve" className="hover:text-ink">Approvals</a>
        <a href="#workflows" className="hover:text-ink">Workflows</a>
        <a href="#recaps" className="hover:text-ink">Recaps</a>
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
