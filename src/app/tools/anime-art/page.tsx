"use client";

import { Cat } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function AnimeArtPage() {
  const config: ToolConfig = {
    id: "anime-art",
    kind: "image",
    icon: <Cat className="h-7 w-7" />,
    eyebrow: "Image Tools",
    title: "Anime Art Generator",
    description: "Convert photos or concepts into polished anime and manga artwork.",
    cost: 5,
    defaultPrompt: "Convert this into high-quality anime artwork with vibrant cel shading",
    requiresReference: true,
    referenceLabel: "a photo or sketch",
    placeholder: "Specify the anime style: e.g. 'shoujo, pastel, detailed eyes'",
  };
  return <ToolStudio config={config} />;
}
