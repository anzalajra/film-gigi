"use client";

import { useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "./ds";

interface SlideImage {
  id: number;
  imageUrl: string;
  caption?: string | null;
}

function navBtn(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    [side]: "0.75rem",
    top: "calc(50% - 1.4rem)",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)",
    color: "var(--ink)",
    border: "none",
    padding: "0.5rem",
    borderRadius: "var(--radius-pill)",
    cursor: "pointer",
    display: "flex",
    backdropFilter: "blur(4px)",
  };
}

export default function SlideshowSection({ images }: { images: SlideImage[] }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;
  const go = (d: number) => setIdx((i) => (i + d + images.length) % images.length);

  return (
    <Section id="galeri" eyebrow="Galeri" center>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            border: "1px solid var(--line)",
          }}
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              style={{
                position: "absolute",
                inset: 0,
                opacity: i === idx ? 1 : 0,
                transition: "opacity var(--dur-slow) var(--ease-standard)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.caption || "Film Gigi"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {img.caption && (
                <div
                  style={{
                    position: "absolute",
                    insetInline: 0,
                    bottom: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                    padding: "var(--space-6) var(--space-4) var(--space-4)",
                  }}
                >
                  <p style={{ color: "var(--ink-80)", fontSize: "var(--text-sm)", margin: 0, textAlign: "left" } as CSSProperties}>
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Sebelumnya" style={navBtn("left")}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => go(1)} aria-label="Berikutnya" style={navBtn("right")}>
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "var(--space-4)" }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === idx ? 16 : 8,
                height: 8,
                borderRadius: "var(--radius-pill)",
                border: "none",
                background: i === idx ? "var(--gold)" : "var(--ink-30)",
                cursor: "pointer",
                transition: "all var(--dur-base)",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
