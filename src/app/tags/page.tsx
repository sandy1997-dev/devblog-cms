import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags } from "@/lib/mdx";
import { generateMetadata as genMeta } from "@/lib/seo";
export const metadata: Metadata = genMeta({ title: "Topics", description: "All topics and categories." });
export default function TagsPage() {
  const tags = getAllTags();
  return (
    <div className="page-enter mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-14">
        <h1 className="font-display text-display-md text-ink-950 dark:text-ink-50 mb-4 leading-none">Topics</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400">{tags.length} topics · {tags.reduce((a,t) => a+t.count, 0)} articles.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag, i) => (
          <Link key={tag.slug} href={`/tags/${tag.slug}`} className="group card-hover p-5 flex items-start justify-between gap-4 animate-fade-up" style={{animationDelay:`${i*40}ms`}}>
            <div>
              <h2 className="font-ui font-semibold text-ink-900 dark:text-ink-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-1">{tag.name}</h2>
              <p className="text-sm text-ink-400">{tag.count} {tag.count===1?"article":"articles"}</p>
            </div>
            <span className="font-mono text-3xl font-bold text-ink-100 dark:text-ink-800 group-hover:text-amber-100 dark:group-hover:text-amber-950/50 transition-colors select-none">{String(tag.count).padStart(2,"0")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
