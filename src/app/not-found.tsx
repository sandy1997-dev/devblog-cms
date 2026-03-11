import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-6 animate-fade-up">
        <p className="font-mono text-8xl font-bold text-ink-100 dark:text-ink-800 select-none">404</p>
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">Page not found</h1>
        <p className="text-ink-500 dark:text-ink-400 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="btn-primary gap-2"><ArrowLeftIcon size={15} /> Go home</Link>
          <Link href="/blog" className="btn-outline">Browse blog</Link>
        </div>
      </div>
    </div>
  );
}
