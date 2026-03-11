import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/mdx";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const posts = getAllPosts({ includeDrafts: true });
  return NextResponse.json(posts.map((p) => ({
    slug:        p.slug,
    title:       p.frontmatter.title,
    description: p.frontmatter.description,
    date:        p.frontmatter.date,
    tags:        p.frontmatter.tags,
    draft:       p.frontmatter.draft,
    featured:    p.frontmatter.featured,
    image:       p.frontmatter.image,
    readingTime: p.readingTime,
    series:      p.frontmatter.series,
  })));
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const body = await req.json();
  const { slug, frontmatter, content } = body;

  if (!slug || !frontmatter.title) {
    return NextResponse.json({ error: "slug and title required" }, { status: 400 });
  }

  // Build the slug from title if not provided
  const finalSlug = slug || frontmatter.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const filePath  = path.join(CONTENT_DIR, `${finalSlug}.mdx`);

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post with this slug already exists" }, { status: 409 });
  }

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const fileContent = buildMDXFile(frontmatter, content || "");
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return NextResponse.json({ success: true, slug: finalSlug });
}

export function buildMDXFile(fm: Record<string, unknown>, content: string): string {
  const lines = ["---"];

  const addField = (key: string, val: unknown) => {
    if (val === undefined || val === null || val === "") return;
    if (typeof val === "string")  lines.push(`${key}: "${val.replace(/"/g, "'")}"`);
    else if (typeof val === "boolean") lines.push(`${key}: ${val}`);
    else if (typeof val === "number")  lines.push(`${key}: ${val}`);
    else if (Array.isArray(val) && val.length > 0) {
      lines.push(`${key}:`);
      val.forEach((v) => lines.push(`  - "${String(v).replace(/"/g, "'")}"`));
    }
  };

  addField("title",         fm.title);
  addField("description",   fm.description);
  addField("date",          fm.date);
  addField("updatedAt",     fm.updatedAt);
  addField("author",        fm.author);
  addField("authorBio",     fm.authorBio);
  addField("authorGithub",  fm.authorGithub);
  addField("authorTwitter", fm.authorTwitter);
  addField("tags",          fm.tags);
  addField("series",        fm.series);
  addField("seriesOrder",   fm.seriesOrder);
  addField("image",         fm.image);
  addField("imageAlt",      fm.imageAlt);
  addField("featured",      fm.featured);
  addField("draft",         fm.draft);
  addField("toc",           fm.toc);

  lines.push("---");
  lines.push("");
  lines.push(content);

  return lines.join("\n");
}
