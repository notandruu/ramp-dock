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

- `app/page.tsx`: the landing page, section by section (hero, one section per Procure to Pay step, built on Ramp, safe by design, opportunity, close)
- `components/hero-threads.tsx`: the four animated hero threads, played one at a time
- `components/phone.tsx`: the iPhone iMessage frame, bubbles, avatar, Ramp mark, and the delivery slip photo
- `components/cards.tsx`: the in-thread cards (purchase request, approval, delivery recorded, bill on hold, renewal)
- `components/screens.tsx`: one demo screen per Procure to Pay step

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
