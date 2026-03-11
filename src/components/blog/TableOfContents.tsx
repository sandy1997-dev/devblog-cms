"use client";
import { useState, useEffect } from "react";
import { ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/types";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) setActiveId(e.target.id); } },
      { rootMargin: "-80px 0% -60% 0%", threshold: 0 }
    );
    headings.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table of contents">
      <div className="flex items-center gap-2 mb-3">
        <ListIcon size={13} className="text-ink-400" />
        <h4 className="font-ui text-[10px] font-semibold uppercase tracking-widest text-ink-400">Contents</h4>
      </div>
      <ul className="space-y-0.5">
        {headings.filter((h) => h.level <= 3).map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`}
              className={cn("block py-1 text-sm border-l-2 transition-all duration-150",
                h.level === 3 ? "pl-6" : "pl-3",
                activeId === h.id
                  ? "text-amber-700 dark:text-amber-400 border-amber-500 font-medium"
                  : "text-ink-500 dark:text-ink-400 border-transparent hover:text-ink-900 dark:hover:text-ink-100 hover:border-ink-300 dark:hover:border-ink-600")}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
