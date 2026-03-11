"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon, RssIcon, GithubIcon, MenuIcon, XIcon, LayoutDashboardIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchModal } from "@/components/ui/SearchModal";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

const NAV = [
  { href: "/blog",   label: "Writing" },
  { href: "/series", label: "Series"  },
  { href: "/tags",   label: "Topics"  },
  { href: "/about",  label: "About"   },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-canvas-light/90 dark:bg-canvas-dark/90 backdrop-blur-md border-b border-ink-200/60 dark:border-ink-800/60 shadow-sm" : "bg-transparent")}>
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 dark:bg-amber-500 transition-colors group-hover:bg-ink-700 dark:group-hover:bg-amber-400">
              <span className="font-display font-black text-sm text-white dark:text-ink-950">D</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block">{siteConfig.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}
                  className={cn("relative px-3.5 py-2 text-sm font-ui font-medium rounded-lg transition-colors",
                    isActive ? "text-amber-700 dark:text-amber-400"
                             : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100/60 dark:hover:bg-ink-800/60")}>
                  {link.label}
                  {isActive && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-amber-500 rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="btn-ghost gap-2 hidden sm:flex" aria-label="Search">
              <SearchIcon size={16} />
              <kbd className="hidden lg:flex h-5 items-center rounded border border-ink-200 dark:border-ink-700 bg-ink-100 dark:bg-ink-800 px-1.5 text-[10px] font-mono text-ink-500">⌘K</kbd>
            </button>
            <button onClick={() => setSearchOpen(true)} className="btn-ghost sm:hidden"><SearchIcon size={18} /></button>

            <ThemeToggle />

            <Link href="/admin" className={cn("btn-ghost hidden sm:flex gap-1.5 text-xs font-ui font-semibold",
              pathname.startsWith("/admin") ? "text-signal-600 dark:text-signal-400" : "text-ink-500 dark:text-ink-400")}
              title="Admin Panel">
              <LayoutDashboardIcon size={16} />
              <span className="hidden lg:block">Admin</span>
            </Link>

            <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost hidden sm:flex"><GithubIcon size={17} /></Link>
            <Link href="/rss.xml" target="_blank" className="btn-ghost hidden sm:flex text-amber-600 dark:text-amber-500"><RssIcon size={17} /></Link>

            <button onClick={() => setMenuOpen((v) => !v)} className="btn-ghost md:hidden ml-1">
              {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-ink-200 dark:border-ink-800 bg-canvas-light dark:bg-canvas-dark animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {NAV.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn("block px-4 py-2.5 rounded-xl text-sm font-ui font-medium transition-colors",
                    pathname.startsWith(link.href) ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                                                   : "text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800")}>
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="block px-4 py-2.5 rounded-xl text-sm font-ui font-medium text-signal-700 dark:text-signal-400 hover:bg-signal-50 dark:hover:bg-signal-950/20 transition-colors">
                ⚡ Admin Panel
              </Link>
            </div>
          </nav>
        )}
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
