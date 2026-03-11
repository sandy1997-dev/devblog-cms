import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, formatDistanceToNow } from "date-fns";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatDate = (d: string, fmt = "MMMM d, yyyy") => format(parseISO(d), fmt);
export const formatDateISO = (d: string) => parseISO(d).toISOString();
export const formatDateRelative = (d: string) => {
  const date = parseISO(d);
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  return days < 30 ? formatDistanceToNow(date, { addSuffix: true }) : format(date, "MMM d, yyyy");
};

export const truncate = (s: string, n: number) => s.length <= n ? s : s.slice(0, n).trim() + "…";
export const slugify  = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
