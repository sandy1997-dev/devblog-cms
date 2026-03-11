"use client";
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-amber-500 origin-left transition-transform duration-75"
      style={{ transform: `scaleX(${pct / 100})` }}
      role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} />
  );
}
