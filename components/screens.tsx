import { Me, Phone, Stamp, Them, TicketPhoto } from "./phone";
import { ApprovalCard, BillOnHoldCard, DeliveryLoggedCard, RenewalCard, RequestCard } from "./cards";

/*
 * One screen per step of Procure to Pay, each done by text.
 * Jordan (designer) asks, Priya (design lead) approves, Marco (site lead) receives,
 * Dana (controller) pays. Vendors are fictional.
 */

/** Procurement: Jordan asks for monitors in plain words. */
export function ScreenRequest() {
  return (
    <Phone label="A designer texts that they need 2 monitors. Ramp Dock finds them for $598, checks the budget and sends the request to the approver.">
      <Stamp>Today 9:14 AM</Stamp>
      <Me>need 2 monitors for the new designers, under $700</Me>
      <Them>found them at Northwind Supply. $598 for both, and it fits the design budget</Them>
      <RequestCard />
      <Them>sent to Priya to approve. I&apos;ll text you when it&apos;s done</Them>
      <Stamp>9:31 AM</Stamp>
      <Them>approved. they arrive Thursday</Them>
    </Phone>
  );
}

/** Approvals: Priya approves with one word. */
export function ScreenApprove() {
  return (
    <Phone label="The design lead gets a text with the price, the budget left and the policy check. She replies yes and the order goes out.">
      <Stamp>Today 9:16 AM</Stamp>
      <Them>Jordan needs 2 monitors for the new designers</Them>
      <ApprovalCard />
      <Me>yes</Me>
      <Them>approved. order sent to Northwind, arriving Thursday</Them>
    </Phone>
  );
}

/** Receiving: Ramp texts whoever gets the delivery, they send a photo of the slip. */
export function ScreenHeadsUp() {
  return (
    <Phone label="Ramp Dock texts the site lead on delivery day. He replies with a photo of the delivery slip and Ramp records 40 sheets.">
      <Stamp>Today 7:02 AM</Stamp>
      <Them>morning Marco. Ridgeline is dropping 40 sheets of drywall at Elm St today</Them>
      <Them>snap the delivery slip when the truck shows up. that&apos;s it</Them>
      <Stamp>10:41 AM</Stamp>
      <TicketPhoto />
      <Me>here</Me>
      <Them>got it. 40 sheets, same as the order</Them>
      <DeliveryLoggedCard />
    </Phone>
  );
}

/** Accounts Payable: the bill asks for more than arrived, so Dana pays the right amount. */
export function ScreenHold() {
  return (
    <Phone label="The controller gets a text: the bill is for 45 sheets but 40 arrived. She replies 1 to pay $1,900 and dispute the rest.">
      <Stamp>Today 2:18 PM</Stamp>
      <Them>Ridgeline billed 45 sheets, but Marco&apos;s slip shows 40 arrived</Them>
      <BillOnHoldCard />
      <Them>reply 1 to pay $1,900 for what arrived and dispute the other 5</Them>
      <Me>1</Me>
      <Them>done. $1,900 goes out Nov 3, and Ridgeline has the dispute with the photo attached</Them>
    </Phone>
  );
}

/** Vendor Management: a renewal shows up before it charges, with what's actually used. */
export function ScreenRenewal() {
  return (
    <Phone label="Ramp Dock texts that a software contract renews in 14 days and 6 of 30 seats are unused. The controller replies yes to ask for fewer seats.">
      <Stamp>Mon 8:00 AM</Stamp>
      <Them>heads up. Canvas Cloud renews in 14 days</Them>
      <RenewalCard />
      <Them>only 24 of your 30 seats are used. want me to ask for 24? that saves $3,600 a year</Them>
      <Me>yes</Me>
      <Them>sent to their account rep. I&apos;ll text you when they answer</Them>
    </Phone>
  );
}
