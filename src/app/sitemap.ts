import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base   = siteConfig.url;
  const posts  = getAllPosts();
  const tags   = getAllTags();
  return [
    { url: base,           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: base+"/blog",   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: base+"/tags",   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: base+"/series", lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: base+"/about",  lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.frontmatter.updatedAt ?? p.frontmatter.date), changeFrequency: "monthly" as const, priority: p.frontmatter.featured ? 0.9 : 0.8 })),
    ...tags.map((t) => ({ url: `${base}/tags/${t.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
