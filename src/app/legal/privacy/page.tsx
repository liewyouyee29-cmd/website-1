import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Privacy Policy" updated="October 5, 2026" activePath="/rivac">
      <H2>What we collect</H2>
      <P>Account details: email address, display name and a secure password hash. Usage data: generation settings, model choices and error logs needed to operate and improve the Service. Uploaded content: the images, videos and prompts you explicitly submit for processing. We never collect payment card numbers ourselves — payments happen through our payment provider's hosted checkout.</P>
      <H2>How we use data</H2>
      <P>We use your data to run the Service (store creations, spend credits, send transactional emails), to prevent abuse (rate limiting, content review for public posts) and to improve quality. With your explicit opt-in consent, anonymised outputs may be used to refine models; you can turn this off in Dashboard → Privacy & Security.</P>
      <H2>How we share data</H2>
      <P>We never sell personal data. We share data only with: infrastructure providers (hosting, object storage, email delivery), AI providers that process your prompt to return a result, and legal/regulatory authorities where required by law. Public community staples are labelled as public before you confirm.</P>
      <H2>Cookies and tracking</H2>
      <P>We use functional cookies for sessions and preferences, and optional analytics cookies (disabled by default). You can manage all of this in Cookie Preferences.</P>
      <H2>Data retention</H2>
      <P>Account data is kept while your account is active. Deleted creations are wiped from active storage within 30 days; backups may persist up to 90 days. You can request a copy or deletion of your personal data at any time.</P>
      <H2>Your rights</H2>
      <P>Depending on where you live (including GDPR/UK-GDPR territories and CPRA states) you may have rights to access, correct, export or delete your data, and to object to certain processing. Email the privacy contact to exercise them.</P>
      <H2>Children's privacy</H2>
      <P>The Service is rated 13+. We do not knowingly collect data from children under 13. If you believe a child under 13 has provided personal data, contact us and we will delete it as soon as possible.</P>
      <H2>Security</H2>
      <P>We use HTTPS everywhere, hash passwords with bcrypt, sign session cookies with a server-side secret, keep AI credentials server-side only, and follow least-privilege access to production data.</P>
    </LegalLayout>
  );
}
