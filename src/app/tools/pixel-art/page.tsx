"use client";

import { Grid3X3 } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function PixelArtPage() {
  const config: ToolConfig = {
    id: "pixel-art",
    kind: "image",
    icon: <Grid3X3 className="h-7 w-7" />,
    eyebrow: "Image Tools",
    title: "Pixel Art Studio",
    description: "Turn images or ideas into crisp, retro pixel art with palette control.",
    cost: 4,
    defaultPrompt: "Convert this into crisp pixel art, retro game style, limited palette",
    placeholder: "Describe the pixel scene — sprite, tileset, palette…",
  };
  return <ToolStudio config={config} />;
}
