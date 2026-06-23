import { type CSSProperties } from "react";
import { Section } from "./ds";

function renderInline(text: string) {
  return text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="color:var(--ink);font-weight:700">$1</strong>'
  );
}

export default function SynopsisSection({ content }: { content: string }) {
  if (!content) return null;
  const paragraphs = content.split("\n\n");
  return (
    <Section id="synopsis" eyebrow="Sinopsis" narrow center>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={
            {
              color: "var(--ink-80)",
              fontSize: "var(--text-lg)",
              lineHeight: "var(--leading-relaxed)",
              margin: "0 0 var(--space-5)",
            } as CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: renderInline(p) }}
        />
      ))}
    </Section>
  );
}
