import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="Cookie Preferences" updated="October 5, 2026" activePath="/ookie">
      <H2>What are cookies?</H2>
      <P>Cookies are small files stored on your device that help websites remember you and understand how they're used. Weaver uses only the cookies described below.</P>
      <H2>Strictly necessary</H2>
      <P>Session, authentication and security cookies. These are required for sign-in, credit balance and account features to work. They cannot be disabled.</P>
      <H2>Preferences & analytics</H2>
      <P>Theme preference and optional, aggregate analytics. Analytics are off by default. We use them only to understand which features are useful — never for cross-site advertising.</P>
      <H2>Managing cookies</H2>
      <P>You can block or clear cookies in your browser settings. Note that signing out and signing back in is required to apply some preference changes. This demo does not set ad, profiling or third-party marketing cookies at all.</P>
    </LegalLayout>
  );
}
