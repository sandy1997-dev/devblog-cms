import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { generateMetadata as genMeta } from "@/lib/seo";
import { ArrowLeftIcon } from "lucide-react";
interface Props { params: { tag: string } }
export async function generateStaticParams() { return getAllTags().map((t) => ({ tag: t.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = getAllTags().find((t) => t.slug === params.tag);
  if (!tag) return genMeta({ noIndex: true });
  return genMeta({ title: `${tag.name} articles`, description: `All ${tag.count} articles tagged ${tag.name}.` });
}
export default function TagPage({ params }: Props) {
  const tag = getAllTags().find((t) => t.slug === params.tag);
  if (!tag) notFound();
  const posts = getAllPosts({ tag: tag.name });
  return (
    <div className="page-enter mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/tags" className="inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 mb-8 transition-colors"><ArrowLeftIcon size={13} /> All topics</Link>
      <header className="mb-12">
        <div className="flex items-baseline gap-4 mb-3">
          <h1 className="font-display text-display-sm text-ink-950 dark:text-ink-50 leading-none">{tag.name}</h1>
          <span className="font-mono text-xl text-ink-300 dark:text-ink-700">x{tag.count}</span>
        </div>
      </header>
      <div className="divide-y divide-ink-100 dark:divide-ink-800/60">
        {posts.map((post) => (
          <article key={post.slug} className="py-6 first:pt-0 group">
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-2">{post.frontmatter.title}</h2>
              <p className="text-ink-500 dark:text-ink-400 leading-relaxed mb-3 line-clamp-2">{post.frontmatter.description}</p>
              <div className="flex items-center gap-4 text-sm text-ink-400 font-ui">
                <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
                <span>·</span><span>{post.readingTime}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
