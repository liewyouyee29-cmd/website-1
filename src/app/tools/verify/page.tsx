"use client";

import { BadgeCheck, ShieldAlert, FileSearch } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function VerifyPage() {
  const config: ToolConfig = {
    id: "verify",
    kind: "image",
    icon: <ShieldAlert className="h-7 w-7" />,
    eyebrow: "Trust & Safety",
    title: "AI Content Verification",
    description: "Check whether an image shows AI-generation signals. Estimates only — not a judgement.",
    cost: 1,
    defaultPrompt: "Analyze this image for AI-generation signals",
    requiresReference: true,
    referenceLabel: "the image to check",
  };
  return <ToolStudio config={config} />;
}
