"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Quote } from "lucide-react";

interface Props {
  image: string;
  quote: string;
  attribution?: string;
}

// Full-bleed parallax section — a colourful film still drifts behind a quote.
export default function ParallaxQuoteSection({ image, quote, attribution }: Props) {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        const img = imgRef.current;
        if (!el || !img) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        img.style.transform = `translateY(${p * 14}%) scale(1.28)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!image && !quote) return null;

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-24) var(--gutter)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={image}
        alt=""
        style={{
          position: "absolute",
          inset: "-15% 0",
          width: "100%",
          height: "130%",
          objectFit: "cover",
          transform: "scale(1.28)",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,10,10,0.55), rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.85))",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(10,10,10,0.5))",
        }}
      />
      <div data-reveal style={{ position: "relative", zIndex: 2, maxWidth: "44rem", textAlign: "center" }}>
        <Quote size={40} color="var(--gold)" fill="var(--gold)" style={{ opacity: 0.9, marginBottom: "var(--space-5)" }} />
        <blockquote
          style={
            {
              font: "var(--type-quote)",
              fontStyle: "italic",
              color: "var(--ink)",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
              textWrap: "pretty",
            } as CSSProperties
          }
        >
          {quote}
        </blockquote>
        {attribution && (
          <p
            style={{
              marginTop: "var(--space-5)",
              color: "var(--gold)",
              fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
              fontSize: "var(--text-xs)",
            }}
          >
            {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
