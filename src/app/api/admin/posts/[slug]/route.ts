import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin-auth";
import { parsePost } from "@/lib/mdx";
import { buildMDXFile } from "../route";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

function getFilePath(slug: string): string | null {
  const mdx = path.join(CONTENT_DIR, `${slug}.mdx`);
  const md  = path.join(CONTENT_DIR, `${slug}.md`);
  if (fs.existsSync(mdx)) return mdx;
  if (fs.existsSync(md))  return md;
  return null;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const post = parsePost(params.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ frontmatter: post.frontmatter, content: post.content, slug: post.slug });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const filePath = getFilePath(params.slug);
  if (!filePath) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { frontmatter, content } = await req.json();
  const fileContent = buildMDXFile(frontmatter, content || "");
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const filePath = getFilePath(params.slug);
  if (!filePath) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  fs.unlinkSync(filePath);
  return NextResponse.json({ success: true });
}
