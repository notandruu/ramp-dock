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

The small square cards the agent drops into a thread. They all copy the reminder card from the "Text your agent" clip, rebuilt frame by frame at `/lab`. Preview every widget at `/lab/widgets`, and add `?slow=4` to either page to watch motion slowed down.

- Build a new widget as `<Widget glyph={...} value unit caption />`. Do not restyle the card, the type or the glyph placement per widget
- A glyph is a `GlyphShape` drawn upright in the shared frame: about 92pt wide, top near y=-88, bottom edge near y=-12, an optional small accent a few points below (the bell's clapper, the box's pallet, the bill's coin). The card tilts it 24deg and bleeds its top off the corner. Flat silhouettes in the one blue gradient, no outlines, no second color
- Keep value plus unit inside about 70pt (one to three digits and a short word) so it clears the accent. Longer facts go in the caption
- Motion comes from `motion.ts` only. Land a widget with `widgetEntrance(frame, glyphPose)`: the measured blur-in for the card and the pendulum ring for the glyph. No custom easings, durations or bounces
- New curves get measured off a recording first, then added to `motion.ts` as frame-keyed points, never eyeballed
