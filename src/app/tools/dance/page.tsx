"use client";

import { PartyPopper } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function DancePage() {
  const config: ToolConfig = {
    id: "dance",
    kind: "video",
    icon: <PartyPopper className="h-7 w-7" />,
    eyebrow: "Video Tools",
    title: "AI Dance Generator",
    description: "Animate a figure with trending dance motions from a prompt.",
    cost: 32,
    defaultPrompt: "Generate a stylized dancer performing an energetic urban routine",
    placeholder: "Which dance style? e.g. hip-hop, k-pop, ballet…",
  };
  return <ToolStudio config={config} />;
}
