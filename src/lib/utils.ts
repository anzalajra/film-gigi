import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a stored upload URL to a servable URL. Locally uploaded files
 * (under /uploads/...) are served through /api/file so they get the correct
 * content-type and an inline disposition (important for PDFs). External URLs
 * are returned untouched.
 */
export function uploadFileUrl(url: string, opts?: { download?: boolean }): string {
  if (!url) return url;
  if (url.startsWith("/uploads/")) {
    const name = url.slice("/uploads/".length);
    const base = `/api/file/${encodeURIComponent(name)}`;
    return opts?.download ? `${base}?download=1` : base;
  }
  return url;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
