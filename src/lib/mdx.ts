import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter, Heading, TagInfo, SeriesInfo } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

export function parsePost(slug: string): Post | null {
  const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const mdPath  = path.join(CONTENT_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: { ...fm, tags: fm.tags ?? [], draft: fm.draft ?? false, featured: fm.featured ?? false, toc: fm.toc ?? true },
    content,
    readingTime: stats.text,
    wordCount: stats.words,
    headings: extractHeadings(content),
    excerpt: extractExcerpt(content),
  };
}

export function getAllPosts(opts?: { includeDrafts?: boolean; tag?: string; series?: string; limit?: number }): Post[] {
  const { includeDrafts = false, tag, series, limit } = opts ?? {};
  const posts = getPostSlugs()
    .map(parsePost)
    .filter((p): p is Post => {
      if (!p) return false;
      if (!includeDrafts && p.frontmatter.draft) return false;
      if (tag && !p.frontmatter.tags.includes(tag)) return false;
      if (series && p.frontmatter.series !== series) return false;
      return true;
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  return limit ? posts.slice(0, limit) : posts;
}

export function getFeaturedPosts(count = 3): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.featured).slice(0, count);
}

export function getRelatedPosts(current: Post, count = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      post: p,
      score: p.frontmatter.tags.filter((t) => current.frontmatter.tags.includes(t)).length
            + (p.frontmatter.series === current.frontmatter.series && p.frontmatter.series ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.post);
}

export function getAllTags(): TagInfo[] {
  const map = new Map<string, number>();
  getAllPosts().forEach((p) => p.frontmatter.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, slug: slugifyTag(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function getAllSeries(): SeriesInfo[] {
  const map = new Map<string, { slug: string; title: string; order: number }[]>();
  getAllPosts().forEach((p) => {
    if (!p.frontmatter.series) return;
    const arr = map.get(p.frontmatter.series) ?? [];
    arr.push({ slug: p.slug, title: p.frontmatter.title, order: p.frontmatter.seriesOrder ?? 999 });
    map.set(p.frontmatter.series, arr);
  });
  return Array.from(map.entries()).map(([name, posts]) => ({ name, posts: posts.sort((a, b) => a.order - b.order) }));
}

export function getSeriesForPost(post: Post): SeriesInfo | null {
  if (!post.frontmatter.series) return null;
  return getAllSeries().find((s) => s.name === post.frontmatter.series) ?? null;
}

export function getSearchIndex() {
  return getAllPosts().map((p) => ({
    slug: p.slug, title: p.frontmatter.title,
    description: p.frontmatter.description,
    tags: p.frontmatter.tags, date: p.frontmatter.date,
    content: p.excerpt,
  }));
}

function extractHeadings(content: string): Heading[] {
  const regex = /^(#{1,4})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    const text = m[2].replace(/\*\*/g, "").replace(/`/g, "");
    headings.push({ level: m[1].length, text, id: text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") });
  }
  return headings;
}

function extractExcerpt(content: string, max = 200): string {
  const clean = content.replace(/```[\s\S]*?```/g, "").replace(/[#*`>\[\]!]/g, "").replace(/\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}
