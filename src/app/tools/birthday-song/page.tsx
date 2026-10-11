"use client";

import { Cake } from "lucide-react";
import { ToolStudio, type ToolConfig } from "@/components/tools/tool-studio";

export default function BirthdaySongPage() {
  const config: ToolConfig = {
    id: "birthday-song",
    kind: "music",
    icon: <Cake className="h-7 w-7" />,
    eyebrow: "Music Tools",
    title: "Birthday Song Generator",
    description: "A personalised birthday song from a name and a few favourite things.",
    cost: 18,
    defaultPrompt: "Upbeat birthday song celebrating a fantastic person, warm and joyful",
    placeholder: "Who is it for? Any inside jokes or favourite genres?",
  };
  return <ToolStudio config={config} />;
}
