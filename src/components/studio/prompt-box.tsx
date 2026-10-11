"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";

/** Prompt composer with demo "enhance" that calls the text pipeline. */
export function PromptBox({
  value,
  onChange,
  onSubmit,
  busy,
  placeholder,
  submitLabel = "Generate",
  showEnhance = true,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  placeholder?: string;
  submitLabel?: string;
  showEnhance?: boolean;
}) {
  const { toast } = useToast();
  const [enhancing, setEnhancing] = useState(false);

  const enhance = async () => {
    if (!value.trim()) {
      toast("Write a rough prompt first, then enhance it.", "info");
      return;
    }
    setEnhancing(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "text", input: { kind: "enhance", prompt: value, modelId: "weaver-text" } }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "Enhancement failed");
      onChange(data.text);
      toast("Prompt enhanced — review and tweak before generating.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Enhancement failed", "error");
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-card dark:border-white/10 dark:bg-zinc-900/70">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit();
        }}
        rows={3}
        placeholder={placeholder ?? "Describe what you want to create…"}
        aria-label="Prompt"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {showEnhance && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={enhancing}
              onClick={enhance}
              disabled={busy}
            >
              <Wand2 className="h-3.5 w-3.5" /> Enhance prompt
            </Button>
          )}
          <span className="hidden text-[11px] text-zinc-400 sm:inline">⌘/Ctrl + Enter to run</span>
        </div>
        <Button variant="gradient" loading={busy} onClick={onSubmit}>
          <Sparkles className="h-4 w-4" /> {submitLabel}
        </Button>
      </div>
    </div>
  );
}