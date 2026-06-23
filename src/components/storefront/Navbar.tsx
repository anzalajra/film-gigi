"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "./ds";

const NAV_LINKS = [
  { href: "#synopsis", label: "Sinopsis" },
  { href: "#trailer", label: "Trailer" },
  { href: "#donasi", label: "Donasi" },
  { href: "#tim", label: "Tim" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle: CSSProperties = {
    fontSize: "var(--text-sm)",
    color: "var(--ink-60)",
    textDecoration: "none",
    transition: "color var(--dur-fast)",
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.65)",
        backdropFilter: "blur(var(--backdrop-blur))",
        WebkitBackdropFilter: "blur(var(--backdrop-blur))",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        transition:
          "background var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)",
      }}
    >
      <div
        className="fg-nav-inner"
        style={{
          maxWidth: "var(--max-wide)",
          margin: "0 auto",
          padding: "0 var(--gutter)",
          height: "var(--nav-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="#hero"
          className="fg-logo"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={() => setOpen(false)}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Film Gigi"
              width={140}
              height={46}
              className="object-contain"
              style={{ height: "2.6rem", width: "auto" }}
            />
          ) : (
            <span
              style={{
                color: "var(--ink)",
                fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"],
                letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase",
                fontSize: "var(--text-sm)",
              }}
            >
              Film Gigi
            </span>
          )}
        </a>

        {/* Desktop links */}
        <ul
          className="fg-desktop-nav"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}
        >
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="fg-nav-link" style={linkStyle}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Button variant="primary" size="sm" href="#donasi">
              Dukung
            </Button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="fg-mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          style={{ display: "none", background: "none", border: "none", color: "var(--ink-70)", cursor: "pointer", padding: 4 }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fg-anim-fade"
          style={{
            background: "var(--fg-night)",
            borderTop: "1px solid var(--line)",
            padding: "var(--space-4) var(--gutter) var(--space-6)",
          }}
        >
          <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", listStyle: "none", margin: 0, padding: 0 }}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ display: "block", color: "var(--ink-70)", textDecoration: "none", fontSize: "var(--text-base)", padding: "0.35rem 0" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li style={{ marginTop: "0.5rem" }}>
              <Button variant="primary" full href="#donasi" onClick={() => setOpen(false)}>
                Dukung Sekarang
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
