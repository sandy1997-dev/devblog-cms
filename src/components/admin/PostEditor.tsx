"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  SaveIcon, EyeIcon, ArrowLeftIcon, LoaderIcon, PlusIcon,
  XIcon, ImageIcon, TagIcon, BookOpenIcon, InfoIcon, AlertTriangleIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PostFormData {
  title: string;
  description: string;
  date: string;
  updatedAt: string;
  author: string;
  authorBio: string;
  authorGithub: string;
  authorTwitter: string;
  image: string;
  imageAlt: string;
  tags: string[];
  series: string;
  seriesOrder: string;
  featured: boolean;
  draft: boolean;
  toc: boolean;
  content: string;
}

export const defaultFormData: PostFormData = {
  title:         "",
  description:   "",
  date:          new Date().toISOString().split("T")[0],
  updatedAt:     "",
  author:        "Sandeep Kumar Pati",
  authorBio:     "Full Stack Developer based in Pune, India. Passionate about TypeScript, React, and modern web development.",
  authorGithub:  "sandy1997-dev",
  authorTwitter: "@KumarSande7673",
  image:         "",
  imageAlt:      "",
  tags:          [],
  series:        "",
  seriesOrder:   "",
  featured:      false,
  draft:         false,
  toc:           true,
  content:       `## Introduction

Write your introduction here...

## Main Section

Add your content here. You can use:

- **Bold text** and *italic text*
- \`inline code\` and code blocks
- [Links](https://example.com)
- > Blockquotes

\`\`\`typescript
// Code example
const hello = "world";
console.log(hello);
\`\`\`

## Conclusion

Wrap up your post here.
`,
};

interface PostEditorProps {
  initialData?: Partial<PostFormData>;
  slug?: string;
  mode: "create" | "edit";
}

// Field wrapper with label + description
function Field({
  label, description, required, children, className,
}: {
  label: string; description?: string; required?: boolean;
  children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div>
        <label className="block text-sm font-ui font-semibold text-ink-800 dark:text-ink-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Input styles
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-sm text-ink-900 dark:text-ink-100 placeholder:text-ink-400 outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors";
const textareaCls = `${inputCls} resize-none`;

export default function PostEditor({ initialData, slug, mode }: PostEditorProps) {
  const router = useRouter();
  const [data,    setData]    = useState<PostFormData>({ ...defaultFormData, ...initialData });
  const [tagInput, setTagInput] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(false);

  const set = (field: keyof PostFormData, value: unknown) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !data.tags.includes(t)) {
      set("tags", [...data.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => set("tags", data.tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
  };

  const handleSave = async (asDraft = false) => {
    if (!data.title.trim())    { setError("Title is required"); return; }
    if (!data.description.trim()) { setError("Description is required"); return; }
    if (!data.date)            { setError("Date is required"); return; }
    if (!data.content.trim())  { setError("Content cannot be empty"); return; }

    setSaving(true);
    setError("");
    setSuccess("");

    const frontmatter = {
      title:         data.title,
      description:   data.description,
      date:          data.date,
      updatedAt:     mode === "edit" ? new Date().toISOString().split("T")[0] : data.updatedAt || undefined,
      author:        data.author,
      authorBio:     data.authorBio || undefined,
      authorGithub:  data.authorGithub || undefined,
      authorTwitter: data.authorTwitter || undefined,
      image:         data.image || undefined,
      imageAlt:      data.imageAlt || undefined,
      tags:          data.tags,
      series:        data.series || undefined,
      seriesOrder:   data.seriesOrder ? parseInt(data.seriesOrder) : undefined,
      featured:      data.featured,
      draft:         asDraft ? true : data.draft,
      toc:           data.toc,
    };

    if (mode === "create") {
      const rawSlug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: rawSlug, frontmatter, content: data.content }),
      });
      if (res.ok) {
        const { slug: newSlug } = await res.json();
        setSuccess("Post created successfully!");
        setTimeout(() => router.push(`/admin/posts/${newSlug}`), 800);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to create post");
      }
    } else {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontmatter, content: data.content }),
      });
      if (res.ok) {
        setSuccess("Post saved!");
        setTimeout(() => setSuccess(""), 2500);
      } else {
        setError("Failed to save post");
      }
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="btn-ghost p-2"><ArrowLeftIcon size={16} /></Link>
          <div>
            <h1 className="font-display text-xl font-bold text-ink-950 dark:text-ink-50">
              {mode === "create" ? "New Post" : "Edit Post"}
            </h1>
            {slug && <p className="text-xs text-ink-400 font-mono mt-0.5">/blog/{slug}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && slug && !data.draft && (
            <Link href={`/blog/${slug}`} target="_blank" className="btn-ghost gap-2 text-sm">
              <EyeIcon size={14} /> View Live
            </Link>
          )}
          <button onClick={() => handleSave(true)} disabled={saving}
            className="btn-outline gap-2 text-sm py-2">
            Save as Draft
          </button>
          <button onClick={() => handleSave(false)} disabled={saving}
            className="btn-primary gap-2 text-sm py-2">
            {saving ? <LoaderIcon size={14} className="animate-spin" /> : <SaveIcon size={14} />}
            {data.draft ? "Save Draft" : "Publish"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 px-4 py-3 rounded-xl">
          <AlertTriangleIcon size={15} className="shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-signal-700 dark:text-signal-400 bg-signal-50 dark:bg-signal-950/30 border border-signal-200 dark:border-signal-900/40 px-4 py-3 rounded-xl">
          ✓ {success}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* Left — main content */}
        <div className="space-y-5">

          {/* Title */}
          <Field label="Post Title" description="The headline. The URL slug is auto-generated from this — e.g. 'My First Post' → /blog/my-first-post" required>
            <input type="text" value={data.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Building a REST API with Node.js and MongoDB"
              className={cn(inputCls, "text-base font-display font-semibold")} />
            {data.title && (
              <p className="text-[11px] text-ink-400 font-mono mt-1">
                slug: /blog/{data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
              </p>
            )}
          </Field>

          {/* Description */}
          <Field label="Description / Excerpt"
            description="1–2 sentences summarising the post. Shown in cards, SEO meta tags, and RSS. Keep under 160 characters."
            required>
            <textarea rows={2} value={data.description} onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. A complete guide to building a production-ready REST API with authentication, validation, and deployment."
              className={textareaCls} />
            <p className="text-[11px] text-ink-400 mt-1">{data.description.length} / 160 chars</p>
          </Field>

          {/* Content editor */}
          <Field label="Content"
            description="Write in Markdown. Use ## for headings, **bold**, *italic*, `code`, ```language blocks```, > blockquotes, - lists."
            required>
            <div className="rounded-xl border border-ink-200 dark:border-ink-700 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 bg-ink-50 dark:bg-ink-900 border-b border-ink-200 dark:border-ink-700 flex-wrap">
                {[
                  { label: "H2", insert: "\n## " },
                  { label: "H3", insert: "\n### " },
                  { label: "B",  insert: "**text**" },
                  { label: "I",  insert: "*text*" },
                  { label: "<>", insert: "`code`" },
                  { label: "```",insert: "\n```typescript\n// code here\n```\n" },
                  { label: "→",  insert: "[link text](https://)" },
                  { label: "❝",  insert: "\n> " },
                  { label: "—",  insert: "\n---\n" },
                ].map((btn) => (
                  <button key={btn.label} type="button"
                    onClick={() => set("content", data.content + btn.insert)}
                    className="px-2 py-1 rounded text-xs font-mono text-ink-600 dark:text-ink-400 hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors">
                    {btn.label}
                  </button>
                ))}
                <button type="button" onClick={() => setPreview((v) => !v)}
                  className={cn("ml-auto px-3 py-1 rounded text-xs font-ui font-medium transition-colors",
                    preview ? "bg-amber-500 text-white" : "bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-400")}>
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>

              {preview ? (
                <div className="p-5 min-h-[400px] prose dark:prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdown(data.content) }} />
              ) : (
                <textarea
                  value={data.content}
                  onChange={(e) => set("content", e.target.value)}
                  rows={22}
                  className="w-full px-4 py-3.5 font-mono text-sm text-ink-900 dark:text-ink-100 bg-white dark:bg-ink-800 outline-none resize-y placeholder:text-ink-400"
                  placeholder="Write your post content in Markdown here…"
                  spellCheck
                />
              )}
            </div>
          </Field>
        </div>

        {/* Right — settings panel */}
        <div className="space-y-4">

          {/* Publish status */}
          <div className="card p-4 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Publish Settings</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-ui font-medium text-ink-800 dark:text-ink-200">Status</p>
                <p className="text-xs text-ink-400">{data.draft ? "Hidden — save to publish" : "Live on the blog"}</p>
              </div>
              <button onClick={() => set("draft", !data.draft)}
                className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  data.draft ? "bg-ink-300 dark:bg-ink-600" : "bg-signal-500")}>
                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  data.draft ? "translate-x-1" : "translate-x-6")} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-ui font-medium text-ink-800 dark:text-ink-200">Featured</p>
                <p className="text-xs text-ink-400">Show in hero section</p>
              </div>
              <button onClick={() => set("featured", !data.featured)}
                className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  data.featured ? "bg-amber-500" : "bg-ink-300 dark:bg-ink-600")}>
                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  data.featured ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-ui font-medium text-ink-800 dark:text-ink-200">Table of Contents</p>
                <p className="text-xs text-ink-400">Show sidebar TOC</p>
              </div>
              <button onClick={() => set("toc", !data.toc)}
                className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  data.toc ? "bg-amber-500" : "bg-ink-300 dark:bg-ink-600")}>
                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  data.toc ? "translate-x-6" : "translate-x-1")} />
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="card p-4 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Dates</h3>
            <Field label="Publish Date" required>
              <input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
            </Field>
            {mode === "edit" && (
              <Field label="Last Updated" description="Leave blank — auto-fills on save">
                <input type="date" value={data.updatedAt} onChange={(e) => set("updatedAt", e.target.value)} className={inputCls} />
              </Field>
            )}
          </div>

          {/* Cover Image */}
          <div className="card p-4 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 flex items-center gap-2">
              <ImageIcon size={12} /> Cover Image
            </h3>

            {/* Image preview */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-ink-200 dark:border-ink-700 bg-ink-100 dark:bg-ink-800">
              {data.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.image} alt={data.imageAlt || "Cover"} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-ink-300 dark:text-ink-600 gap-2">
                  <ImageIcon size={28} />
                  <p className="text-xs font-ui">No image — gradient placeholder used</p>
                </div>
              )}
            </div>

            <Field label="Image URL"
              description={"Paste any image URL:\n• Unsplash: https://images.unsplash.com/photo-ID?w=1200&h=630&fit=crop\n• Imgur: https://i.imgur.com/ID.jpg\n• Any direct .jpg / .png URL"}>
              <input type="url" value={data.image} onChange={(e) => set("image", e.target.value)}
                placeholder="https://images.unsplash.com/photo-…"
                className={inputCls} />
            </Field>

            <Field label="Image Alt Text"
              description="Describe the image for accessibility + SEO">
              <input type="text" value={data.imageAlt} onChange={(e) => set("imageAlt", e.target.value)}
                placeholder="e.g. Code editor with TypeScript open"
                className={inputCls} />
            </Field>
          </div>

          {/* Tags */}
          <div className="card p-4 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 flex items-center gap-2">
              <TagIcon size={12} /> Tags
            </h3>
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {data.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs font-ui bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                    <XIcon size={10} />
                  </button>
                </span>
              ))}
              {data.tags.length === 0 && (
                <p className="text-xs text-ink-400">No tags yet — add below</p>
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="TypeScript, React, Node.js…"
                className={cn(inputCls, "flex-1")} />
              <button onClick={addTag} className="btn-outline px-3 py-2" title="Add tag">
                <PlusIcon size={14} />
              </button>
            </div>
            <p className="text-[10px] text-ink-400">Press Enter or comma to add</p>
          </div>

          {/* Series */}
          <div className="card p-4 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 flex items-center gap-2">
              <BookOpenIcon size={12} /> Series (Optional)
            </h3>
            <Field label="Series Name"
              description="Group related posts — e.g. 'TypeScript Mastery'. Leave blank for standalone.">
              <input type="text" value={data.series} onChange={(e) => set("series", e.target.value)}
                placeholder="e.g. TypeScript Mastery"
                className={inputCls} />
            </Field>
            {data.series && (
              <Field label="Position in Series"
                description="1 = first, 2 = second, etc.">
                <input type="number" min={1} value={data.seriesOrder}
                  onChange={(e) => set("seriesOrder", e.target.value)}
                  placeholder="1"
                  className={inputCls} />
              </Field>
            )}
          </div>

          {/* Author */}
          <div className="card p-4 space-y-3">
            <h3 className="font-ui text-xs font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Author</h3>
            <Field label="Author Name" required>
              <input type="text" value={data.author} onChange={(e) => set("author", e.target.value)}
                placeholder="Sandeep Kumar Pati"
                className={inputCls} />
            </Field>
            <Field label="Author Bio"
              description="Short bio shown at the bottom of the post">
              <textarea rows={2} value={data.authorBio} onChange={(e) => set("authorBio", e.target.value)}
                placeholder="Full Stack Developer based in Pune, India…"
                className={textareaCls} />
            </Field>
            <Field label="GitHub Username"
              description="Just the username, no URL">
              <input type="text" value={data.authorGithub} onChange={(e) => set("authorGithub", e.target.value)}
                placeholder="sandy1997-dev"
                className={inputCls} />
            </Field>
            <Field label="Twitter / X Handle">
              <input type="text" value={data.authorTwitter} onChange={(e) => set("authorTwitter", e.target.value)}
                placeholder="@KumarSande7673"
                className={inputCls} />
            </Field>
          </div>

          {/* Info */}
          <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-4">
            <div className="flex items-start gap-2">
              <InfoIcon size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                Posts are saved as <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">.mdx</code> files in <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">content/posts/</code>.
                Published posts appear on the blog immediately. Drafts are hidden in production.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple markdown to HTML for preview only (not for rendering posts)
function simpleMarkdown(md: string): string {
  return md
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```[\s\S]*?```/g, (m) => `<pre class="bg-ink-900 text-ink-100 rounded-lg p-4 text-xs overflow-x-auto"><code>${m.replace(/```\w*\n?/g, "")}</code></pre>`)
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Fix applied here: replaced .* with [\s\S]* and removed the 's' flag
    .replace(/(<li>[\s\S]*<\/li>)/g, "<ul>$1</ul>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|b|p|u|o|l|c|a])/gm, "<p>")
    .replace(/$/gm, "</p>");
}