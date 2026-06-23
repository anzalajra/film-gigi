import { type CSSProperties } from "react";
import { Quote } from "lucide-react";
import { Section } from "./ds";

interface Props {
  sectionId: string;
  label: string;
  name?: string;
  imageUrl?: string;
  quote: string;
  reverse?: boolean;
  dark?: boolean;
}

export default function StatementSection({ sectionId, label, name, imageUrl, quote, reverse, dark }: Props) {
  if (!imageUrl && !quote) return null;

  return (
    <Section id={sectionId} eyebrow={label} band={dark}>
      <div className={reverse ? "fg-statement fg-statement--rev" : "fg-statement"}>
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: "14rem",
              height: "17rem",
              borderRadius: "var(--radius-2xl)",
              border: "1px solid var(--line)",
              background: "linear-gradient(150deg, var(--fg-card) 0%, #1c1c1c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={name || label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "5rem", fontWeight: 700, color: "var(--ink-20)" }}>
                {(name || label).charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Quote size={32} color="var(--gold)" fill="var(--gold)" style={{ opacity: 0.4, marginBottom: "var(--space-4)" }} />
          <blockquote
            style={
              {
                fontWeight: "var(--weight-light)",
                fontSize: "var(--text-2xl)",
                color: "var(--ink-85)",
                lineHeight: "var(--leading-relaxed)",
                fontStyle: "italic",
                margin: 0,
                whiteSpace: "pre-line",
                textWrap: "pretty",
              } as CSSProperties
            }
          >
            {quote}
          </blockquote>
          {name && (
            <p
              style={{
                marginTop: "var(--space-6)",
                color: "var(--gold)",
                fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
              }}
            >
              — {name}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
