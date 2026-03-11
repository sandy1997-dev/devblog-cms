import { Feed } from "feed";
import { getAllPosts } from "@/lib/mdx";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const posts = getAllPosts({ limit: 20 });
  const base  = siteConfig.url;

  const feed = new Feed({
    title: siteConfig.name, description: siteConfig.description,
    id: base + "/", link: base + "/", language: "en",
    favicon: base + "/favicon.ico",
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}`,
    updated: posts[0] ? new Date(posts[0].frontmatter.date) : new Date(),
    feedLinks: { rss: base + "/rss.xml" },
    author: { name: siteConfig.author.name, email: siteConfig.author.email, link: base },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.frontmatter.title,
      id:    base + "/blog/" + post.slug,
      link:  base + "/blog/" + post.slug,
      description: post.frontmatter.description,
      content: post.excerpt,
      author: [{ name: post.frontmatter.author, email: siteConfig.author.email, link: base }],
      date: new Date(post.frontmatter.date),
      category: post.frontmatter.tags.map((t) => ({ name: t })),
      // image intentionally omitted — prevents XML invalid URL errors
    });
  });

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600" },
  });
}
