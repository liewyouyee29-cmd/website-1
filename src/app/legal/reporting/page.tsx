import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Content Reporting" updated="October 5, 2026" activePath="/eportin">
      <H2>What can be reported</H2>
      <P>Anyone can report prohibited content, abusive behaviour, impersonation or IP infringement. Reports work for public gallery posts, avatar videos and music.</P>
      <H2>How to report</H2>
      <P>On any public creation, open its detail view and choose Report (in production); or use the trust & safety contact with a link and an explanation. Anonymous reports are accepted but slower to investigate.</P>
      <H2>What happens next</H2>
      <P>Reports are reviewed in priority order — safety-of-minors and non-consensual content are actioned within 24 hours. The reporter is notified when a decision is made. Retaliatory reporting is itself a violation.</P>
      <H2>IP & DMCA-style notices</H2>
      <P>If you believe a creation infringes your copyright, include your identity, the work at issue, the URL, and a statement of good faith. We follow standard notice-and-takedown practice and provide counter-notice channels.</P>
    </LegalLayout>
  );
}
