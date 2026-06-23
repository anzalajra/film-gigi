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

  const chipStyle: CSSProperties = {
    padding: "var(--space-4) var(--space-6)",
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--line)",
    background: "var(--fg-card-soft)",
    color: "var(--ink-60)",
    fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
    fontSize: "var(--text-sm)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  };

  return (
    <Section id="sponsor" eyebrow="Didukung Oleh" center>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", justifyContent: "center" }}>
        {sponsors.map((s) => {
          const inner = s.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.logoUrl}
              alt={s.name}
              style={{ height: "1.75rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.8 }}
            />
          ) : (
            s.name
          );
          return s.website ? (
            <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name} style={chipStyle}>
              {inner}
            </a>
          ) : (
            <div key={s.id} style={chipStyle}>
              {inner}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
