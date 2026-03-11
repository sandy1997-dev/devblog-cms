// NO "use client" here — this file is imported by a Server Component.
// Client-only components (CopyButton, Tabs) are in their own files with "use client".
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangleIcon, InfoIcon, LightbulbIcon, XIcon } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { Tabs } from "./Tabs";
import { cn } from "@/lib/utils";

// ── Code block (pre) ─────────────────────────────────────────────────────────
// Server component — CopyButton inside is client
function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement> & { "data-language"?: string }) {
  const language = (props as Record<string, string>)["data-language"];
  // Extract raw text for copy button by recursively getting string content
  const getRawText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getRawText).join("");
    if (React.isValidElement(node)) return getRawText((node.props as { children?: React.ReactNode }).children);
    return "";
  };
  const rawText = getRawText(children);

  return (
    <div className="group relative my-6 rounded-xl overflow-hidden border border-ink-800/60 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between px-4 py-2.5 bg-ink-900/80 border-b border-ink-800/60">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex items-center gap-3">
          {language && <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">{language}</span>}
          <CopyButton text={rawText} />
        </div>
      </div>
      <pre className={cn("overflow-x-auto p-5 text-sm leading-relaxed bg-ink-950", className)} {...props}>
        {children}
      </pre>
    </div>
  );
}

// ── Callout ───────────────────────────────────────────────────────────────────
type CalloutType = "info" | "warning" | "tip" | "danger";
const calloutStyles: Record<CalloutType, { icon: React.ElementType; label: string; wrapper: string; iconCls: string; titleCls: string }> = {
  info:    { icon: InfoIcon,          label: "Note",    wrapper: "bg-blue-950/40 border-blue-700/40 text-blue-100",    iconCls: "text-blue-400",   titleCls: "text-blue-300"   },
  warning: { icon: AlertTriangleIcon, label: "Warning", wrapper: "bg-amber-950/40 border-amber-700/40 text-amber-100", iconCls: "text-amber-400",  titleCls: "text-amber-300"  },
  tip:     { icon: LightbulbIcon,     label: "Tip",     wrapper: "bg-green-950/40 border-green-700/40 text-green-100", iconCls: "text-green-400",  titleCls: "text-green-300"  },
  danger:  { icon: XIcon,             label: "Danger",  wrapper: "bg-red-950/40 border-red-700/40 text-red-100",       iconCls: "text-red-400",    titleCls: "text-red-300"    },
};

function Callout({ type = "info", title, children }: { type?: CalloutType; title?: string; children: React.ReactNode }) {
  const s = calloutStyles[type];
  return (
    <div className={cn("my-6 rounded-xl border p-4 pl-5", s.wrapper)} role={type === "warning" || type === "danger" ? "alert" : "note"}>
      <div className="flex items-start gap-3">
        <s.icon size={18} className={cn("mt-0.5 shrink-0", s.iconCls)} />
        <div className="flex-1 min-w-0">
          {(title ?? s.label) && <p className={cn("mb-1 font-ui font-semibold text-sm", s.titleCls)}>{title ?? s.label}</p>}
          <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────
function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="my-6 space-y-4 list-none pl-0">{children}</ol>;
}
function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-ui font-bold text-sm">{"\u2022"}</div>
      <div className="flex-1 pt-0.5">
        <p className="font-ui font-semibold text-ink-900 dark:text-ink-100 mb-1">{title}</p>
        <div className="text-ink-700 dark:text-ink-300 [&>p]:mt-0">{children}</div>
      </div>
    </li>
  );
}

// ── Image with caption ────────────────────────────────────────────────────────
function ImageWithCaption({ src = "", alt = "", caption, width = 1200, height = 630 }: { src?: string; alt?: string; caption?: string; width?: number; height?: number }) {
  return (
    <figure className="my-8 -mx-4 sm:mx-0">
      <div className="overflow-hidden rounded-xl border border-ink-200 dark:border-ink-800 shadow-lg">
        <Image src={src} alt={alt} width={width} height={height} className="w-full object-cover" />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-ink-500 dark:text-ink-400 italic">{caption}</figcaption>}
    </figure>
  );
}

// ── Exported component map ────────────────────────────────────────────────────
export const mdxComponents = {
  pre:             CodeBlock,
  Callout,
  ImageWithCaption,
  Steps,
  Step,
  Tabs,

  // Override anchor: external links open in new tab
  a: ({ href = "#", children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) =>
    href.startsWith("http")
      ? <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
      : <Link href={href} {...props}>{children}</Link>,

  // Custom blockquote
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="my-6 border-l-4 border-amber-400 pl-6 py-1 not-italic">
      <div className="text-lg leading-relaxed text-ink-700 dark:text-ink-300 font-display">{children}</div>
    </blockquote>
  ),

  // Custom table
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
      <table className="min-w-full divide-y divide-ink-200 dark:divide-ink-800">{children}</table>
    </div>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="bg-ink-50 dark:bg-ink-900 px-4 py-3 text-left text-xs font-ui font-semibold uppercase tracking-wider text-ink-600 dark:text-ink-400">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-4 py-3 text-sm text-ink-700 dark:text-ink-300 border-t border-ink-100 dark:border-ink-800">{children}</td>
  ),

  // Decorative HR
  hr: () => (
    <div className="my-12 flex items-center gap-4">
      <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
      <div className="flex gap-1.5">{[0,1,2].map((i) => <span key={i} className="h-1 w-1 rounded-full bg-amber-400" />)}</div>
      <div className="flex-1 h-px bg-ink-200 dark:bg-ink-800" />
    </div>
  ),
};
