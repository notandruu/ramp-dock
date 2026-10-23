import { Me, Phone, Read, Stamp, Them, TicketPhoto } from "./phone";
import { BillOnHoldCard, DeliveryLoggedCard, RecapCard, TicketVsInvoiceCard, WorkflowCard } from "./cards";

/*
 * The demo story, one screen per beat.
 * Hartwell Builders (contractor) · Marco (site foreman) · Dana (controller) · Ridgeline Lumber (vendor)
 */

/** 1 · 7:02 AM: Ramp texts Marco first, he sends the ticket photo. */
export function ScreenHeadsUp() {
  return (
    <Phone label="Ramp Dock texts the site foreman on delivery day. He replies with a photo of the ticket and Ramp logs 40 sheets.">
      <Stamp>Today 7:02 AM</Stamp>
      <Them>morning Marco. Ridgeline Lumber is dropping 40 sheets of 5/8 drywall at Elm St today</Them>
      <Them>snap the delivery ticket when the truck shows up. that&apos;s it</Them>
      <Stamp>10:41 AM</Stamp>
      <TicketPhoto />
      <Me>here</Me>
      <Them>got it. read 40 sheets off your ticket</Them>
      <DeliveryLoggedCard />
    </Phone>
  );
}

/** 2 · 2:16 PM: the invoice says 45. Ramp asks Marco, who saw the truck. */
export function ScreenCatch() {
  return (
    <Phone label="Ramp Dock shows the order, the delivery and the invoice side by side, then asks the foreman whether 5 more sheets arrived.">
      <Them>got it. read 40 sheets off your ticket</Them>
      <Stamp>Today 2:16 PM</Stamp>
      <Them>quick one. Ridgeline just billed us for 45 sheets on this morning&apos;s drop</Them>
      <TicketVsInvoiceCard />
      <Them>did the other 5 show up after you signed?</Them>
      <Me>no only 40. rest comes next week</Me>
      <Them>that&apos;s what I needed. holding the bill and looping in Dana. you&apos;re done</Them>
      <Read>Read 2:17 PM</Read>
    </Phone>
  );
}

/** 3 · 2:18 PM: Dana gets the bill already matched, explained and held. */
export function ScreenHold() {
  return (
    <Phone label="The controller gets a card proposing to pay $1,900 for what arrived and hold $237.50. She replies 1 and the dispute goes out.">
      <Stamp>Today 2:18 PM</Stamp>
      <Them>caught one before it got paid. Marco confirmed only 40 sheets came</Them>
      <BillOnHoldCard />
      <Them>reply 1 to pay $1,900 for what arrived and dispute the other 5 sheets</Them>
      <Me>1</Me>
      <Them>done. $1,900 goes out Nov 3, and Ridgeline has the dispute with Marco&apos;s ticket attached</Them>
    </Phone>
  );
}

/** 4 · 2:24 PM: one catch becomes a standing rule. */
export function ScreenWorkflow() {
  return (
    <Phone label="The controller asks Ramp Dock to do this for every order and it builds a workflow that runs on its own.">
      <Stamp>Today 2:24 PM</Stamp>
      <Me>do this for every materials order from now on</Me>
      <Them>set it up. it runs on its own from now on</Them>
      <WorkflowCard />
    </Phone>
  );
}

/** 5 · Friday: the recap, with vendor delivery accuracy. */
export function ScreenRecap() {
  return (
    <Phone label="A Friday recap: $1,912 caught this week, and Ridgeline delivered as billed only 63 percent of the time.">
      <Stamp>Fri 4:00 PM</Stamp>
      <Them>your week in deliveries</Them>
      <RecapCard />
      <Them>Ridgeline overbilled on 3 of their last 8 drops. flag it before their pricing renews?</Them>
      <Me>yes</Me>
    </Phone>
  );
}
