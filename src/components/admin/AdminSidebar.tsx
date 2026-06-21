"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Images,
  QrCode,
  Heart,
  Package,
  Users,
  Camera,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/content", label: "Konten", icon: FileText },
  { href: "/admin/slideshow", label: "Slideshow", icon: Images },
  { href: "/admin/qris", label: "QRIS", icon: QrCode },
  { href: "/admin/donations", label: "Donasi", icon: Heart },
  { href: "/admin/packages", label: "Paket", icon: Package },
  { href: "/admin/sponsors", label: "Sponsor", icon: Camera },
  { href: "/admin/team", label: "Tim Produksi", icon: Users },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function SidebarContent({
  email,
  onNavigate,
}: {
  email?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5c842] text-black font-black text-sm">
          FG
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm leading-tight">Film Gigi</p>
          <p className="text-white/40 text-xs">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/25">
          Menu
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  active
                    ? "bg-[#f5c842]/10 text-[#f5c842] font-medium"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#f5c842]" />
                )}
                <item.icon size={17} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-white/8">
        {email && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase">
              {email.charAt(0)}
            </div>
            <p className="text-white/50 text-xs truncate" title={email}>
              {email}
            </p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/55 hover:text-red-400 hover:bg-red-400/5 transition-colors w-full"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </div>
  );
}
