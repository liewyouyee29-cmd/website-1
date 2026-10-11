import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Terms of Service" updated="October 5, 2026" activePath="/erm">
      <H2>1. Acceptance of Terms</H2>
      <P>By accessing or using Weaver AI Studio ("Weaver" or "the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you are using the Service on behalf of an organisation, you represent that you have authority to bind it. If you do not agree, do not use the Service.</P>
      <H2>2. Eligibility</H2>
      <P>You must be at least 13 years old to use the Service. If you are under 18, you must have permission from a parent or legal guardian. By using the Service you confirm that you meet these requirements and that this use complies with any laws that apply to you.</P>
      <H2>3. Accounts and Security</H2>
      <P>You are responsible for safeguarding your password, keeping your account details accurate, and for everything that happens under your account. You must notify us promptly if you suspect unauthorised access. Sharing credentials with third parties may result in suspension.</P>
      <H2>4. Subscription and Credits</H2>
      <P>Paid plans and credit packs are described on the Pricing page, which we may update or withdraw at any time. Features included at a particular price may change as Configurable Sample pricing evolves. You will always see the estimated credit cost before a generation runs, and no charge is ever made without explicit confirmation on a clear checkout page.</P>
      <H2>5. Acceptable Use</H2>
      <P>You may not use the Service to generate, upload or share content that: is illegal in your jurisdiction; depicts real people in a deceptive or non-consensual manner (including sexualised depictions of minors or deepfakes of private individuals); promotes violence, terror, hate, self-harm or harassment; infringes third-party rights; or is designed to deceive, defraud or phish. See our Content & Safety Policy for details.</P>
      <H2>6. Ownership of Your Creations</H2>
      <P>You retain all rights you hold in the content you submit and, subject to paid plan terms, the media you generate. You grant us a limited licence to store, process and (where you choose to publish publicly) display your content solely to operate the Service. Free accounts include a visible Weaver watermark on some outputs. Commercial licensing is included with all paid plans.</P>
      <H2>7. IP and Brand</H2>
      <P>The Service, its software, branding and the "Weaver AI Studio" name are our property or that of our licensors. You may not use our branding, logos or trademarks without written permission.</P>
      <H2>8. Termination</H2>
      <P>You may stop using the Service at any time and cancel a subscription in Dashboard → Billing. We may suspend or terminate accounts that violate these Terms, subject to reasonable notice where practical. Terminated accounts lose access to unredeemed credits unless required by law; refunds follow the Refund Policy.</P>
      <H2>9. Disclaimers and Limitation of Liability</H2>
      <P>The Service is provided "as is" without warranties of any kind. AI-generated output is experimental: it may be wrong, biased or unsuitable for your use case. Review outputs before publishing. To the maximum extent permitted by law, Weaver's aggregate liability under these Terms is limited to the amount you paid us in the twelve months before the claim.</P>
      <H2>10. Changes to These Terms</H2>
      <P>We may update these Terms from time to time. Material changes will be announced on this page and, where appropriate, by email. Continuing to use the Service after changes take effect means you accept the new Terms.</P>
      <H2>11. Contact</H2>
      <P>Questions about these Terms? Contact support — this is a demo build, so the exact support contact is replaced by the platform owner before production.</P>
    </LegalLayout>
  );
}
