# Ramp Dock

Buy, approve and pay for things by text.

Ramp Dock is a hackathon concept for the Berkeley Business Society × Ramp hackathon: an SMS agent that brings Ramp's Procure to Pay products (Procurement, Accounts Payable, Vendor Management) to the people who never open the dashboard.

Most people who ask for things, approve them and receive them aren't at a desk, so requests and approvals sit waiting in the web app. Ramp Dock moves each step into a text: ask for what you need in plain words, approve with a "yes", send a photo of the delivery slip, pay the right amount with "1", and hear about contract renewals before they charge you.

This repo is the landing page that presents the concept, in the style of a consumer product launch page.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx`: the landing page, built on the Figma frame (header, hero, logos, how it works, bento, safe by design, built on Ramp, why text, CTA card, FAQ, footer)
- `components/thread.tsx`: the live iMessage threads (hero phone and the four-step showcase, played one at a time)
- `components/phone.tsx`: the iPhone frame, bubbles, avatar, Ramp mark, and the delivery slip photo
- `components/cards.tsx`: the in-thread cards (purchase request, approval, delivery recorded, bill on hold, renewal)
- `components/screens.tsx`: the receiving phone screen
- `components/email-form.tsx`: the Figma's email form (no backend, it scrolls to the demo)
- `public/ramp/`: assets exported from the Figma

## The demo story

| Who | Role |
| --- | --- |
| Jordan | Designer who needs monitors, no Ramp login |
| Priya | Design lead who approves |
| Marco | Site lead receiving a drywall delivery, no Ramp login |
| Dana | Controller who pays bills and owns renewals |
| Northwind Supply, Ridgeline Lumber, Harbor Foods, Canvas Cloud | Vendors (fictional) |

1. Procurement: Jordan texts that they need 2 monitors. Ramp finds them for $598 and sends the request to Priya.
2. Approvals: Priya gets the price and budget in a text and replies yes.
3. Receiving: on delivery day Marco sends a photo of the slip and Ramp records 40 sheets.
4. Accounts Payable: Ridgeline bills 45 sheets. Dana replies 1 to pay $1,900 for what arrived and dispute the rest.
5. Vendor Management: Canvas Cloud renews in 14 days with 6 unused seats. Dana replies yes and Ramp asks for fewer.

All numbers in the demo are illustrative. Ramp Dock is not affiliated with or endorsed by Ramp.
