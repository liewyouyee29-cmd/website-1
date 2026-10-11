import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Content & Safety Policy" updated="October 5, 2026" activePath="/afet">
      <H2>Our approach</H2>
      <P>Weaver is a creative tool, and we want it to be a welcoming, safe space. We apply a layered approach: input filtering where a provider supports it, human review of reported content, and clear labels on AI-generated media.</P>
      <H2>Prohibited content</H2>
      <P>Creators may not generate or publish: CSAM or sexualised minors under any circumstances; non-consensual intimate imagery; deepfakes of real private individuals for deception; instructions for violence, weapons, explosives or crime; hate speech or harassment; spam, phishing or fraud; or content that violates copyright.</P>
      <H2>Enforcement</H2>
      <P>Verdicated violations result in content removal and, for severe or repeated cases, account termination. We cooperate with law enforcement where required. Automated filters are imperfect — false positives can be appealed.</P>
      <H2>Age-appropriateness</H2>
      <P>The Service requires users to be 13+. Accounts used by younger children are closed. Parents may request the deletion of a child's data via the privacy contact.</P>
      <H2>Appeals</H2>
      <P>If you believe a moderation decision was wrong, reply to the removal notice or email the trust & safety contact with the reference number. We re-review within 5 business days.</P>
    </LegalLayout>
  );
}
