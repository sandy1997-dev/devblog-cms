import Link from "next/link";
import { GithubIcon, TwitterIcon, RssIcon } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200/60 dark:border-ink-800/60">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 dark:bg-amber-500">
                <span className="font-display font-black text-sm text-white dark:text-ink-950">D</span>
              </div>
              <span className="font-display font-bold text-lg">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed max-w-xs">{siteConfig.description}</p>
            <div className="flex items-center gap-2">
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2"><GithubIcon size={17} /></a>
              <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="btn-ghost p-2"><TwitterIcon size={17} /></a>
              <a href="/rss.xml" className="btn-ghost p-2 text-amber-600 dark:text-amber-500"><RssIcon size={17} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-4">Writing</h3>
            <ul className="space-y-2.5">
              {[{ href: "/blog", label: "All Posts" }, { href: "/series", label: "Series" }, { href: "/tags", label: "Topics" }, { href: "/rss.xml", label: "RSS Feed" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-ui text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-4">Site</h3>
            <ul className="space-y-2.5">
              {[{ href: "/about", label: "About" }, { href: "/sitemap.xml", label: "Sitemap" }].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-200/60 dark:border-ink-800/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400 dark:text-ink-500">
          <p>© {new Date().getFullYear()} {siteConfig.author.name}. All rights reserved.</p>
          <p className="font-mono">Built with <a href="https://nextjs.org" target="_blank" className="text-amber-600 hover:underline">Next.js</a> & <a href="https://tailwindcss.com" target="_blank" className="text-amber-600 hover:underline">Tailwind</a></p>
        </div>
      </div>
    </footer>
  );
}
