import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { generateMetadata as genMeta } from "@/lib/seo";
import { PlusIcon, SearchIcon } from "lucide-react";

export const metadata: Metadata = genMeta({ title: "Blog", description: "All articles on software engineering, TypeScript, React and more.", canonical: "/blog" });
export const revalidate = 3600;

const GRADIENTS = ["from-amber-400 to-orange-500","from-blue-400 to-cyan-500","from-violet-500 to-purple-600","from-green-400 to-emerald-500","from-rose-400 to-pink-500","from-sky-400 to-blue-500","from-teal-400 to-green-500","from-orange-400 to-red-500"];

export default function BlogPage() {
  const posts = getAllPosts();
  const tags  = getAllTags().slice(0, 18);
  return (
    <div className="page-enter mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-display-md text-ink-950 dark:text-ink-50 mb-3 leading-none">All writing</h1>
            <p className="text-lg text-ink-500 dark:text-ink-400">{posts.length} {posts.length === 1 ? "article" : "articles"} on software engineering, TypeScript, React, and system design.</p>
          </div>
          <Link href="/admin/posts/new" className="btn-primary gap-2 shrink-0">
            <PlusIcon size={16} /> New Post
          </Link>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-400">
          <SearchIcon size={14} />
          <span>Press <kbd className="font-mono text-xs px-1.5 py-0.5 rounded border border-ink-200 dark:border-ink-700 bg-ink-100 dark:bg-ink-800">Ctrl+K</kbd> to search</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_260px] gap-14">
        <div>
          {posts.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-ink-200 dark:border-ink-800 rounded-2xl">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4">
                <PlusIcon size={28} className="text-amber-500" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100 mb-2">No posts yet</h3>
              <p className="text-ink-500 dark:text-ink-400 mb-6 max-w-xs mx-auto text-sm leading-relaxed">Write your first post using the admin panel.</p>
              <Link href="/admin" className="btn-primary gap-2"><PlusIcon size={15} /> Open Admin Panel</Link>
            </div>
          ) : (
            <div className="divide-y divide-ink-100 dark:divide-ink-800/60">
              {posts.map((post, i) => (
                <article key={post.slug} className="py-7 first:pt-0 group animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <Link href={`/blog/${post.slug}`} className="flex gap-5 items-start">
                    {/* Thumbnail */}
                    <div className="shrink-0 w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60">
                      {post.frontmatter.image ? (
                        <Image src={post.frontmatter.image} alt={post.frontmatter.imageAlt ?? post.frontmatter.title} width={288} height={192}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.07]`}>
                          <span className="font-display font-black text-3xl text-white/90 select-none">{post.frontmatter.title.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {post.frontmatter.featured && <span className="inline-flex items-center text-[10px] font-ui font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-full px-2 py-0.5">✦ Featured</span>}
                        {post.frontmatter.draft && <span className="inline-flex items-center text-[10px] font-ui font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200/60 rounded-full px-2 py-0.5">Draft</span>}
                        {post.frontmatter.tags.slice(0, 3).map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-ink-900 dark:text-ink-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug mb-1.5 line-clamp-2">{post.frontmatter.title}</h2>
                      <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed line-clamp-2 mb-2.5 hidden sm:block">{post.frontmatter.description}</p>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-ink-400 font-ui">
                        <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date, "MMM d, yyyy")}</time>
                        <span>·</span><span>{post.readingTime}</span>
                        {post.frontmatter.series && <><span>·</span><span className="text-signal-600 dark:text-signal-400">{post.frontmatter.series}</span></>}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border border-signal-200/60 dark:border-signal-800/30 bg-signal-50/50 dark:bg-signal-950/20 p-4">
              <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-signal-700 dark:text-signal-400 mb-3">Admin Panel</h3>
              <div className="space-y-2">
                {[{href:"/keystatic", icon:"⚡", label:"Dashboard"},{href:"/admin/posts/new", icon:"✎", label:"New Post"},{href:"/admin", icon:"⚙", label:"Site Settings"}].map((l) => (
                  <Link key={l.href} href={l.href} className="flex items-center gap-2 text-sm text-signal-700 dark:text-signal-400 hover:text-signal-900 dark:hover:text-signal-200 font-ui font-medium transition-colors">
                    <span className="h-5 w-5 rounded-md bg-signal-100 dark:bg-signal-900/40 flex items-center justify-center text-[10px]">{l.icon}</span>{l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag.slug} href={`/tags/${tag.slug}`} className="tag-pill">{tag.name}<span className="font-mono text-[10px] ml-1 text-ink-400">{tag.count}</span></Link>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20 p-4">
              <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">RSS Feed</h3>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mb-3 leading-relaxed">New posts in your reader — no email needed.</p>
              <Link href="/rss.xml" target="_blank" className="btn-primary w-full justify-center text-xs py-2">Subscribe to RSS</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
