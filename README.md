# DevBlog CMS

> A production-ready headless Developer Blog built with **Next.js 14**, **MDX**, **Tailwind CSS**, and **Shiki** syntax highlighting. Zero database required — your content lives in `.mdx` files, deployed instantly on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/devblog-cms)

---

## ✨ Features

| Feature | Details |
|---|---|
| **MDX Content** | Full MDX support — use React components inside markdown |
| **Syntax Highlighting** | Shiki with `one-dark-pro` (dark) + `github-light` (light) themes |
| **Dark / Light Mode** | System-aware, persisted, no flash |
| **SEO** | Metadata API, OpenGraph, Twitter Cards, JSON-LD structured data |
| **RSS Feed** | Auto-generated at `/rss.xml` |
| **Sitemap** | Auto-generated at `/sitemap.xml` |
| **Search** | Client-side Fuse.js fuzzy search with keyboard navigation (`⌘K`) |
| **Reading Progress** | Scroll-based progress bar on posts |
| **Table of Contents** | Scroll-spy TOC with active heading tracking |
| **Series** | Group related posts into ordered series |
| **Tags** | Tag-based filtering and browsing |
| **OG Images** | Dynamic Edge-generated OG images per post |
| **Related Posts** | Smart related posts based on tags and series |
| **Prev/Next Navigation** | Navigate between posts chronologically |
| **Reading Time** | Estimated reading time per post |
| **GitHub Actions** | CI/CD pipeline for Vercel deployment |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/devblog-cms.git
cd devblog-cms
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_AUTHOR_NAME="Your Name"
NEXT_PUBLIC_AUTHOR_EMAIL=you@example.com
NEXT_PUBLIC_TWITTER_HANDLE=@yourhandle
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/yourhandle
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✍️ Writing Posts

### Create a new post

Create a `.mdx` file in `content/posts/`:

```bash
touch content/posts/my-first-post.mdx
```

### Frontmatter reference

```yaml
---
title: "Your Post Title"
description: "A compelling one-sentence description for SEO and previews."
date: "2026-03-01"          # ISO 8601 date
updatedAt: "2026-03-15"     # Optional: last updated date
author: "Your Name"
authorBio: "Short bio shown in author card"
authorGithub: "yourusername"
authorTwitter: "@yourhandle"
tags: ["TypeScript", "React", "Performance"]
featured: false             # Show in hero section
toc: true                   # Show table of contents sidebar
draft: false                # Set true to hide from production
series: "TypeScript Mastery"   # Optional: series name
seriesOrder: 1                 # Required if series is set
image: "https://..."           # Optional: cover image URL
imageAlt: "Image description"  # Required if image is set
---
```

### MDX Components Available in Posts

```mdx
<Callout type="info" title="Optional Title">
  Informational note. Types: info | warning | tip | danger
</Callout>

<ImageWithCaption
  src="/images/diagram.png"
  alt="System diagram"
  caption="Optional caption text"
/>

<Steps>
  <Step title="First step">Do this first.</Step>
  <Step title="Second step">Then do this.</Step>
</Steps>

<Tabs tabs={[
  { label: "TypeScript", content: <p>TS content</p> },
  { label: "JavaScript", content: <p>JS content</p> },
]} />
```

### Code Blocks with Titles

````mdx
```typescript
// title: "Optional file name / title"
// highlight: {2,3}  — highlight lines 2 and 3
const hello = "world";
```
````

---

## 🌐 Deploying to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables from `.env.example`
5. Click **Deploy**

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel                # Preview deploy
vercel --prod         # Production deploy
```

### GitHub Actions CI/CD

Add these secrets to your GitHub repository (`Settings → Secrets → Actions`):

| Secret | How to get it |
|---|---|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL |
| `NEXT_PUBLIC_AUTHOR_NAME` | Your name |
| `NEXT_PUBLIC_AUTHOR_EMAIL` | Your email |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Your Twitter handle |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Your GitHub username |

After setup, every push to `main` triggers an automatic deploy.

---

## 🗂 Project Structure

```
devblog-cms/
├── content/
│   └── posts/               # Your .mdx blog posts
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (fonts, theme, header/footer)
│   │   ├── page.tsx          # Homepage
│   │   ├── globals.css       # Design tokens + Tailwind
│   │   ├── blog/
│   │   │   ├── page.tsx      # Post listing
│   │   │   └── [slug]/       # Individual post
│   │   ├── tags/             # Tag browsing
│   │   ├── series/           # Series listing
│   │   ├── about/            # About page
│   │   ├── rss.xml/          # RSS feed
│   │   ├── sitemap.ts        # Auto sitemap
│   │   ├── robots.ts         # robots.txt
│   │   └── api/
│   │       ├── search/       # Search index endpoint
│   │       └── og/           # Dynamic OG image generation
│   ├── components/
│   │   ├── layout/           # Header, Footer
│   │   ├── blog/             # TOC, ReadingProgress, ShareButtons
│   │   ├── mdx/              # MDX custom components (CodeBlock, Callout, etc.)
│   │   └── ui/               # ThemeToggle, SearchModal
│   ├── lib/
│   │   ├── mdx.ts            # Content parsing and queries
│   │   ├── seo.ts            # Metadata generation
│   │   ├── config.ts         # Site configuration
│   │   └── utils.ts          # Utilities
│   └── types/
│       └── index.ts          # TypeScript types
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions CI/CD
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── vercel.json
└── tsconfig.json
```

---

## 🎨 Customization

### Fonts

Edit `src/app/layout.tsx` to change fonts. The project uses:
- **Fraunces** — Display/headings (distinctive serif)
- **Lora** — Body text (readable serif)
- **Syne** — UI elements (geometric sans)
- **JetBrains Mono** — Code

### Colors

Edit `tailwind.config.ts` → `theme.extend.colors`. The palette uses:
- `ink` — Main text/surface neutrals
- `amber` — Brand/accent color
- `signal` — Success/series color
- `canvas` — Background shades

### Site Config

Edit `src/lib/config.ts` or use environment variables.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `next-mdx-remote` | MDX processing in the App Router |
| `rehype-pretty-code` | Syntax highlighting (Shiki-powered) |
| `gray-matter` | YAML frontmatter parsing |
| `reading-time` | Reading time estimation |
| `fuse.js` | Fuzzy search |
| `feed` | RSS/Atom feed generation |
| `next-themes` | Dark/light mode without flash |
| `framer-motion` | Animations |
| `date-fns` | Date formatting |
| `lucide-react` | Icons |

---

## 📄 License

MIT — use this for personal or commercial projects.
