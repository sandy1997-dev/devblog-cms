import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import { getAllPosts, parsePost, getRelatedPosts, getPostSlugs, getSeriesForPost } from "@/lib/mdx";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/seo";
import { formatDate, formatDateISO } from "@/lib/utils";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import { ClockIcon, CalendarIcon, UserIcon, ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, GithubIcon, TwitterIcon, PencilIcon } from "lucide-react";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = parsePost(params.slug);
  if (!post) return genMeta({ noIndex: true });
  return genMeta({
    title: post.frontmatter.title, description: post.frontmatter.description,
    image: post.frontmatter.image, canonical: `/blog/${post.slug}`,
    type: "article", publishedAt: formatDateISO(post.frontmatter.date),
    updatedAt: post.frontmatter.updatedAt ? formatDateISO(post.frontmatter.updatedAt) : undefined,
    tags: post.frontmatter.tags, author: post.frontmatter.author,
  });
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["anchor-link"] } }],
      [rehypePrettyCode, { theme: { dark: "one-dark-pro", light: "github-light" }, keepBackground: false, defaultLang: "plaintext",
        onVisitLine(node: { children: { type: string; value: string }[] }) {
          if (node.children.length === 0) node.children = [{ type: "text", value: " " }];
        },
      }],
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
    ],
  },
} as const;

const GRADIENTS = ["from-amber-400 to-orange-500","from-blue-400 to-cyan-500","from-violet-500 to-purple-600","from-green-400 to-emerald-500","from-rose-400 to-pink-500","from-sky-400 to-blue-500"];

export default function BlogPostPage({ params }: Props) {
  const post = parsePost(params.slug);
  if (!post) notFound();

  const related  = getRelatedPosts(post, 3);
  const series   = getSeriesForPost(post);
  const allPosts = getAllPosts();
  const idx      = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = allPosts[idx + 1] ?? null;
  const nextPost = allPosts[idx - 1] ?? null;
  const jsonLd   = generateStructuredData({ title: post.frontmatter.title, description: post.frontmatter.description, date: post.frontmatter.date, author: post.frontmatter.author, slug: post.slug, readingTime: post.readingTime, tags: post.frontmatter.tags });
  const gradientIndex = Math.abs(post.slug.charCodeAt(0) % GRADIENTS.length);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />

      <div className="page-enter">
        {/* Cover image or gradient placeholder */}
        {post.frontmatter.image ? (
          <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
            <Image src={post.frontmatter.image} alt={post.frontmatter.imageAlt ?? post.frontmatter.title}
              width={1400} height={500} className="w-full h-full object-cover" priority />
          </div>
        ) : (
          <div className={`w-full h-48 sm:h-64 bg-gradient-to-br ${GRADIENTS[gradientIndex]} flex items-center justify-center`}>
            <span className="font-display font-black text-[120px] text-white/10 select-none leading-none">
              {post.frontmatter.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_240px] gap-12 xl:gap-20">

            {/* Article */}
            <article className="min-w-0 py-10">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-ink-400 mb-8 flex-wrap">
                <Link href="/" className="hover:text-ink-700 dark:hover:text-ink-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-ink-700 dark:hover:text-ink-300 transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-ink-600 dark:text-ink-400 truncate max-w-[200px]">{post.frontmatter.title}</span>
              </nav>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {post.frontmatter.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`} className="tag-pill">{tag}</Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-display text-display-sm lg:text-display-md font-bold text-ink-950 dark:text-ink-50 leading-none text-balance mb-5">
                {post.frontmatter.title}
              </h1>

              {/* Description / lead */}
              <p className="text-xl text-ink-500 dark:text-ink-400 leading-relaxed mb-8">{post.frontmatter.description}</p>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4 border-y border-ink-100 dark:border-ink-800 mb-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center font-display font-bold text-sm text-amber-700 dark:text-amber-400">
                    {post.frontmatter.author.charAt(0)}
                  </div>
                  <span className="text-sm font-ui font-semibold text-ink-800 dark:text-ink-200">{post.frontmatter.author}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
                  <CalendarIcon size={13} />
                  <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
                </div>
                {post.frontmatter.updatedAt && (
                  <div className="flex items-center gap-1.5 text-sm text-ink-400">
                    <span className="text-xs">Updated</span>
                    <time dateTime={post.frontmatter.updatedAt}>{formatDate(post.frontmatter.updatedAt, "MMM d, yyyy")}</time>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
                  <ClockIcon size={13} /><span>{post.readingTime}</span>
                </div>
                {/* Edit in admin */}
                <Link href={`/admin/posts/${post.slug}`}
                  className="ml-auto flex items-center gap-1.5 text-xs text-ink-400 hover:text-signal-600 dark:hover:text-signal-400 transition-colors font-ui">
                  <PencilIcon size={11} /> Edit post
                </Link>
                <ShareButtons title={post.frontmatter.title} slug={post.slug} />
              </div>

              {/* Series banner */}
              {series && (
                <div className="mb-10 rounded-xl border border-signal-200 dark:border-signal-900/40 bg-signal-50/50 dark:bg-signal-950/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpenIcon size={14} className="text-signal-600 dark:text-signal-400" />
                    <h3 className="font-ui text-sm font-semibold text-signal-700 dark:text-signal-400">Series: {series.name}</h3>
                  </div>
                  <ol className="space-y-1.5">
                    {series.posts.map((p) => (
                      <li key={p.slug} className="flex items-start gap-2.5 text-sm">
                        <span className="font-mono text-[10px] text-signal-500 mt-0.5 w-4 shrink-0">{String(p.order).padStart(2,"0")}</span>
                        {p.slug === post.slug
                          ? <span className="font-medium text-signal-700 dark:text-signal-300">← {p.title} (current)</span>
                          : <Link href={`/blog/${p.slug}`} className="text-ink-600 dark:text-ink-400 hover:text-signal-700 dark:hover:text-signal-400 transition-colors">{p.title}</Link>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* MDX Content — the real article */}
              <div className="article-prose">
                {/* 👈 FIX IS HERE: Added 'as any' to options */}
                <MDXRemote source={post.content} components={mdxComponents} options={mdxOptions as any} />
              </div>

              {/* Post footer */}
              <footer className="mt-16 pt-8 border-t border-ink-100 dark:border-ink-800">
                {/* Author card */}
                <div className="card p-6 flex gap-4 items-start mb-10">
                  <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 text-2xl font-display font-bold text-amber-700 dark:text-amber-400 select-none">
                    {post.frontmatter.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-ui text-xs uppercase tracking-widest text-ink-400 mb-1">Written by</p>
                    <h4 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 mb-1">{post.frontmatter.author}</h4>
                    {post.frontmatter.authorBio && (
                      <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-3">{post.frontmatter.authorBio}</p>
                    )}
                    <div className="flex items-center gap-2">
                      {post.frontmatter.authorGithub && (
                        <a href={`https://github.com/${post.frontmatter.authorGithub}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs gap-1.5 py-1 px-2.5">
                          <GithubIcon size={12} /> GitHub
                        </a>
                      )}
                      {post.frontmatter.authorTwitter && (
                        <a href={`https://twitter.com/${post.frontmatter.authorTwitter.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs gap-1.5 py-1 px-2.5">
                          <TwitterIcon size={12} /> Twitter
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {post.frontmatter.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`} className="tag-pill">#{tag}</Link>
                  ))}
                </div>

                {/* Prev / Next */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {prevPost && (
                    <Link href={`/blog/${prevPost.slug}`} className="card-hover p-5 group">
                      <p className="flex items-center gap-1.5 text-xs font-ui text-ink-400 mb-2"><ArrowLeftIcon size={11} /> Previous</p>
                      <p className="font-display font-semibold text-sm text-ink-800 dark:text-ink-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">{prevPost.frontmatter.title}</p>
                    </Link>
                  )}
                  {nextPost && (
                    <Link href={`/blog/${nextPost.slug}`} className="card-hover p-5 group text-right w-full">
                      <p className="flex items-center justify-end gap-1.5 text-xs font-ui text-ink-400 mb-2">Next <ArrowRightIcon size={11} /></p>
                      <p className="font-display font-semibold text-sm text-ink-800 dark:text-ink-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">{nextPost.frontmatter.title}</p>
                    </Link>
                  )}
                </div>
              </footer>
            </article>

            {/* TOC Sidebar */}
            {post.frontmatter.toc !== false && post.headings.length > 2 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 py-10">
                  <TableOfContents headings={post.headings} />
                  {/* Edit link in sidebar */}
                  <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-800">
                    <Link href={`/admin/posts/${post.slug}`}
                      className="flex items-center gap-2 text-xs text-ink-400 hover:text-signal-600 dark:hover:text-signal-400 transition-colors font-ui">
                      <PencilIcon size={11} /> Edit this post
                    </Link>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="py-16 border-t border-ink-100 dark:border-ink-800">
              <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-50 mb-8">Related reading</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((rel, i) => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group block card-hover">
                    {rel.frontmatter.image ? (
                      <div className="aspect-[16/9] overflow-hidden rounded-t-2xl">
                        <Image src={rel.frontmatter.image} alt={rel.frontmatter.title} width={480} height={270}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                      </div>
                    ) : (
                      <div className={`aspect-[16/9] rounded-t-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                        <span className="font-display font-black text-4xl text-white/20 select-none">{rel.frontmatter.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">{rel.frontmatter.tags.slice(0, 2).map((t) => <span key={t} className="tag-pill">{t}</span>)}</div>
                      <h3 className="font-display font-semibold text-ink-900 dark:text-ink-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug mb-2">{rel.frontmatter.title}</h3>
                      <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-2">{rel.frontmatter.description}</p>
                      <p className="mt-3 text-xs text-ink-400 font-ui">{rel.readingTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}