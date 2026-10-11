"use client";

import { Eraser } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function ObjectRemoverPage() {
  const config: ToolConfig = {
    id: "object-remover",
    kind: "image",
    icon: <Eraser className="h-7 w-7" />,
    eyebrow: "Image Tools",
    title: "Object Remover",
    description: "Erase unwanted objects, people or blemishes and let AI fill the space naturally.",
    cost: 8,
    defaultPrompt: "Remove the unwanted object from this photo and naturally fill the background",
    requiresReference: true,
    referenceLabel: "the photo to clean up",
    placeholder: "e.g. 'Remove the car on the right'",
  };
  return <ToolStudio config={config} />;
}
