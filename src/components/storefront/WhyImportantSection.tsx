"use client";

import { type CSSProperties, type ComponentType } from "react";
import { Users, Sparkles, Heart, MessageCircle } from "lucide-react";
import { Section } from "./ds";

interface WhyPoint {
  icon?: string;
  title: string;
  text: string;
}

const ACCENTS = ["var(--k-teal)", "var(--k-orange)", "var(--k-magenta)", "var(--k-blue)"];
const ICONS: Record<string, ComponentType<{ size?: number; color?: string }>> = {
  users: Users,
  sparkles: Sparkles,
  heart: Heart,
  message: MessageCircle,
};

export default function WhyImportantSection({ content, points = [] }: { content: string; points?: WhyPoint[] }) {
  if (!content && points.length === 0) return null;

  return (
    <Section id="kenapa" eyebrow="Kenapa Film Ini Penting" band narrow center>
      {content && (
        <p
          style={
            {
              fontSize: "var(--text-xl)",
              color: "var(--ink-80)",
              lineHeight: "var(--leading-relaxed)",
              margin: 0,
              textWrap: "pretty",
            } as CSSProperties
          }
        >
          {content}
        </p>
      )}
      {points.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-4)",
            marginTop: content ? "var(--space-10)" : 0,
            textAlign: "left",
          }}
        >
          {points.map((pt, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const IconCmp = ICONS[pt.icon || "sparkles"] || Sparkles;
            return (
              <div
                data-reveal
                data-delay={String((i % 4) + 1)}
                key={i}
                style={{
                  background: "var(--fg-card-soft)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-2xl)",
                  padding: "var(--space-6)",
                  transition: "border-color var(--dur-base), transform var(--dur-base) var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--line-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = "var(--line)";
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: "2.75rem",
                    height: "2.75rem",
                    borderRadius: "var(--radius-xl)",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accent,
                    background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <IconCmp size={20} color={accent} />
                </span>
                <h3
                  style={{
                    color: "var(--ink)",
                    fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
                    fontSize: "var(--text-base)",
                    margin: "0 0 0.4rem",
                  }}
                >
                  {pt.title}
                </h3>
                <p
                  style={
                    {
                      color: "var(--ink-60)",
                      fontSize: "var(--text-sm)",
                      lineHeight: "var(--leading-snug)",
                      margin: 0,
                      textWrap: "pretty",
                    } as CSSProperties
                  }
                >
                  {pt.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
