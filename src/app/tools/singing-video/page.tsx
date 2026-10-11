"use client";

import { MicVocal } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function SingingVideoPage() {
  const config: ToolConfig = {
    id: "singing-video",
    kind: "video",
    icon: <MicVocal className="h-7 w-7" />,
    eyebrow: "Video Tools",
    title: "Singing Video Generator",
    description: "Animate a photo to lipsync an original or uploaded song.",
    cost: 40,
    defaultPrompt: "Animate this portrait to sing expressively with natural mouth movement",
    requiresReference: true,
    referenceLabel: "a portrait photo",
    placeholder: "Optional: describe the performance mood",
  };
  return <ToolStudio config={config} />;
}
