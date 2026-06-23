import { type CSSProperties } from "react";
import { Section } from "./ds";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl?: string | null;
}

export default function ProductionTeamSection({ team }: { team: TeamMember[] }) {
  if (!team.length) return null;
  return (
    <Section id="tim" eyebrow="Tim Produksi" center>
      <div className="fg-team-grid">
        {team.map((m) => (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "var(--radius-pill)",
                background: "var(--fg-card-soft)",
                border: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink-30)",
                fontSize: "var(--text-2xl)",
                fontWeight: 700,
                overflow: "hidden",
              }}
            >
              {m.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.imageUrl} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                m.name.charAt(0)
              )}
            </div>
            <div>
              <p
                style={{
                  fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
                  color: "var(--ink)",
                  fontSize: "var(--text-sm)",
                  margin: 0,
                }}
              >
                {m.name}
              </p>
              <p style={{ color: "var(--ink-50)", fontSize: "var(--text-xs)", margin: "0.15rem 0 0" }}>{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
