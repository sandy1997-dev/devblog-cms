export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updatedAt?: string;
  author: string;
  authorImage?: string;
  authorBio?: string;
  authorGithub?: string;
  authorTwitter?: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  image?: string;
  imageAlt?: string;
  draft?: boolean;
  featured?: boolean;
  toc?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
  wordCount: number;
  headings: Heading[];
  excerpt: string;
}

export interface Heading { id: string; text: string; level: number; }
export interface TagInfo  { name: string; slug: string; count: number; }
export interface SeriesInfo { name: string; posts: { slug: string; title: string; order: number }[]; }

export interface SiteConfig {
  name: string; title: string; description: string; url: string;
  ogImage: string;
  author: { name: string; email: string; twitter: string; github: string };
  links: { twitter: string; github: string; rss: string };
}

export interface SearchResult {
  slug: string; title: string; description: string; tags: string[]; date: string;
}
