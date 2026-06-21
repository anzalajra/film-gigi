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
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
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

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b border-white/8">
        <div>
          <p className="font-bold text-white text-sm">Film Gigi</p>
          <p className="text-white/40 text-xs">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                active
                  ? "bg-[#f5c842]/10 text-[#f5c842]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/8">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-400/5 transition-colors w-full"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1a1a1a] border border-white/15 rounded-xl p-2 text-white"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 w-64 h-full bg-[#0f0f0f] border-r border-white/8 transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 w-64 h-full bg-[#0f0f0f] border-r border-white/8 flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
