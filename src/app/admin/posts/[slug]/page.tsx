"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import PostEditor, { PostFormData } from "@/components/admin/PostEditor";

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [data,    setData]    = useState<Partial<PostFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    fetch(`/api/admin/posts/${params.slug}`)
      .then((r) => {
        if (r.status === 401) { router.push("/admin"); return null; }
        if (!r.ok) { setError("Post not found"); return null; }
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        const fm = json.frontmatter;
        setData({
          title:         fm.title         || "",
          description:   fm.description   || "",
          date:          fm.date          || "",
          updatedAt:     fm.updatedAt     || "",
          author:        fm.author        || "Sandeep Kumar Pati",
          authorBio:     fm.authorBio     || "",
          authorGithub:  fm.authorGithub  || "sandy1997-dev",
          authorTwitter: fm.authorTwitter || "@KumarSande7673",
          image:         fm.image         || "",
          imageAlt:      fm.imageAlt      || "",
          tags:          fm.tags          || [],
          series:        fm.series        || "",
          seriesOrder:   fm.seriesOrder ? String(fm.seriesOrder) : "",
          featured:      fm.featured      || false,
          draft:         fm.draft         || false,
          toc:           fm.toc !== false,
          content:       json.content     || "",
        });
        setLoading(false);
      })
      .catch(() => setError("Failed to load post"));
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-ink-400">
        <LoaderIcon size={18} className="animate-spin" /> Loading post…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 dark:text-red-400 font-ui mb-3">{error}</p>
        <button onClick={() => router.push("/admin/dashboard")} className="btn-primary">← Back to Dashboard</button>
      </div>
    );
  }

  return <PostEditor mode="edit" slug={params.slug} initialData={data!} />;
}
