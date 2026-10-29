# Ramp Dock landing page

Next.js 15 (app router) + Tailwind 3. Static, no backend. `npm run dev` to work, `npm run build` to check.

## Design rules (keep these)

The design source of truth is the hand-built Figma in Ramp's design system: https://www.figma.com/design/Kxotrn3khEinOjHBZrZ6j6/Untitled (a ramp.com product page). Match its frame and structure:

- Header, split hero with the iPhone image, customer logo strip, tabbed showcase, bento cards, two three-card rows, dark stats band, CTA card, FAQ, email form, full dark footer
- 1440 frame with 64px gutters, Arial, ink `#0c0a08`, muted `rgba(12,10,8,0.6)`, cards `#f4f2f0`, lines `#d2cecb`, dark `#1a1919`, lime `#e4f222`
- Centered eyebrow (16px muted) over a 48px heading for every section
- Figma assets live in `public/ramp/`. Do not redraw them

Ramp Dock's own pieces go in the Figma's slots: the live threads (`components/thread.tsx`), the in-thread cards (`components/cards.tsx`) and the copy. The hero phone is the Figma's image with the live thread laid over its screen. The four steps in the showcase play one at a time, never all at once. Thread timings were measured off fliptexts.com, so keep them unless you re-measure.

Phone UI uses the `font-ios` stack. In-thread cards: off-white with a hairline border, sentence-case gray header, 32px title, gray label and dark value rows, color only in small text.

## Copy rules

- No em dashes
- Plain words a five-year-old could follow. Not punchy, not clever, not abstract. Say "delivery slip" and "bill", not "ticket", "invoice", "PO" or "3-way match"
- Lead with the value: "Buy, approve and pay for things by text." Every section after explains how or why, one step at a time
- Positioning: Ramp already has text agents for Card & Expense (receipts, memos). Ramp Dock extends that to the other half of Ramp. Say "you already text Ramp your receipts, now...", never pitch texting as new to Ramp
- Ramp Dock is all of Ramp's Procure to Pay (Procurement, Accounts Payable, Vendor Management) over SMS, not a tool for one industry. Mix examples across offices, restaurants and job sites
- Concrete over abstract: real numbers, real roles, real objects
- Do not borrow Flip's or Ramp's marketing lines. Write our own

## Agent widgets (`components/agent-kit/`)

The cards the agent drops into a thread, copied from the two in the "Text your agent" clip (rebuilt frame by frame at `/lab`). Preview them at `/lab/widgets`, and add `?slow=4` to either page to watch motion slowed down.

- Two templates, nothing else: `Widget` (the square reminder card: glyph in the corner, big value, gray caption) and `PlanCard` (the wide calendar card: label tile, gray title, a sentence with the joining words in `Dim`, one blue bar per step). Do not restyle either per use
- A glyph is a `GlyphShape` drawn upright in the shared frame: about 92pt wide, top near y=-88, bottom edge near y=-12, an optional small accent a few points below. The card tilts it 24deg and bleeds its top off the corner. Flat silhouettes in the one blue gradient, no outlines, no second color
- Keep value plus unit inside about 70pt so it clears the accent. Longer facts go in the caption
- Every widget lands the same way (`widgetEntrance`): the card blurs in, its glyph is held, then let go at `RELEASE`
- What the glyph does once let go must be something the real object does. A bell rings (`ring`), a box drops onto its pallet (`drop`), a bill feeds out and its coin pops in (`feed`). Never give one object another's gesture, and a glyph with no honest gesture holds still. `PlanCard` always holds still, like the clip's calendar
- Build new gestures in `motion.ts` from the clip's timing only: `BEAT` frames per move, each move `DECAY` of the one before. No other easings, durations or bounces. Anything new that the clip shows gets measured off a recording first
