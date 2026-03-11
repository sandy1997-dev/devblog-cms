import Link from "next/link";
import type { Metadata } from "next";
import { getAllSeries } from "@/lib/mdx";
import { generateMetadata as genMeta } from "@/lib/seo";
import { BookOpenIcon, ArrowRightIcon } from "lucide-react";
export const metadata: Metadata = genMeta({ title: "Series", description: "Multi-part deep-dive series." });
export default function SeriesPage() {
  const series = getAllSeries();
  return (
    <div className="page-enter mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-14">
        <h1 className="font-display text-display-md text-ink-950 dark:text-ink-50 mb-4 leading-none">Series</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400">Multi-part deep-dives on focused topics.</p>
      </header>
      {series.length === 0 ? (
        <p className="text-ink-400 text-center py-20">No series yet.</p>
      ) : (
        <div className="grid gap-6">
          {series.map((s) => (
            <div key={s.name} className="card p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-signal-100 dark:bg-signal-950/30 flex items-center justify-center">
                  <BookOpenIcon size={18} className="text-signal-600 dark:text-signal-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-ink-900 dark:text-ink-100">{s.name}</h2>
                  <p className="text-sm text-ink-400 font-ui">{s.posts.length} parts</p>
                </div>
              </div>
              <ol className="space-y-2">
                {s.posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="flex items-center gap-3 group py-2 px-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors">
                      <span className="font-mono text-xs text-ink-300 dark:text-ink-600 w-5 shrink-0">{p.order}</span>
                      <span className="text-sm text-ink-700 dark:text-ink-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex-1">{p.title}</span>
                      <ArrowRightIcon size={13} className="shrink-0 text-ink-300 group-hover:text-amber-500" />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
