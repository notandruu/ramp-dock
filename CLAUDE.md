# Ramp Dock landing page

Next.js 15 (app router) + Tailwind 3. Static, no backend. `npm run dev` to work, `npm run build` to check.

## Design rules (keep these)

The visual reference is Flip's landing page (fliptexts.com): white page, Inter, big regular-weight headlines with a gray second line, colored sentence-case eyebrows, colored icon bullets, phones on soft gray rounded panels.

In-thread cards follow Flip's "proposed trade" card:
- Off-white card with a faint vertical gradient, hairline border, 22px radius, soft shadow
- Header in sentence case, 13px gray with a thin outline icon. Never all-caps eyebrows
- Status as plain gray text. No tinted pill badges, no colored dots
- Title 32px, weight 400. Rows: gray label, semibold dark value
- Color only in small text (muted red for money at risk), never colored boxes or fills
- Dark gradient pill button, with "Nothing is paid until you approve." under it

The four hero panels are live iMessage threads (`components/hero-threads.tsx`), modeled on Flip's "Texts, first." card. They play as a relay, one panel at a time, never all four at once. Each panel's first exchange is on screen at load, and the timings (typing dots, bubble entrance, thread glide) were measured off fliptexts.com, so keep them unless you re-measure.

The avatar is a lime circle with Ramp's logo mark (`RampMark` in `components/phone.tsx`), used everywhere a truck icon used to be. Vendor and company names are fictional; do not use real supplier names.

## Copy rules

- No em dashes
- Concrete over abstract: real numbers, real roles, real objects (tickets, POs, invoices)
- The pitch line: "Ramp already won the card swipe. Ramp Dock wins the delivery."
