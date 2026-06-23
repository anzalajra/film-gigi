"use client";

import { type CSSProperties } from "react";
import { Section } from "./ds";

interface Sponsor {
  id: number;
  name: string;
  logoUrl: string;
  website?: string | null;
}

export default function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;

  const wrapStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-5) var(--space-8)",
    borderRadius: "var(--radius-2xl)",
    border: "1px solid var(--line)",
    background: "var(--fg-card-soft)",
    color: "var(--ink-70)",
    fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
    fontSize: "var(--text-lg)",
    textDecoration: "none",
    transition: "transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-standard)",
  };

  return (
    <Section id="sponsor" eyebrow="Didukung Oleh" center>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6)", justifyContent: "center", alignItems: "center" }}>
        {sponsors.map((s) => {
          const inner = s.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.logoUrl}
              alt={s.name}
              style={{ height: "5rem", maxWidth: "14rem", width: "auto", objectFit: "contain", display: "block" }}
            />
          ) : (
            s.name
          );

          const interactive = Boolean(s.website);
          const onEnter = (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.borderColor = "var(--gold-line)";
          };
          const onLeave = (e: React.MouseEvent<HTMLElement>) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.borderColor = "var(--line)";
          };

          return s.website ? (
            <a
              key={s.id}
              href={s.website}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              style={{ ...wrapStyle, cursor: "pointer" }}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
            >
              {inner}
            </a>
          ) : (
            <div
              key={s.id}
              title={s.name}
              style={wrapStyle}
              onMouseEnter={interactive ? onEnter : undefined}
              onMouseLeave={interactive ? onLeave : undefined}
            >
              {inner}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
