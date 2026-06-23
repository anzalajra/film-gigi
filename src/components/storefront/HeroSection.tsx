"use client";

import { type CSSProperties } from "react";
import { Heart, ArrowDown } from "lucide-react";
import { Button } from "./ds";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle: string;
  heroImageUrl: string;
  logoUrl?: string;
}

export default function HeroSection({ eyebrow, title, subtitle, heroImageUrl, logoUrl }: Props) {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 var(--gutter)",
        paddingTop: "var(--nav-height)",
        overflow: "hidden",
      }}
    >
      {/* Background still */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImageUrl}
            alt=""
            className="fg-anim-kenburns"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,10,10,0.6), transparent 40%, var(--fg-black))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(245,200,66,0.08), transparent 60%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: "48rem", margin: "0 auto" }}>
        {eyebrow && (
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-eyebrow)",
              color: "var(--gold)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: "var(--weight-medium)" as CSSProperties["fontWeight"],
              margin: "0 0 var(--space-6)",
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1 className="fg-hero-title" style={{ margin: "0 0 var(--space-6)" }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={title}
              style={{
                display: "block",
                width: "100%",
                maxWidth: "min(17rem, 50vw)",
                height: "auto",
                margin: "0 auto",
                objectFit: "contain",
                filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.5))",
              }}
            />
          ) : (
            <span
              style={{
                display: "block",
                color: "var(--ink)",
                fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"],
                lineHeight: "var(--leading-none)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {title}
            </span>
          )}
        </h1>
        {subtitle && (
          <p
            style={{
              color: "var(--ink-60)",
              fontSize: "var(--text-lg)",
              maxWidth: "36rem",
              margin: "0 auto",
              lineHeight: "var(--leading-relaxed)",
            }}
          >
            {subtitle}
          </p>
        )}
        <div
          style={{
            marginTop: "var(--space-10)",
            display: "flex",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button variant="primary" size="lg" href="#donasi" icon={<Heart size={17} fill="currentColor" />}>
            Dukung Sekarang
          </Button>
          <Button variant="secondary" size="lg" href="#synopsis">
            Pelajari Film
          </Button>
        </div>
      </div>

      <a
        href="#synopsis"
        className="fg-anim-bounce"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.4,
          zIndex: 10,
          color: "var(--ink)",
        }}
        aria-label="Scroll"
      >
        <ArrowDown size={22} strokeWidth={1.5} />
      </a>
    </section>
  );
}
