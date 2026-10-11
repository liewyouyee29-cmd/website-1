import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Billing & Cancellation" updated="October 5, 2026" activePath="/illin">
      <H2>Plans and billing periods</H2>
      <P>Monthly plans charge on the same day each month. Annual plans charge once per year. Packs are one-time payments with no renewal. Prices shown are configurable sample values until the platform sets real pricing.</P>
      <H2>How cancellation works</H2>
      <P>Cancelling prevents the next renewal — your plan and included credits are still usable until the period ends. There is no fee for cancelling, and you can re-subscribe at any time.</P>
      <H2>Dunning and failed payments</H2>
      <P>If a payment fails, we retry a few times, then convert your account to free, keeping any creations. Unredeemed credits from the failed plan are held for 30 days in case payment is completed.</P>
      <H2>Tax and invoicing</H2>
      <P>Applicable sales tax/VAT is added at checkout where required. Receipts are emailed automatically. You can download past invoices from Dashboard → Billing.</P>
      <H2>Disputes and chargebacks</H2>
      <P>Please contact us before opening a dispute — we resolve most billing issues within one business day. Unwarranted chargebacks may result in suspension of the account while under review.</P>
    </LegalLayout>
  );
}
