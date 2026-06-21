"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarContent, navItems, isActive } from "./AdminSidebar";

export default function AdminShell({
  email,
  children,
}: {
  email?: string | null;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const current = navItems.find((item) => isActive(pathname, item))?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 w-64 h-screen bg-[#0f0f0f] border-r border-white/8 flex-col z-30">
        <SidebarContent email={email} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 left-0 w-72 h-full bg-[#0f0f0f] border-r border-white/8 transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
            className="absolute top-5 right-4 text-white/40 hover:text-white z-10"
          >
            <X size={18} />
          </button>
          <SidebarContent email={email} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 h-14 px-4 md:px-8 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/8">
          <button
            className="md:hidden text-white/70 hover:text-white -ml-1 p-1.5"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/35">Admin</span>
            <span className="text-white/20">/</span>
            <span className="text-white/80 font-medium">{current}</span>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
