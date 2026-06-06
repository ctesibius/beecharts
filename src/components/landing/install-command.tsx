"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COMMAND = "pnpm dlx shadcn@latest add @beecharts/bar-chart";

export function InstallCommand({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(COMMAND).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div
      className={cn(
        "bg-muted/40 flex items-center gap-3 rounded-md border px-3 py-2",
        className,
      )}
    >
      <code className="text-muted-foreground flex-1 truncate font-mono text-xs sm:text-sm">
        <span className="text-foreground/40 select-none">$ </span>
        {COMMAND}
      </code>
      <Button
        size="icon"
        variant="ghost"
        className="size-7 shrink-0"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy install command"}
      >
        {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}
