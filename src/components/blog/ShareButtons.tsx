"use client";
import { useState } from "react";
import { TwitterIcon, LinkIcon, CheckIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.url}/blog/${slug}`;
  const handleCopy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-ui text-ink-400 mr-1">Share:</span>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost gap-1.5 text-xs py-1.5 px-3">
        <TwitterIcon size={13} /><span className="hidden sm:block">Twitter</span>
      </a>
      <button onClick={handleCopy} className="btn-ghost gap-1.5 text-xs py-1.5 px-3">
        {copied ? <><CheckIcon size={13} className="text-signal-500" /><span className="hidden sm:block text-signal-600 dark:text-signal-400">Copied!</span></>
                : <><LinkIcon size={13} /><span className="hidden sm:block">Copy link</span></>}
      </button>
    </div>
  );
}
