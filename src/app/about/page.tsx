import type { Metadata } from "next";
import Link from "next/link";
import { GithubIcon, TwitterIcon, MailIcon, RssIcon, CodeIcon, BriefcaseIcon, AwardIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({ title: "About", description: `About ${siteConfig.author.name} — Full Stack Developer.` });

const skills = [
  { category: "Frontend",  items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend",   items: ["Node.js", "Express", "GraphQL", "REST APIs", "MongoDB", "PostgreSQL"] },
  { category: "DevOps",    items: ["Vercel", "Render", "Docker", "GitHub Actions", "CI/CD"] },
  { category: "Tooling",   items: ["Git", "VS Code", "Prisma", "Figma", "Linear"] },
];

const timeline = [
  { year: "2026", title: "Senior Full Stack Developer", company: "Pune, India", description: "Building scalable web applications with React, Next.js, and Node.js. Leading frontend architecture and mentoring junior developers." },
  { year: "2024", title: "Full Stack Developer", company: "Previous Role", description: "Developed multiple production applications. Introduced TypeScript and improved code quality across the team." },
  { year: "2022", title: "Frontend Developer", company: "Earlier Role", description: "Focused on React development, reusable component libraries, and performance optimization." },
  { year: "2020", title: "Started Professional Development", company: "", description: "Began career in web development with JavaScript, HTML, CSS, and React." },
];

export default function AboutPage() {
  const posts = getAllPosts();
  const tags  = getAllTags();

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="border-b border-ink-200/60 dark:border-ink-800/60 bg-ink-50/30 dark:bg-ink-900/20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 items-start max-w-3xl">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700 flex items-center justify-center text-6xl font-display font-black text-white shadow-xl shadow-amber-500/20 shrink-0 select-none">S</div>
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">Full Stack Developer & Technical Writer</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-950 dark:text-ink-50 leading-none mb-4">{siteConfig.author.name}</h1>
              <p className="text-lg text-ink-500 dark:text-ink-400 leading-relaxed mb-6 max-w-xl">I build modern web applications and write about what I learn — focusing on TypeScript, React, system design, and developer experience.</p>
              <div className="flex flex-wrap items-center gap-2">
                <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2"><GithubIcon size={15} /> GitHub</a>
                <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="btn-outline gap-2"><TwitterIcon size={15} /> Twitter / X</a>
                <a href={`mailto:${siteConfig.author.email}`} className="btn-outline gap-2"><MailIcon size={15} /> Email</a>
                <Link href="/rss.xml" className="btn-outline gap-2 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/50"><RssIcon size={15} /> RSS</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16">
          <div className="space-y-16">
            {/* Bio */}
            <section>
              <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-50 mb-6 flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center"><CodeIcon size={16} className="text-amber-600 dark:text-amber-400" /></span>
                About Me
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>Hey! I&apos;m Sandeep — a Full Stack Developer based in Pune, India. I&apos;m passionate about building high-quality web applications that are fast, accessible, and maintainable.</p>
                <p>This blog is where I document everything I learn. I believe in learning in public — writing helps me think clearly, and hopefully helps other developers too.</p>
                <p>I specialize in the JavaScript/TypeScript ecosystem: React and Next.js on the frontend, Node.js on the backend, and everything in between. I care deeply about developer experience, code quality, and shipping things that actually work.</p>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-50 mb-6 flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-signal-100 dark:bg-signal-950/40 flex items-center justify-center"><AwardIcon size={16} className="text-signal-600 dark:text-signal-400" /></span>
                Skills & Technologies
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map((g) => (
                  <div key={g.category} className="card p-5">
                    <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3">{g.category}</h3>
                    <div className="flex flex-wrap gap-2">{g.items.map((s) => <span key={s} className="tag-pill">{s}</span>)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-50 mb-6 flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center"><BriefcaseIcon size={16} className="text-blue-600 dark:text-blue-400" /></span>
                Career Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-ink-200 dark:bg-ink-800" />
                <div className="space-y-8">
                  {timeline.map((item, i) => (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 flex items-center justify-center">
                        <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400">{item.year.slice(2)}</span>
                      </div>
                      <div className="card p-5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-ui font-semibold text-ink-900 dark:text-ink-100">{item.title}</h3>
                            {item.company && <p className="text-sm text-amber-600 dark:text-amber-400 font-ui">{item.company}</p>}
                          </div>
                          <span className="font-mono text-sm text-ink-400 shrink-0">{item.year}</span>
                        </div>
                        <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="card p-5">
              <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-400 mb-4">By the numbers</h3>
              <div className="space-y-4">
                {[{ label: "Articles published", value: posts.length }, { label: "Topics covered", value: tags.length }, { label: "Years coding", value: new Date().getFullYear() - 2020 }].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-sm text-ink-500 dark:text-ink-400">{s.label}</span>
                    <span className="font-display font-bold text-2xl text-amber-600 dark:text-amber-400">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-400 mb-4">Get in touch</h3>
              <div className="space-y-2.5">
                <a href={`mailto:${siteConfig.author.email}`} className="flex items-center gap-2.5 text-sm text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors truncate">
                  <MailIcon size={14} className="text-ink-400 shrink-0" />{siteConfig.author.email}
                </a>
                <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                  <GithubIcon size={14} className="text-ink-400 shrink-0" />github.com/{siteConfig.author.github}
                </a>
                <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">
                  <TwitterIcon size={14} className="text-ink-400 shrink-0" />{siteConfig.author.twitter}
                </a>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-400 mb-4">I write about</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 10).map((tag) => (
                  <Link key={tag.slug} href={`/tags/${tag.slug}`} className="tag-pill">{tag.name}<span className="font-mono text-[10px] ml-1 text-ink-400">{tag.count}</span></Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
