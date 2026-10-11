"use client";

import { useState } from "react";
import { Maximize } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";
import { SettingsSection } from "@/components/studio/studio-shell";
import { Chip } from "@/components/ui/fields";

export default function ImageUpscalerPage() {
  const [factor, setFactor] = useState(4);
  const config: ToolConfig = {
    id: "image-upscaler",
    kind: "image",
    icon: <Maximize className="h-7 w-7" />,
    eyebrow: "Image Tools",
    title: "Image Upscaler",
    description: "Increase resolution up to 4× while keeping edges and textures crisp.",
    cost: 12,
    defaultPrompt: "Upscale this image 4x, preserve all details and textures",
    requiresReference: true,
    referenceLabel: "an image to upscale",
    settings: (
      <SettingsSection title="Upscale factor">
        <div className="flex gap-2">
          {[2, 4].map((f) => (
            <Chip key={f} active={factor === f} onClick={() => setFactor(f)}>{f}×</Chip>
          ))}
        </div>
      </SettingsSection>
    ),
  };
  return <ToolStudio config={config} />;
}
