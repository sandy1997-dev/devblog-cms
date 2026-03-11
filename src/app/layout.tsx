import type { Metadata, Viewport } from "next";
import { Fraunces, Lora, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const fraunces    = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz","SOFT","WONK"] });
const lora        = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const syne        = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const jetbrains   = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  openGraph: { type: "website", locale: "en_US", url: siteConfig.url, siteName: siteConfig.name, title: siteConfig.title, description: siteConfig.description },
  twitter: { card: "summary_large_image", site: siteConfig.author.twitter, creator: siteConfig.author.twitter },
  robots: { index: true, follow: true },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#faf8f5" }, { media: "(prefers-color-scheme: dark)", color: "#0e0d0b" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${fraunces.variable} ${lora.variable} ${syne.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-ink-900 dark:text-ink-100 font-body antialiased selection:bg-amber-200 dark:selection:bg-amber-900/60">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            {/* Grain overlay */}
            <div aria-hidden className="pointer-events-none fixed inset-0 z-50 opacity-[0.025] dark:opacity-[0.04]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
