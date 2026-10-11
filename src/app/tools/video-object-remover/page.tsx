"use client";

import { ScanEye } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function VideoObjectRemoverPage() {
  const config: ToolConfig = {
    id: "video-object-remover",
    kind: "video",
    icon: <ScanEye className="h-7 w-7" />,
    eyebrow: "Video Tools",
    title: "Video Object Remover",
    description: "Remove moving objects from footage frame-by-frame with AI tracking.",
    cost: 34,
    defaultPrompt: "Remove the moving object from this video and reconstruct clean frames",
    requiresReference: true,
    referenceLabel: "the video",
    placeholder: "Describe the object to remove",
  };
  return <ToolStudio config={config} />;
}
