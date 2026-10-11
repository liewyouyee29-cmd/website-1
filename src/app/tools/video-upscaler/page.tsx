"use client";

import { Maximize2 } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function VideoUpscalerPage() {
  const config: ToolConfig = {
    id: "video-upscaler",
    kind: "video",
    icon: <Maximize2 className="h-7 w-7" />,
    eyebrow: "Video Tools",
    title: "Video Upscaler",
    description: "Increase video resolution while smoothing compression artefacts.",
    cost: 30,
    defaultPrompt: "Upscale this video to 4K, keep natural motion smooth",
    requiresReference: true,
    referenceLabel: "a video clip",
    placeholder: "Optional: describe the target look",
  };
  return <ToolStudio config={config} />;
}
