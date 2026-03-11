"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboardIcon, PenLineIcon, ArrowLeftIcon, LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  // Don't show nav on login page
  if (pathname === "/admin") return <>{children}</>;

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-canvas-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-ink-900 border-b border-ink-200 dark:border-ink-800 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-900 dark:bg-amber-500">
              <span className="font-display font-black text-xs text-white dark:text-ink-950">D</span>
            </div>
            <span className="font-ui font-bold text-sm text-ink-900 dark:text-ink-100">DevBlog Admin</span>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/admin/dashboard"
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui font-medium transition-colors",
                pathname === "/admin/dashboard"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                  : "text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800")}>
              <LayoutDashboardIcon size={14} /> Dashboard
            </Link>
            <Link href="/admin/posts/new"
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui font-medium transition-colors",
                pathname === "/admin/posts/new"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                  : "text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800")}>
              <PenLineIcon size={14} /> New Post
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank"
              className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors font-ui">
              <ArrowLeftIcon size={12} /> View Blog
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors font-ui px-2 py-1">
              <LogOutIcon size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
