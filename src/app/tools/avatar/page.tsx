"use client";

import { UserRound } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function AvatarPage() {
  const config: ToolConfig = {
    id: "avatar",
    kind: "video",
    icon: <UserRound className="h-7 w-7" />,
    eyebrow: "Video Tools",
    title: "Talking Avatar Generator",
    description: "Create a scripted presenter avatar from a photo and a script.",
    cost: 36,
    defaultPrompt: "Animate this portrait as a talking avatar, natural head motion, studio lighting",
    requiresReference: true,
    referenceLabel: "a portrait photo",
    placeholder: "Script is required with a real provider; demo animates the face.",
  };
  return <ToolStudio config={config} />;
}
