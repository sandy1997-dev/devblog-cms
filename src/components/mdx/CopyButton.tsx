"use client";
import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-mono text-ink-400 transition-all hover:bg-ink-700 hover:text-ink-200 active:scale-95"
      aria-label="Copy code"
    >
      {copied
        ? <><CheckIcon size={11} className="text-green-400" /><span className="text-green-400">Copied!</span></>
        : <><CopyIcon size={11} /><span>Copy</span></>}
    </button>
  );
}
