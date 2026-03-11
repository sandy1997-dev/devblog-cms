import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

interface SEOProps {
  title?: string; description?: string; image?: string; canonical?: string;
  noIndex?: boolean; type?: "website" | "article";
  publishedAt?: string; updatedAt?: string; tags?: string[]; author?: string;
}

export function generateMetadata(props: SEOProps = {}): Metadata {
  const { title, description = siteConfig.description, image = siteConfig.ogImage,
          canonical, noIndex = false, type = "website",
          publishedAt, updatedAt, tags = [], author = siteConfig.author.name } = props;

  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  const fullImage = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    title: fullTitle, description,
    authors: [{ name: author }],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical ?? undefined,
      types: { "application/rss+xml": [{ url: "/rss.xml", title: `${siteConfig.name} RSS` }] },
    },
    openGraph: {
      type, locale: "en_US", url: canonical ?? siteConfig.url,
      siteName: siteConfig.name, title: fullTitle, description,
      images: [{ url: fullImage, width: 1200, height: 630, alt: fullTitle }],
      ...(type === "article" && { publishedTime: publishedAt, modifiedTime: updatedAt ?? publishedAt, authors: [author], tags }),
    },
    twitter: {
      card: "summary_large_image", site: siteConfig.author.twitter,
      creator: siteConfig.author.twitter, title: fullTitle, description, images: [fullImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function generateStructuredData(post: {
  title: string; description: string; date: string; updatedAt?: string;
  author: string; slug: string; readingTime?: string; tags?: string[];
}) {
  return {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.description,
    datePublished: post.date, dateModified: post.updatedAt ?? post.date,
    author: { "@type": "Person", name: post.author, url: `${siteConfig.url}/about` },
    publisher: { "@type": "Organization", name: siteConfig.name },
    url: `${siteConfig.url}/blog/${post.slug}`,
    keywords: post.tags?.join(", "),
    timeRequired: post.readingTime,
  };
}
