"use client";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Render placeholder on server — prevents hydration mismatch
  if (!mounted) return <button className="btn-ghost" aria-label="Theme"><SunIcon size={17} /></button>;

  const CurrentIcon = theme === "dark" ? MoonIcon : theme === "system" ? MonitorIcon : SunIcon;
  const options = [
    { value: "light",  label: "Light",  Icon: SunIcon    },
    { value: "dark",   label: "Dark",   Icon: MoonIcon   },
    { value: "system", label: "System", Icon: MonitorIcon },
  ] as const;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="btn-ghost" aria-label={`Theme: ${theme}`}>
        <CurrentIcon size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-lg py-1.5 z-50 animate-slide-down">
          {options.map(({ value, label, Icon }) => (
            <button key={value} onClick={() => { setTheme(value); setOpen(false); }}
              className={cn("flex w-full items-center gap-2.5 px-3.5 py-2 text-sm font-ui transition-colors",
                theme === value ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                                : "text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800")}>
              <Icon size={14} />{label}
              {theme === value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
