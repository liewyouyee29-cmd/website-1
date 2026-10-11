import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Refund Policy" updated="October 5, 2026" activePath="/efund">
      <H2>Scope</H2>
      <P>This policy covers subscription fees and credit packs purchased through Weaver. Because this is a standard template in demo mode, no real purchases occur until the platform connects a payment provider — the rules below describe the intended production policy.</P>
      <H2>Credit packs</H2>
      <P>Unused credit packs are refundable within 14 days of purchase, minus any credits already spent (priced at the bundle rate). Once credits are consumed by a successful generation they are not refundable.</P>
      <H2>Subscriptions</H2>
      <P>Recurring plan payments can be cancelled at any time and access continues until the end of the paid period. If you cancel within 14 days of a new paid plan starting, we refund that charge in full provided no more than a token amount of credits was used.</P>
      <H2>How to request</H2>
      <P>Open Dashboard → Billing and choose "Request refund" or contact support with your account email and order reference. Refunds are returned to the original payment method within 5–10 business days of approval.</P>
      <H2>Failed generations</H2>
      <P>Generations that error before completing never deduct credits. If a deduct-and-fail bug ever occurs, we refund the affected credits automatically.</P>
    </LegalLayout>
  );
}
