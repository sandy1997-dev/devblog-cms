import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/mdx";
import { buildMDXFile } from "@/lib/build-mdx";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const posts = getAllPosts({ includeDrafts: true });
  return NextResponse.json(posts.map((p) => ({
    slug: p.slug, title: p.frontmatter.title, description: p.frontmatter.description,
    date: p.frontmatter.date, tags: p.frontmatter.tags, draft: p.frontmatter.draft,
    featured: p.frontmatter.featured, image: p.frontmatter.image,
    readingTime: p.readingTime, series: p.frontmatter.series,
  })));
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;
  const { slug, frontmatter, content } = await req.json();
  if (!slug || !frontmatter.title) {
    return NextResponse.json({ error: "slug and title required" }, { status: 400 });
  }
  const finalSlug = slug || frontmatter.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const filePath  = path.join(CONTENT_DIR, `${finalSlug}.mdx`);
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post with this slug already exists" }, { status: 409 });
  }
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(filePath, buildMDXFile(frontmatter, content || ""), "utf-8");
  return NextResponse.json({ success: true, slug: finalSlug });
}