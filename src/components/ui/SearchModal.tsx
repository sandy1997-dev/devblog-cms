"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { SearchIcon, XIcon, ArrowRightIcon, TagIcon, ClockIcon } from "lucide-react";
import Fuse from "fuse.js";
import { formatDate, cn } from "@/lib/utils";
import type { SearchResult } from "@/types";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index,   setIndex]   = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || index.length) return;
    setLoading(true);
    fetch("/api/search").then((r) => r.json()).then(setIndex).catch(console.error).finally(() => setLoading(false));
  }, [open, index.length]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setActive(0); return; }
    const fuse = new Fuse(index, { keys: [{ name: "title", weight: 2 }, { name: "description", weight: 1 }, { name: "tags", weight: 0.5 }], threshold: 0.35 });
    setResults(fuse.search(query).slice(0, 8).map((r) => r.item));
    setActive(0);
  }, [query, index]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(""); setResults([]); }
  }, [open]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    const len = results.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % len); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => (a - 1 + len) % len); }
    if (e.key === "Escape")    onClose();
    if (e.key === "Enter" && results[active]) { onClose(); window.location.href = `/blog/${results[active].slug}`; }
  }, [results, active, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-950/50 dark:bg-ink-950/70 backdrop-blur-sm animate-fade-in" />
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 shadow-2xl overflow-hidden animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-100 dark:border-ink-800">
          <SearchIcon size={18} className="shrink-0 text-ink-400" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Search posts…" className="flex-1 bg-transparent text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 outline-none" />
          {query && <button onClick={() => setQuery("")} className="btn-ghost p-1"><XIcon size={14} /></button>}
          <kbd className="hidden sm:block font-mono text-[10px] text-ink-400 border border-ink-200 dark:border-ink-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {loading && <div className="py-12 text-center text-sm text-ink-400">Loading…</div>}
          {!loading && query && results.length === 0 && <div className="py-12 text-center text-sm text-ink-400">No results for "{query}"</div>}
          {!loading && results.length > 0 && (
            <ul className="py-2">
              {results.map((r, i) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} onClick={onClose}
                    className={cn("flex items-start gap-3 px-4 py-3 transition-colors", i === active ? "bg-amber-50 dark:bg-amber-950/30" : "hover:bg-ink-50 dark:hover:bg-ink-800/50")}>
                    <ArrowRightIcon size={14} className={cn("mt-1 shrink-0", i === active ? "text-amber-600 dark:text-amber-400" : "text-ink-300 dark:text-ink-600")} />
                    <div className="flex-1 min-w-0">
                      <p className="font-ui font-medium text-sm text-ink-900 dark:text-ink-100 truncate">{r.title}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5 line-clamp-1">{r.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {r.tags.slice(0, 2).map((t) => <span key={t} className="flex items-center gap-1 text-[10px] text-ink-400"><TagIcon size={9}/>{t}</span>)}
                        <span className="flex items-center gap-1 text-[10px] text-ink-400"><ClockIcon size={9}/>{formatDate(r.date, "MMM yyyy")}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!loading && !query && <div className="py-8 text-center text-sm text-ink-400">Start typing to search…</div>}
        </div>
        <div className="border-t border-ink-100 dark:border-ink-800 px-4 py-2.5 flex gap-4 text-[10px] text-ink-400 font-mono">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  );
}
