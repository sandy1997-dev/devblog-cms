"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="my-6 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
      <div className="flex border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={cn("px-4 py-2.5 text-sm font-ui font-medium transition-all",
              i === active ? "bg-white dark:bg-ink-800 text-amber-700 dark:text-amber-400 border-b-2 border-amber-500"
                           : "text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100")}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs[active].content}</div>
    </div>
  );
}
