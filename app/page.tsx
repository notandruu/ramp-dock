/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import { ApprovalCard, BillOnHoldCard, RenewalCard, RequestCard } from "@/components/cards";
import { EmailForm } from "@/components/email-form";
import { Me, Scaled, Them } from "@/components/phone";
import { ScreenHeadsUp } from "@/components/screens";
import { HeroPhone, StepsShowcase, type Script, type Step } from "@/components/thread";

/*
 * Layout, spacing and type follow the hand-built Figma in Ramp's design system (a ramp.com
 * product page): 1440 frame, 64px gutters, Arial, #0c0a08 ink, #f4f2f0 cards, #e4f222 lime.
 * Ramp Dock's own pieces (live threads, in-thread cards, copy) sit in its slots.
 */

const wrap = "mx-auto w-full max-w-[1440px] px-6 md:px-16";

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <div className={`text-center text-[16px] leading-[22px] ${dark ? "text-white/60" : "text-muted"}`}>{children}</div>;
}

function H2({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <h2
      className={`mx-auto mt-3 max-w-[860px] text-balance text-center text-[34px] leading-[38px] tracking-[-0.01px] md:text-[48px] md:leading-[50px] ${
        dark ? "text-white" : "text-ink"
      }`}
    >
      {children}
    </h2>
  );
}

/* ---------- header ---------- */

const nav = ["Products", "Solutions", "Partners", "Resources"];

function Header() {
  return (
    <header className="sticky top-0 z-50 h-[62px] bg-white/80 backdrop-blur-[12.5px]">
      <div className="mx-auto flex h-full max-w-[1440px] items-center px-6 md:px-16">
        <a href="#" aria-label="Go to homepage" className="shrink-0">
          <img src="/ramp/ramp-wordmark.svg" alt="ramp" width={70} height={20} />
        </a>
        <nav className="ml-[21px] hidden items-center lg:flex">
          {nav.map((n) => (
            <a key={n} href="#" className="flex h-[44px] items-center gap-[6px] rounded-[6px] px-[12px] text-[14px] leading-[14px] text-ink hover:bg-black/[0.04]">
              {n}
              <img src="/ramp/chevron.svg" alt="" width={16} height={16} />
            </a>
          ))}
          <a href="#" className="flex h-[44px] items-center rounded-[6px] px-[12px] text-[14px] leading-[14px] text-ink hover:bg-black/[0.04]">
            Pricing
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a href="#" className="hidden h-[35px] items-center rounded-[6px] px-[12px] text-[14px] text-ink hover:bg-black/[0.04] sm:flex">
            Sign in
          </a>
          <a href="#how" className="flex h-[35px] items-center rounded-[6px] bg-lime px-[12px] text-[14px] text-ink hover:brightness-95">
            See a demo
          </a>
          <a href="#get-started" className="flex h-[35px] items-center rounded-[6px] bg-night px-[12px] text-[14px] text-white hover:bg-black">
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------- hero ---------- */

// One person running a small team, start to finish.
const heroScript: Script = [
  [
    { from: "them", text: "Northwind delivered. Jordan signed for both monitors" },
    { from: "them", text: "their bill matches. reply 1 to pay $598 on Nov 14" },
    { from: "me", text: "1" },
    { from: "them", text: "scheduled" },
  ],
  [
    { from: "them", text: "heads up. Canvas Cloud renews in 14 days for $18,000" },
    { from: "them", text: "only 24 of your 30 seats are used. ask for 24 and save $3,600?" },
    { from: "me", text: "yes" },
    { from: "them", text: "sent to their rep. I'll text you when they answer" },
  ],
  [
    { from: "them", text: "Ridgeline billed 45 sheets, but the delivery photo shows 40" },
    { from: "them", text: "reply 1 to pay $1,900 for what came and dispute the rest" },
    { from: "me", text: "1" },
    { from: "them", text: "done. dispute sent with the photo" },
  ],
  [
    { from: "me", text: "need 2 monitors for the new designers, under $700" },
    { from: "them", text: "found them at Northwind Supply. $598 for both, and it fits the budget" },
    { from: "them", text: "it's under your limit, so it's approved. arriving Thursday" },
  ],
];

function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-6 pb-10 pt-5 md:px-16 lg:min-h-[732px] lg:grid-cols-[668px_1fr] lg:gap-0 lg:pb-6 lg:pl-16 lg:pr-6 lg:pt-0">
      <div className="flex flex-col lg:py-5">
        <div className="text-[16px] leading-[22px] text-muted">Ramp Dock</div>
        <h1 className="mt-16 text-[40px] leading-[46px] tracking-[-0.01px] text-ink md:text-[56px] md:leading-[64px] lg:mt-[176px]">
          Buy, approve and pay for things by text.
        </h1>
        <p className="mt-4 max-w-[566px] text-[18px] leading-[24px] text-muted md:text-[20px] md:leading-[26px]">
          Ramp&apos;s Procure to Pay in a text thread. Ask for what you need, approve it and pay the right amount without
          opening the dashboard.
        </p>
        <EmailForm className="mt-8" />
        <a
          href="#how"
          className="mt-10 flex h-[39px] w-fit items-center gap-[8px] rounded-[6px] border border-line bg-[rgba(33,33,33,0.02)] px-[12px] text-[14px] leading-[20px] text-muted hover:text-ink lg:mt-auto"
        >
          Explore demo
          <img src="/ramp/arrow-right.svg" alt="" width={16} height={16} />
        </a>
      </div>
      <div className="lg:pt-6">
        <HeroPhone
          script={heroScript}
          label="A Ramp text thread: a $598 bill that matches is scheduled, a renewal with unused seats is renegotiated, and a bill for more than arrived is disputed."
        />
      </div>
    </section>
  );
}

/* ---------- customer logos ---------- */

// Logo shapes from the Figma, in its order. "img" ones are drawn as-is, the rest are masks filled with ink.
const logos: { src: string; w: number; img?: boolean }[] = [
  { src: "b7794", w: 64 },
  { src: "733d7", w: 71.33 },
  { src: "1a239", w: 45.33 },
  { src: "11a37", w: 65.33 },
  { src: "a0716", w: 53.33, img: true },
  { src: "df761", w: 65.33, img: true },
  { src: "84e4b", w: 94.66 },
  { src: "085d2", w: 92 },
  { src: "8eb29", w: 78.66 },
  { src: "7e34b", w: 89.33 },
  { src: "58505", w: 70.66 },
  { src: "e494e", w: 102 },
  { src: "9dad2", w: 61.33, img: true },
  { src: "f9295", w: 73.33 },
  { src: "49862", w: 92.66 },
  { src: "cf576", w: 82 },
  { src: "c135c", w: 102 },
];

function Logo({ src, w, img }: (typeof logos)[number]) {
  const url = `/ramp/logos/${src}.svg`;
  if (img) {
    return (
      <span className="flex h-8 shrink-0 items-center justify-center opacity-40" style={{ width: w }}>
        <img src={url} alt="" className="max-h-8 w-full" />
      </span>
    );
  }
  const mask: CSSProperties = { maskImage: `url(${url})`, WebkitMaskImage: `url(${url})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" };
  return <span className="h-8 shrink-0 bg-ink opacity-40" style={{ width: w, ...mask }} />;
}

function Logos() {
  const fade: CSSProperties = {
    maskImage: "url(/ramp/logos/220d4.svg)",
    WebkitMaskImage: "url(/ramp/logos/220d4.svg)",
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
  };
  return (
    <section className="mt-10" aria-label="Customers">
      <p className="text-center text-[16px] leading-[22px] text-muted">Join 85,000+ businesses running on Ramp.</p>
      <div className="mt-[13px] overflow-hidden" style={fade} aria-hidden="true">
        <div className="marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-14 pr-14">
              {logos.map((l) => (
                <Logo key={l.src} {...l} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- how it works ---------- */

const steps: Step[] = [
  {
    title: "Ask for anything in one text.",
    body: "Text what you need. Ramp finds a vendor you already use, checks the budget and sends it to the right approver.",
    label: "A designer texts that they need 2 monitors. Ramp Dock finds them for $598 and sends the request to the approver.",
    script: [
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
    title: "Approve with one reply.",
    body: "The approver gets the price and the budget left in a text. Reply yes and the order goes out.",
    label: "The design lead is asked to approve 2 monitors for $598. She replies yes and the order goes out.",
    script: [
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
    title: "Pay only for what arrived.",
    body: "Ramp checks each bill against the order and a photo of what came. Reply 1 to pay the right amount.",
    label: "Ramp Dock finds a bill for 45 sheets when 40 arrived. The controller replies 1 to pay $1,900 and dispute the rest.",
    script: [
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
    title: "Hear about renewals before they charge you.",
    body: "Two weeks before a contract renews, see what you actually use and what to ask for. Reply yes and Ramp asks the vendor.",
    label: "Ramp Dock texts that a software contract renews in 14 days with 6 unused seats. The controller replies yes to ask for fewer.",
    script: [
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

function How() {
  return (
    <section id="how" className={`${wrap} mt-24 scroll-mt-24 md:mt-[232px]`}>
      <Eyebrow>How it works</Eyebrow>
      <H2>From asking to paying, all by text.</H2>
      <StepsShowcase steps={steps} />
    </section>
  );
}

/* ---------- everyone does their part ---------- */

function BentoCard({ title, body, children, className = "" }: { title: string; body: string; children: ReactNode; className?: string }) {
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-[16px] bg-panel ${className}`}>
      <div className="px-6 pt-8 md:px-10">
        <h3 className="max-w-[403px] text-[24px] leading-[28px] text-ink md:text-[28px] md:leading-[32px]">{title}</h3>
        <p className="mt-3 max-w-[427px] text-[16px] leading-[22px] text-muted">{body}</p>
      </div>
      <div className="flex flex-1 items-end justify-center px-6 pb-0 pt-10">{children}</div>
    </div>
  );
}

function Everyone() {
  return (
    <section className={`${wrap} mt-24 md:mt-[192px]`}>
      <Eyebrow>For everyone who isn&apos;t at a desk</Eyebrow>
      <H2>Anyone can do their part with one text.</H2>
      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="grid grid-cols-1 overflow-hidden rounded-[12px] bg-panel lg:col-span-2 lg:h-[525px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-10 md:px-10">
            <h3 className="max-w-[512px] text-[24px] leading-[28px] text-ink md:text-[28px] md:leading-[32px]">
              Whoever gets the delivery sends a photo.
            </h3>
            <p className="mt-4 max-w-[382px] text-[16px] leading-[22px] text-muted">
              On delivery day, Ramp texts the site lead, chef or office manager. They reply with a photo of the slip, and Ramp
              records what came. No Ramp account needed.
            </p>
          </div>
          <div className="flex h-[440px] justify-center overflow-hidden pt-10 lg:h-auto">
            <Scaled scale={0.62}>
              <ScreenHeadsUp />
            </Scaled>
          </div>
        </div>
        <BentoCard
          title="Ramp asks the person who was there."
          body="If a bill doesn't match the photo, Ramp texts whoever signed for it and asks what happened, while they still remember."
          className="lg:min-h-[586px]"
        >
          <div className="font-ios mb-10 flex w-full max-w-[420px] flex-col gap-1.5 rounded-[16px] bg-white p-5 text-[#111111] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]">
            <Them>Ridgeline billed 45 sheets, but your photo shows 40. did 5 more come later?</Them>
            <Me>no only 40. rest comes next week</Me>
            <Them>that&apos;s all I needed. holding the bill. you&apos;re done</Them>
          </div>
        </BentoCard>
        <BentoCard
          title="Approvers just reply yes."
          body="The price, the budget left and your company's rules in one text. No login, no dashboard."
          className="lg:min-h-[586px]"
        >
          <div className="font-ios mb-10 flex w-full max-w-[400px] justify-center">
            <div className="w-full [&>div]:!w-full">
              <ApprovalCard />
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  );
}

/* ---------- safe by design ---------- */

function MiniCard({ children }: { children: ReactNode }) {
  return <div className="w-[300px] rounded-[16px] border border-[#e8e4de] bg-white p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.25)]">{children}</div>;
}

const contacts = [
  { name: "Marco", role: "Site lead · Elm St", phone: "(415) 555-0142" },
  { name: "Ana", role: "Chef · Harbor St", phone: "(415) 555-0178" },
  { name: "Jordan", role: "Designer", phone: "(415) 555-0119" },
];

const triggers = ["New request", "Delivery date", "Bill comes in", "Renewal in 14 days"];

const rules: { title: string; body: string; visual: ReactNode }[] = [
  {
    title: "Anyone can be a phone number",
    body: "People who ask, approve or receive only need a phone number. No Ramp account, no app, no training.",
    visual: (
      <MiniCard>
        <div className="text-[13px] text-muted">Texts from Ramp Dock</div>
        <div className="mt-3 flex flex-col gap-2.5">
          {contacts.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-panel text-[13px] text-ink">{c.name[0]}</span>
              <span className="flex-1">
                <span className="block text-[14px] text-ink">{c.name}</span>
                <span className="block text-[12px] text-muted">{c.role}</span>
              </span>
              <span className="text-[12px] text-muted">{c.phone}</span>
            </div>
          ))}
        </div>
      </MiniCard>
    ),
  },
  {
    title: "Ramp knows when to text",
    body: "A new request, a delivery date, a bill or a renewal each texts the right person at the right time.",
    visual: (
      <MiniCard>
        <div className="text-[13px] text-muted">Sends a text when</div>
        <div className="mt-3 flex flex-col gap-2">
          {triggers.map((t) => (
            <div key={t} className="flex items-center justify-between rounded-[8px] bg-panel px-3 py-2 text-[14px] text-ink">
              {t}
              <img src="/ramp/arrow-right.svg" alt="" width={16} height={16} />
            </div>
          ))}
        </div>
      </MiniCard>
    ),
  },
  {
    title: "Your rules still apply",
    body: "Same approvers, limits and policies as the dashboard, and every reply is saved in Ramp.",
    visual: (
      <MiniCard>
        <div className="text-[13px] text-muted">Approval rule</div>
        <div className="mt-2 text-[16px] text-ink">Over $500 needs Priya</div>
        <div className="mt-4 flex flex-col gap-2.5 text-[14px]">
          {[
            ["Request", "$598 · Northwind"],
            ["Approved by", "Priya, by text"],
            ["Saved in Ramp", "9:31 AM"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted">{k}</span>
              <span className="text-ink">{v}</span>
            </div>
          ))}
        </div>
      </MiniCard>
    ),
  },
];

function Safe() {
  return (
    <section className={`${wrap} mt-24 md:mt-[157px]`}>
      <Eyebrow>Safe by design</Eyebrow>
      <H2>
        The same Ramp rules.
        <br />
        Just by text.
      </H2>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {rules.map((r) => (
          <div key={r.title} className="flex flex-col items-center overflow-hidden rounded-[12px] bg-panel px-6 pb-10 text-center">
            <div className="flex h-[316px] w-full items-center justify-center text-left">{r.visual}</div>
            <h3 className="text-[18px] leading-[24px] text-ink">{r.title}</h3>
            <p className="mt-2 max-w-[340px] text-[16px] leading-[22px] text-muted">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- built on Ramp ---------- */

const products: { name: string; body: string; card: ReactNode }[] = [
  {
    name: "Procurement",
    body: "Ask for things and get them approved by text. The person asking needs no Ramp account.",
    card: <RequestCard />,
  },
  {
    name: "Accounts Payable",
    body: "Bills checked against the order and a photo of what arrived. Pay the right amount with one reply.",
    card: <BillOnHoldCard />,
  },
  {
    name: "Vendor Management",
    body: "A text before each renewal, with what you actually use and what to ask for.",
    card: <RenewalCard />,
  },
];

function BuiltOnRamp() {
  return (
    <section className={`${wrap} mt-24 md:mt-[216px]`}>
      <Eyebrow>Built on Ramp</Eyebrow>
      <H2>
        This is Ramp&apos;s Procure to Pay.
        <br />
        Now it works by text.
      </H2>
      <div className="mt-14 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-3">
        {products.map((p) => (
          <div key={p.name}>
            <div className="font-ios flex h-[414px] items-center justify-center overflow-hidden rounded-[12px] bg-panel px-6">
              <div className="w-full max-w-[340px] [&>div]:!w-full">{p.card}</div>
            </div>
            <h3 className="mt-5 text-[18px] leading-[24px] text-ink">{p.name}</h3>
            <p className="mt-2 max-w-[340px] text-[16px] leading-[22px] text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- why text ---------- */

const stats = [
  { lead: "About", value: "80%", label: "of workers don't sit at a desk", note: 1 },
  { lead: "About", value: "98%", label: "of text messages get opened", note: 2 },
  { lead: "More than", value: "85,000", label: "businesses already run on Ramp", note: 3 },
];

function WhyText() {
  return (
    <section className="mt-24 bg-night py-20 md:mt-[308px] md:h-[607px] md:py-0 md:pt-[124px]">
      <div className={wrap}>
        <Eyebrow dark>Why text</Eyebrow>
        <H2 dark>Texts get answered. Dashboards wait.</H2>
        <div className="mx-auto mt-14 grid max-w-[1312px] grid-cols-1 gap-6 md:mt-[54px] md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.value} className="flex h-[210px] flex-col rounded-[12px] border border-white/10 bg-white/[0.02] p-6">
              <div className="text-[16px] leading-[22px] text-white/60">{s.lead}</div>
              <div className="mt-[42px] text-[56px] leading-[64px] tracking-[-0.01px] text-white md:text-[64px]">{s.value}</div>
              <div className="mt-1 text-[16px] leading-[22px] text-white/60">
                {s.label}
                <sup className="ml-0.5 text-[12px]">{s.note}</sup>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- close ---------- */

function CtaCard() {
  return (
    <section className={`${wrap} mt-24 md:mt-[216px]`}>
      <div className="grid grid-cols-1 overflow-hidden rounded-[12px] bg-panel lg:h-[492px] lg:grid-cols-2">
        <div className="flex items-center px-6 py-12 md:px-[62px]">
          <p className="text-[28px] leading-[32px] text-black md:text-[32px]">
            Ramp already runs your spend.
            <span className="block text-[#6d6c6b]">Ramp Dock brings it to text.</span>
          </p>
        </div>
        <div className="relative h-[300px] lg:h-full">
          <img
            src="/ramp/budget-dashboard.jpg"
            alt="A Ramp budget dashboard tracking vendor spend against plan"
            className="absolute inset-0 h-full w-full rounded-br-[8px] rounded-tr-[12px] object-cover object-left"
          />
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "What is Ramp Dock?",
    a: "A text message assistant for Ramp's Procure to Pay. People ask for things, approve them, confirm deliveries and pay bills by replying to texts instead of logging into the dashboard.",
  },
  {
    q: "Who is it for?",
    a: "Anyone who buys, approves or receives things but isn't in Ramp all day: site leads, chefs, office managers, department heads and busy executives.",
  },
  {
    q: "Do people need a Ramp account to use it?",
    a: "People who only ask for things or confirm deliveries just need a phone number. Approvers and payers use the Ramp roles they already have.",
  },
  {
    q: "Can a text move money?",
    a: "Only inside your existing Ramp rules. A reply like \"yes\" or \"1\" counts as an approval only from someone who already has that permission, and every reply is saved in Ramp.",
  },
  {
    q: "How does Ramp know who to text?",
    a: "From what's already in Ramp: who asked for the order, who approves that budget, the delivery date on the order and the renewal date on each contract.",
  },
  {
    q: "What if a bill doesn't match what arrived?",
    a: "Ramp holds it, tells the person who pays bills what's different, and offers to pay for what arrived and dispute the rest, with the delivery photo attached.",
  },
  {
    q: "Does it read handwritten delivery slips?",
    a: "Yes. Ramp reads the photo, handwriting included, and records the quantities on the order.",
  },
  {
    q: "Which Ramp products does it use?",
    a: "Procurement for requests and approvals, Accounts Payable for bills and payments, and Vendor Management for contracts and renewals.",
  },
  {
    q: "What if someone replies with something unclear?",
    a: "Ramp asks a short follow-up question. Nothing is approved or paid until the answer is clear.",
  },
  {
    q: "Is Ramp Dock a real Ramp product?",
    a: "No. It's a concept built for the Berkeley Business Society × Ramp hackathon. Names, vendors and numbers in the demo are illustrative.",
  },
];

function Faq() {
  return (
    <section className={`${wrap} mt-24 md:mt-[193px]`}>
      <h2 className="text-[34px] leading-[38px] tracking-[-0.01px] text-ink md:text-[48px] md:leading-[50px]">FAQ</h2>
      <div className="mt-11 border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group border-t border-line first:border-t-0">
            <summary className="flex min-h-[70px] cursor-pointer list-none items-center justify-between gap-6 py-3 text-[16px] leading-[24px] text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-line transition group-open:rotate-180">
                <img src="/ramp/faq-chevron.svg" alt="" width={20} height={20} />
              </span>
            </summary>
            <p className="max-w-[860px] pb-6 text-[16px] leading-[22px] text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function GetStarted() {
  return (
    <section id="get-started" className="flex h-[370px] flex-col items-center justify-center px-6 md:mt-[80px]">
      <h2 className="text-center text-[24px] leading-[28px] text-ink">Bring Ramp to everyone&apos;s phone.</h2>
      <EmailForm className="mt-[10px]" />
    </section>
  );
}

/* ---------- footer ---------- */

const columns: { head: string; links: string[]; allWhite?: boolean }[] = [
  {
    head: "About us",
    allWhite: true,
    links: ["Careers", "Emerging talent", "Customers", "Help center", "Product releases", "Ramp for Agents", "Ramp Labs", "API documentation", "Versus"],
  },
  {
    head: "Products",
    links: [
      "Corporate cards",
      "Expense management",
      "Spend management",
      "Budgets",
      "Banking",
      "Travel",
      "Reimbursements",
      "Procurement",
      "Accounts payable",
      "Vendor management",
      "Approvals",
      "Security",
      "Trust",
      "Mobile app",
      "Ramp Sheets",
    ],
  },
  {
    head: "Platform",
    links: ["Platform overview", "Accounting automation", "Intelligence", "Reporting", "Savings", "Integrations", "Multi-entity", "Global", "AI Spend Management", "Router"],
  },
  {
    head: "Partners",
    links: ["Accounting firms", "Private equity", "Venture capital", "System integrators", "Technology partners", "Spend and payroll partners", "Reseller partners", "Franchise partners"],
  },
  { head: "Solutions", links: ["Startups", "Small business", "Mid market", "Enterprise"] },
  {
    head: "Free tools and resources",
    links: [
      "Perks and rewards",
      "Find an accountant",
      "Find a services partner",
      "Savings calculator",
      "Mission statement generator",
      "Charge finder",
      "Per diem calculator",
      "Mileage reimbursement calculator",
      "Card comparison tool",
      "Investor database",
      "Expense categorization",
      "Expense policy builder",
      "Vendor directory",
      "Virtual cards",
      "Answers Hub",
    ],
  },
];

const legal = ["Terms of Service", "Editorial Guidelines", "Privacy Policy"];

function Footer() {
  return (
    <footer className="relative mt-6 bg-night text-[14px] leading-[20px]">
      {/* The Figma's inverted corners where the page meets the footer. */}
      <img src="/ramp/footer-corner-left.svg" alt="" width={24} height={24} className="absolute -top-6 left-0" />
      <img src="/ramp/footer-corner-right.svg" alt="" width={24} height={24} className="absolute -top-6 right-0" />
      <div className="mx-auto max-w-[1440px] px-6 pb-[120px] pt-[123px] md:px-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {columns.map((c) => (
            <div key={c.head}>
              <a href="#" className="block text-white">
                {c.head}
              </a>
              <ul className="mt-[6px] flex flex-col gap-[6px]">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className={c.allWhite ? "text-white" : "text-white/60 hover:text-white"}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-[86px] border-t border-line" />

        <div className="mt-[46px] grid grid-cols-1 gap-10 text-[13px] leading-[19px] text-white/60 lg:grid-cols-[minmax(0,668px)_minmax(0,1fr)_auto] lg:gap-x-16">
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {legal.map((l) => (
                <a key={l} href="#" className="underline">
                  {l}
                </a>
              ))}
              <a href="#" className="flex items-center gap-2 underline">
                Your Privacy Choices
                <img src="/ramp/privacy-choices.svg" alt="" width={30} height={14} />
              </a>
              <a href="#" className="underline">
                Manage Preferences
              </a>
            </div>
            <p>© 2026 Ramp Dock, a concept for the Berkeley Business Society × Ramp hackathon.</p>
            <p>
              Ramp Dock is not affiliated with or endorsed by Ramp. &quot;Ramp&quot; and the Ramp logo are trademarks of Ramp
              Business Corporation. Names, vendors and numbers in the demo are illustrative.
            </p>
            <p>1. Emergence Capital, research on the deskless workforce.</p>
            <p>2. Gartner, SMS open rates.</p>
            <p>3. ramp.com, &quot;Join 85,000+ businesses running on Ramp.&quot;</p>
            <p className="mt-10">
              Join the <span className="text-white">85,000+ businesses</span> simplifying their finances with Ramp.
            </p>
            <EmailForm dark className="mt-[6px]" />
          </div>
          <div>
            <p>Ramp Dock</p>
            <p>Berkeley Business Society × Ramp hackathon</p>
            <p>Berkeley, CA</p>
          </div>
          <div className="flex flex-col items-start gap-[16px]">
            <img src="/ramp/obviously-nyc.svg" alt="" width={32} height={32} />
            <div className="flex gap-2">
              <img src="/ramp/app-store.svg" alt="Download on the App Store" width={81} height={24} />
              <img src="/ramp/google-play.svg" alt="Get it on Google Play" width={81} height={24} />
            </div>
            <div className="flex flex-col gap-[6px]">
              {["LinkedIn", "X", "Facebook"].map((s) => (
                <a key={s} href="#" className="underline">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Logos />
        <How />
        <Everyone />
        <Safe />
        <BuiltOnRamp />
        <WhyText />
        <CtaCard />
        <Faq />
        <GetStarted />
      </main>
      <Footer />
    </>
  );
}
