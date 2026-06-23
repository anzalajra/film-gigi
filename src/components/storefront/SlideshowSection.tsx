"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [lightbox, setLightbox] = useState(false);

  const go = (d: number) => setIdx((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, images.length]);

  if (!images.length) return null;

  return (
    <Section id="galeri" eyebrow="Galeri" center>
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setLightbox(true)}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            border: "1px solid var(--line)",
            cursor: "zoom-in",
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
                <span
                  style={
                    {
                      position: "absolute",
                      left: "var(--space-4)",
                      bottom: "var(--space-4)",
                      maxWidth: "calc(100% - 5rem)",
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-pill)",
                      padding: "0.35rem 0.85rem",
                      color: "var(--ink)",
                      fontSize: "var(--text-xs)",
                      lineHeight: "var(--leading-snug)",
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    } as CSSProperties
                  }
                >
                  {img.caption}
                </span>
              )}
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Sebelumnya"
              style={navBtn("left")}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Berikutnya"
              style={navBtn("right")}
            >
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

      {/* Fullscreen lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--gutter)",
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Tutup"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              zIndex: 2,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              borderRadius: "var(--radius-pill)",
              padding: "0.6rem",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <span
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              color: "var(--ink-60)",
              fontSize: "var(--text-sm)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {idx + 1} / {images.length}
          </span>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", maxWidth: "min(96vw, 1400px)", maxHeight: "86vh", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx].imageUrl}
              alt={images[idx].caption || "Film Gigi"}
              style={{ maxWidth: "100%", maxHeight: "82vh", width: "auto", height: "auto", objectFit: "contain", borderRadius: "var(--radius-md)" }}
            />
            {images[idx].caption && (
              <p style={{ color: "var(--ink-70)", fontSize: "var(--text-sm)", margin: 0, textAlign: "center" } as CSSProperties}>
                {images[idx].caption}
              </p>
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Sebelumnya"
                style={{ ...lightboxNav("left") }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Berikutnya"
                style={{ ...lightboxNav("right") }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </Section>
  );
}

function lightboxNav(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    [side]: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
    borderRadius: "var(--radius-pill)",
    padding: "0.75rem",
    cursor: "pointer",
    display: "flex",
    backdropFilter: "blur(4px)",
  };
}
