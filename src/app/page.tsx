import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, SparklesIcon, RssIcon, BookOpenIcon, TrendingUpIcon, LayoutDashboardIcon, PenLineIcon } from "lucide-react";
import { getAllPosts, getFeaturedPosts, getAllTags, getAllSeries } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/config";
import { generateMetadata as genMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta();
export const revalidate = 3600;

const GRADIENTS = ["from-amber-400 to-orange-500","from-blue-400 to-cyan-500","from-violet-500 to-purple-600","from-green-400 to-emerald-500","from-rose-400 to-pink-500","from-sky-400 to-blue-500"];

export default function HomePage() {
  const allPosts  = getAllPosts();
  const featured  = getFeaturedPosts(1);
  const hero      = featured[0] ?? allPosts[0];
  const recent    = allPosts.slice(0, 6);
  const tags      = getAllTags().slice(0, 14);
  const allSeries = getAllSeries().slice(0, 3);

  return (
    <div className="page-enter">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-ink-200/60 dark:border-ink-800/60">
        <div className="bg-dots absolute inset-0 opacity-60" />
        <div aria-hidden className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">

            <div className="space-y-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30 px-4 py-1.5 text-xs font-ui font-semibold text-amber-700 dark:text-amber-400">
                <SparklesIcon size={12} /> Engineering Perspectives by {siteConfig.author.name}
              </div>
              <h1 className="font-display text-display-lg text-ink-950 dark:text-ink-50 text-balance leading-none">
                Depth-first writing on{" "}
                <em className="not-italic text-amber-600 dark:text-amber-400">software craft</em>
              </h1>
              <p className="text-xl text-ink-600 dark:text-ink-400 leading-relaxed max-w-lg">{siteConfig.description}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1 animate-fade-up animate-delay-200">
                <Link href="/blog" className="btn-primary">Browse all posts <ArrowRightIcon size={15} /></Link>
                <Link href="/about" className="btn-outline">About me</Link>
                <Link href="/rss.xml" target="_blank" className="btn-ghost gap-1.5 text-amber-600 dark:text-amber-500"><RssIcon size={14} /> RSS</Link>
              </div>
              <div className="flex items-center gap-6 pt-2 border-t border-ink-200/60 dark:border-ink-800/60 animate-fade-up animate-delay-300">
                {[{n: allPosts.length, label:"articles"},{n: getAllTags().length, label:"topics"},{n: getAllSeries().length, label:"series"}].map((s) => (
                  <div key={s.label}>
                    <span className="font-display font-bold text-2xl text-amber-600 dark:text-amber-400">{s.n}</span>
                    <span className="ml-1.5 text-sm text-ink-400 font-ui">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card */}
            {hero ? (
              <div className="animate-fade-up animate-delay-300">
                <p className="font-ui text-[10px] font-semibold uppercase tracking-widest text-ink-400 mb-3">✦ Latest Post</p>
                <Link href={`/blog/${hero.slug}`} className="group block">
                  <article className="card-hover overflow-hidden">
                    {hero.frontmatter.image ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <Image src={hero.frontmatter.image} alt={hero.frontmatter.imageAlt ?? hero.frontmatter.title} width={800} height={450}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" priority />
                      </div>
                    ) : (
                      <div className={`aspect-[16/9] bg-gradient-to-br ${GRADIENTS[0]} flex items-center justify-center`}>
                        <span className="font-display font-black text-7xl text-white/20 select-none">{hero.frontmatter.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-1.5 mb-3">{hero.frontmatter.tags.slice(0, 3).map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
                      <h2 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug mb-2">{hero.frontmatter.title}</h2>
                      <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-2 mb-4">{hero.frontmatter.description}</p>
                      <div className="flex items-center justify-between text-xs text-ink-400 font-ui">
                        <time dateTime={hero.frontmatter.date}>{formatDate(hero.frontmatter.date)}</time>
                        <span>{hero.readingTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ) : (
              /* No posts yet — show admin CTA */
              <div className="animate-fade-up animate-delay-300">
                <div className="card p-8 text-center border-2 border-dashed border-ink-200 dark:border-ink-800">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-signal-50 dark:bg-signal-950/30 flex items-center justify-center mb-4">
                    <PenLineIcon size={24} className="text-signal-600 dark:text-signal-400" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink-900 dark:text-ink-100 mb-2">Ready to write?</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400 mb-5 leading-relaxed">Open the admin panel to create your first post.</p>
                  <Link href="/admin" className="btn-primary gap-2 w-full justify-center">
                    <LayoutDashboardIcon size={15} /> Open Admin Panel
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Recent posts ──────────────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-50">Recent writing</h2>
              <p className="text-ink-500 dark:text-ink-400 mt-1 text-sm">Latest from the blog</p>
            </div>
            <Link href="/blog" className="text-sm font-ui font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">View all <ArrowRightIcon size={13} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <article className="card-hover h-full flex flex-col">
                  {post.frontmatter.image ? (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
                      <Image src={post.frontmatter.image} alt={post.frontmatter.title} width={480} height={270}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                    </div>
                  ) : (
                    <div className={`aspect-[16/9] rounded-t-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                      <span className="font-display font-black text-5xl text-white/20 select-none">{post.frontmatter.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">{post.frontmatter.tags.slice(0, 2).map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
                    <h3 className="font-display text-lg font-bold text-ink-900 dark:text-ink-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug mb-2 flex-1">{post.frontmatter.title}</h3>
                    <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-2 mb-4">{post.frontmatter.description}</p>
                    <div className="flex items-center justify-between text-xs text-ink-400 font-ui border-t border-ink-100 dark:border-ink-800 pt-3 mt-auto">
                      <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date, "MMM d, yyyy")}</time>
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Series ────────────────────────────────────────────────── */}
      {allSeries.length > 0 && (
        <section className="border-t border-ink-200/60 dark:border-ink-800/60 bg-ink-50/40 dark:bg-ink-900/20">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <div><h2 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-50">Series</h2>
                <p className="text-ink-500 dark:text-ink-400 mt-1 text-sm">Multi-part deep-dives</p></div>
              <Link href="/series" className="text-sm font-ui font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">All series <ArrowRightIcon size={13} /></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allSeries.map((s) => (
                <div key={s.name} className="card p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-signal-100 dark:bg-signal-950/30 flex items-center justify-center shrink-0">
                      <TrendingUpIcon size={14} className="text-signal-600 dark:text-signal-400" />
                    </div>
                    <div>
                      <h3 className="font-ui font-semibold text-sm text-ink-900 dark:text-ink-100">{s.name}</h3>
                      <p className="text-[10px] text-ink-400 font-ui">{s.posts.length} parts</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {s.posts.slice(0, 3).map((p) => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors py-0.5">
                        <span className="font-mono text-[10px] text-ink-300 dark:text-ink-600 w-4 shrink-0">{p.order}</span>
                        <span className="truncate">{p.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Topics ────────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <section className="border-t border-ink-200/60 dark:border-ink-800/60">
          <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-baseline justify-between mb-8">
              <div><h2 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-50">Browse by topic</h2>
                <p className="text-ink-500 dark:text-ink-400 mt-1 text-sm">{tags.length} topics covered</p></div>
              <Link href="/tags" className="text-sm font-ui font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">All topics <ArrowRightIcon size={13} /></Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${tag.slug}`} className="tag-pill text-sm py-1.5 px-4">
                  {tag.name}<span className="ml-1.5 font-mono text-[10px] text-ink-400 dark:text-ink-500">{tag.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Admin + RSS CTA ───────────────────────────────────────── */}
      <section className="border-t border-ink-200/60 dark:border-ink-800/60 bg-gradient-to-br from-amber-50/80 to-ink-50 dark:from-amber-950/20 dark:to-ink-900/40">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="card p-6 text-center">
              <div className="h-12 w-12 mx-auto rounded-xl bg-signal-100 dark:bg-signal-950/30 flex items-center justify-center mb-4">
                <LayoutDashboardIcon size={20} className="text-signal-600 dark:text-signal-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 mb-2">Write a post</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-4 leading-relaxed">Use the admin panel to create, edit, and manage all your posts.</p>
              <Link href="/admin" className="btn-primary w-full justify-center gap-2">
                <LayoutDashboardIcon size={14} /> Open Admin
              </Link>
            </div>
            <div className="card p-6 text-center">
              <div className="h-12 w-12 mx-auto rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-4">
                <RssIcon size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 mb-2">Stay updated</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-4 leading-relaxed">Subscribe via RSS — no email, no spam. Just the writing.</p>
              <Link href="/rss.xml" target="_blank" className="btn-outline w-full justify-center gap-2">
                <RssIcon size={14} /> Subscribe to RSS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
