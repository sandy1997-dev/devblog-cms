"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, SearchIcon,
  LoaderIcon, AlertTriangleIcon, RefreshCwIcon, TagIcon,
  CalendarIcon, ClockIcon, StarIcon, FileTextIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostRow {
  slug: string; title: string; description: string;
  date: string; tags: string[]; draft: boolean;
  featured: boolean; image?: string; readingTime: string; series?: string;
}

const GRADIENTS = [
  "from-amber-400 to-orange-500", "from-blue-400 to-cyan-500",
  "from-violet-500 to-purple-600", "from-green-400 to-emerald-500",
  "from-rose-400 to-pink-500", "from-sky-400 to-blue-500",
  "from-teal-400 to-green-500", "from-orange-400 to-red-500",
];

export default function AdminDashboard() {
  const router = useRouter();
  const [posts,   setPosts]   = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all" | "published" | "draft" | "featured">("all");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,   setError]   = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    if (res.status === 401) { router.push("/admin"); return; }
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setDeleting(slug);
    const res = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      setError("Failed to delete post");
    }
    setDeleting(null);
  };

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" ? true
      : filter === "published" ? !p.draft
      : filter === "draft"     ? p.draft
      : filter === "featured"  ? p.featured
      : true;
    return matchSearch && matchFilter;
  });

  const stats = {
    total:     posts.length,
    published: posts.filter((p) => !p.draft).length,
    drafts:    posts.filter((p) => p.draft).length,
    featured:  posts.filter((p) => p.featured).length,
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-50">All Posts</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{stats.total} total posts</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary gap-2">
          <PlusIcon size={15} /> New Post
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",     value: stats.total,     color: "text-ink-700 dark:text-ink-300",      bg: "bg-white dark:bg-ink-900" },
          { label: "Published", value: stats.published, color: "text-signal-700 dark:text-signal-400", bg: "bg-signal-50 dark:bg-signal-950/20" },
          { label: "Drafts",    value: stats.drafts,    color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/20" },
          { label: "Featured",  value: stats.featured,  color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/20" },
        ].map((s) => (
          <button key={s.label} onClick={() => setFilter(s.label.toLowerCase() as typeof filter)}
            className={cn("rounded-xl border border-ink-200/60 dark:border-ink-800/60 p-4 text-left transition-all hover:shadow-sm", s.bg,
              filter === s.label.toLowerCase() ? "ring-2 ring-amber-500" : "")}>
            <p className={cn("font-display font-bold text-2xl", s.color)}>{s.value}</p>
            <p className="text-xs font-ui text-ink-500 dark:text-ink-400 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tag…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 outline-none focus:border-amber-500 transition-colors" />
        </div>
        <button onClick={fetchPosts} className="btn-ghost gap-1.5 text-sm">
          <RefreshCwIcon size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-4 py-3 rounded-xl">
          <AlertTriangleIcon size={15} />{error}
        </div>
      )}

      {/* Posts table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-ink-400">
            <LoaderIcon size={18} className="animate-spin" /> Loading posts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileTextIcon size={36} className="mx-auto text-ink-200 dark:text-ink-700 mb-3" />
            <p className="font-display font-semibold text-ink-700 dark:text-ink-300 mb-1">No posts found</p>
            <p className="text-sm text-ink-400 mb-4">
              {search ? "Try a different search term" : "Create your first post to get started"}
            </p>
            <Link href="/admin/posts/new" className="btn-primary gap-2 inline-flex">
              <PlusIcon size={14} /> Create Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900/50">
                  <th className="text-left px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500 w-12"></th>
                  <th className="text-left px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500">Post</th>
                  <th className="text-left px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500 hidden md:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500 hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500 hidden lg:table-cell">Read</th>
                  <th className="text-left px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500">Status</th>
                  <th className="text-right px-4 py-3 font-ui text-xs font-semibold uppercase tracking-wider text-ink-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800/60">
                {filtered.map((post, i) => (
                  <tr key={post.slug} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/20 transition-colors group">

                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        {post.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                            <span className="font-display font-black text-sm text-white/90 select-none">
                              {post.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title + desc */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-ui font-semibold text-ink-900 dark:text-ink-100 truncate">{post.title}</p>
                      <p className="text-xs text-ink-400 truncate mt-0.5 hidden sm:block">{post.description}</p>
                      {post.series && (
                        <p className="text-[10px] text-signal-600 dark:text-signal-400 font-ui mt-0.5">{post.series}</p>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="inline-flex items-center gap-0.5 text-[10px] font-ui bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 px-1.5 py-0.5 rounded-full">
                            <TagIcon size={8} />{t}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[10px] text-ink-400">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 font-mono whitespace-nowrap">
                        <CalendarIcon size={11} />{post.date}
                      </span>
                    </td>

                    {/* Reading time */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400 whitespace-nowrap">
                        <ClockIcon size={11} />{post.readingTime}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={cn("inline-flex items-center text-[10px] font-ui font-bold uppercase tracking-wide rounded-full px-2 py-0.5 w-fit",
                          post.draft
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                            : "bg-signal-100 dark:bg-signal-950/40 text-signal-700 dark:text-signal-400")}>
                          {post.draft ? "Draft" : "Live"}
                        </span>
                        {post.featured && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-ui font-bold uppercase tracking-wide text-violet-700 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40 rounded-full px-2 py-0.5 w-fit">
                            <StarIcon size={8} fill="currentColor" /> Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {!post.draft && (
                          <Link href={`/blog/${post.slug}`} target="_blank"
                            className="p-1.5 rounded-lg text-ink-400 hover:text-signal-600 dark:hover:text-signal-400 hover:bg-signal-50 dark:hover:bg-signal-950/20 transition-colors"
                            title="View live post">
                            <EyeIcon size={15} />
                          </Link>
                        )}
                        <Link href={`/admin/posts/${post.slug}`}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                          title="Edit post">
                          <PencilIcon size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug, post.title)}
                          disabled={deleting === post.slug}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50"
                          title="Delete post">
                          {deleting === post.slug
                            ? <LoaderIcon size={15} className="animate-spin" />
                            : <TrashIcon size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {filtered.length > 0 && (
        <p className="text-xs text-ink-400 text-center font-ui">
          Showing {filtered.length} of {posts.length} posts
        </p>
      )}
    </div>
  );
}
