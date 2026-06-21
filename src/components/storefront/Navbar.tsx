"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#synopsis", label: "Sinopsis" },
  { href: "#video", label: "Trailer" },
  { href: "#donasi", label: "Donasi" },
  { href: "#tim", label: "Tim" },
  { href: "#sponsor", label: "Sponsor" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt="Film Gigi" width={120} height={40} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-[#f5f5f5] font-bold tracking-widest uppercase text-sm">Film Gigi</span>
          )}
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-white/60 hover:text-[#f5c842] transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/10 px-4 py-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block text-white/70 hover:text-[#f5c842] text-sm py-1 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
