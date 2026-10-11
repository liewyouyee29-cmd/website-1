import { LegalLayout, H2, P } from "@/components/legal/legal-layout";

export default function Page() {
  return (
    <LegalLayout title="AI Transparency" updated="October 5, 2026" activePath="/i-transparenc">
      <H2>What this page is</H2>
      <P>A plain-language description of how artificial intelligence is used in Weaver, so creators and viewers can make informed decisions.</P>
      <H2>Where AI is used</H2>
      <P>Every generation tool (video, image, music, text) uses machine-learning models. We say "AI" broadly: most image models are diffusion models, video adds motion synthesis, and music synthesis uses sample/chord engines. Output is probabilistic — it can be wrong, biased or derivative.</P>
      <H2>Demo versus production</H2>
      <P>When no AI provider is configured, Weaver runs a deterministic demo engine that renders labelled preview images, animated SVG clips and browser-synthesised audio. These are NOT true model outputs and are always labelled "Demo preview".</P>
      <H2>Labels and provenance</H2>
      <P>Creators are encouraged (and on free plans required) to label AI-assisted content. We are building C2PA-style provenance metadata so generated files can carry their own history.</P>
      <H2>Known limitations</H2>
      <P>Models may reflect biases in training data, may fail on requests involving real people, and should not be represented as a substitute for professional judgement in medicine, law or news. Always review output before publication.</P>
      <H2>Human accountability</H2>
      <P>An AI model, not a human, decides pixel colours and chord progressions. But a human creator chooses the prompt, publishes the result and is responsible for it.</P>
    </LegalLayout>
  );
}
