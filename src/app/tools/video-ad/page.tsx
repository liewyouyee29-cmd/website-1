"use client";

import { Megaphone } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function VideoAdPage() {
  const config: ToolConfig = {
    id: "video-ad",
    kind: "video",
    icon: <Megaphone className="h-7 w-7" />,
    eyebrow: "Video Tools",
    title: "Video Advertisement Maker",
    description: "Turn a product description into a scroll-stopping 15s video ad.",
    cost: 45,
    defaultPrompt: "Create a punchy 15-second product ad with bold text overlays and a strong hook",
    placeholder: "Describe your product, audience and hook…",
  };
  return <ToolStudio config={config} />;
}
