import { Me, Phone, Stamp, Them, TicketPhoto } from "./phone";
import { DeliveryLoggedCard } from "./cards";

/* Marco (site lead) receives a drywall delivery. Ridgeline Lumber is fictional. */

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
