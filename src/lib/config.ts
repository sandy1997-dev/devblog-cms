import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "DevBlog",
  title: "DevBlog — Sandeep Kumar Pati",
  description: "In-depth articles on software engineering, system design, TypeScript, React, and modern web development. Real-world patterns for real-world code.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-default.png",
  author: {
    name:    process.env.NEXT_PUBLIC_AUTHOR_NAME    || "Sandeep Kumar Pati",
    email:   process.env.NEXT_PUBLIC_AUTHOR_EMAIL   || "sandeepkumar.pati1997@gmail.com",
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@KumarSande7673",
    github:  process.env.NEXT_PUBLIC_GITHUB_USERNAME || "sandy1997-dev",
  },
  links: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/KumarSande7673",
    github:  process.env.NEXT_PUBLIC_GITHUB_URL  || "https://github.com/sandy1997-dev",
    rss: "/rss.xml",
  },
};
