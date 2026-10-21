# Ramp Dock

Every delivery, checked before it's paid.

Ramp Dock is a hackathon concept for the Berkeley Business Society × Ramp hackathon: an SMS agent that brings Ramp's Procure to Pay products (Procurement, Accounts Payable, Vendor Management) to the people who receive deliveries in the field.

Ramp already lets employees text a photo of a lunch receipt. A $1,900 drywall delivery still needs someone to log into the web app to record what came off the truck, so most contractors fall back to matching only the PO and the invoice. Ramp Dock texts the site lead on delivery day, reads the photo of the signed ticket, and checks it against the PO and the invoice before anything is paid.

This repo is the landing page that presents the concept, in the style of a consumer product launch page.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx`: the landing page, section by section (hero, five feature sections, built on Ramp, safe by design, opportunity, close)
- `components/phone.tsx`: the iPhone iMessage frame, bubbles, avatar, and the handwritten ticket photo
- `components/cards.tsx`: the in-thread rich cards (delivery logged, ticket vs invoice rings, bill on hold, workflow, weekly recap)
- `components/screens.tsx`: the five demo screens that tell the story

## The demo story

| Who | Role |
| --- | --- |
| Hartwell Builders | 60-person commercial contractor, the Ramp customer |
| Marco | Site foreman at the Elm St job, no Ramp login |
| Dana | Controller |
| Ridgeline Lumber | Vendor (fictional) |

1. 7:02 AM: Ramp Dock texts Marco that 40 sheets of drywall arrive today. He sends a photo of the signed ticket and Ramp logs 40.
2. 2:16 PM: Ridgeline invoices 45 sheets. Ramp asks Marco if 5 more came. He says no.
3. 2:18 PM: Dana gets a card proposing to pay $1,900 for what arrived and hold $237.50. She replies 1.
4. She turns it into a workflow that runs on every materials PO.
5. Friday: a recap of what was caught, with delivery accuracy per vendor.

All numbers in the demo are illustrative. Ramp Dock is not affiliated with or endorsed by Ramp.
