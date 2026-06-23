"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check, Heart } from "lucide-react";

export function formatRp(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}

/* ── Reveal-on-scroll wiring ─────────────────────────────── */
// Mount once inside the storefront. Reveals every [data-reveal] element as it
// scrolls into view (and anything already near the top right away).
export function StorefrontReveal() {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");
    const els = Array.from(document.querySelectorAll("[data-reveal]:not([data-revealed])"));
    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) reveal(el);
    });
    const rest = els.filter((el) => !el.hasAttribute("data-revealed"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    rest.forEach((el) => io.observe(el));
    const t = setTimeout(() => els.forEach(reveal), 1400);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  return null;
}

/* ── Section wrapper ─────────────────────────────────────── */
interface SectionProps {
  id?: string;
  eyebrow?: string;
  band?: boolean;
  narrow?: boolean;
  wide?: boolean;
  center?: boolean;
  parallax?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Section({ id, eyebrow, band, narrow, wide, center, parallax, children, style }: SectionProps) {
  const max = narrow ? "var(--max-prose)" : wide ? "var(--max-wide)" : "var(--max-content)";
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!parallax) return;
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const img = imgRef.current;
        if (!img || !img.parentElement) return;
        const r = img.parentElement.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        img.style.transform = `translateY(${p * 16}%) scale(1.3)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <section
      id={id}
      style={{
        position: parallax ? "relative" : undefined,
        overflow: parallax ? "hidden" : undefined,
        padding: "var(--space-24) var(--gutter)",
        background: band ? "var(--fg-night)" : "transparent",
        ...style,
      }}
    >
      {parallax && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={parallax}
            alt=""
            style={{
              position: "absolute",
              inset: "-15% 0",
              width: "100%",
              height: "130%",
              objectFit: "cover",
              transform: "scale(1.3)",
              opacity: 0.5,
              willChange: "transform",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, var(--fg-night) 0%, rgba(15,15,15,0.35) 45%, rgba(15,15,15,0.45) 55%, var(--fg-night) 100%)",
              zIndex: 0,
            }}
          />
        </>
      )}
      <div
        data-reveal
        style={{
          position: parallax ? "relative" : undefined,
          zIndex: 1,
          maxWidth: max,
          margin: "0 auto",
          textAlign: center ? "center" : "left",
        }}
      >
        {eyebrow && (
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-eyebrow)",
              color: "var(--gold)",
              fontSize: "var(--text-eyebrow)",
              fontWeight: "var(--weight-medium)" as CSSProperties["fontWeight"],
              margin: "0 0 var(--space-4)",
            }}
          >
            {eyebrow}
          </p>
        )}
        <div
          style={{
            width: "3rem",
            height: "1px",
            background: "var(--gold)",
            margin: center ? "0 auto var(--space-10)" : "0 0 var(--space-10)",
          }}
        />
        {children}
      </div>
    </section>
  );
}

/* ── Button ──────────────────────────────────────────────── */
type ButtonVariant = "primary" | "secondary" | "ghostGold" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  full?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  href?: string;
  download?: string | boolean;
  onClick?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
}

const BTN_SIZES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: "0.5rem 1rem", fontSize: "0.8125rem" },
  md: { padding: "0.75rem 2rem", fontSize: "0.875rem" },
  lg: { padding: "0.9rem 2.4rem", fontSize: "1rem" },
};
const BTN_VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "var(--gold)", color: "var(--gold-onfill)", border: "1px solid var(--gold)" },
  secondary: { background: "transparent", color: "var(--ink)", border: "1px solid var(--line-strong)" },
  ghostGold: { background: "transparent", color: "var(--gold)", border: "1px solid var(--gold-line)" },
  whatsapp: { background: "var(--wa-green-soft)", color: "var(--wa-green)", border: "1px solid var(--wa-green-line)" },
};

export function Button({
  variant = "primary",
  size = "md",
  pill = true,
  full = false,
  icon = null,
  iconRight = null,
  disabled = false,
  type = "button",
  href,
  download,
  onClick,
  style,
  children,
}: ButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
    lineHeight: 1,
    whiteSpace: "nowrap",
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto",
    borderRadius: pill ? "var(--radius-pill)" : "var(--radius-xl)",
    transition:
      "transform var(--dur-fast) var(--ease-standard), background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)",
    ...BTN_SIZES[size],
    ...BTN_VARIANTS[variant],
    ...style,
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    const el = e.currentTarget;
    if (variant === "primary") {
      el.style.boxShadow = "0 8px 24px rgba(245,200,66,0.25)";
      el.style.transform = "translateY(-1px)";
    } else if (variant === "secondary") el.style.borderColor = "var(--ink-40)";
    else if (variant === "ghostGold") {
      el.style.background = "var(--gold)";
      el.style.color = "var(--gold-onfill)";
    } else if (variant === "whatsapp") el.style.background = "rgba(37,211,102,0.2)";
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = "none";
    el.style.transform = "none";
    el.style.background = (BTN_VARIANTS[variant].background as string) ?? "";
    el.style.color = (BTN_VARIANTS[variant].color as string) ?? "";
    el.style.borderColor = (BTN_VARIANTS[variant].border as string).split(" ").pop() ?? "";
  };
  const content = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );
  if (href && !disabled) {
    return (
      <a
        href={href}
        download={download}
        style={base}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      style={base}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </button>
  );
}

/* ── Badge ───────────────────────────────────────────────── */
type BadgeVariant = "gold" | "goldSoft" | "outline" | "whatsapp";
const BADGE_VARIANTS: Record<BadgeVariant, CSSProperties> = {
  gold: { background: "var(--gold)", color: "var(--gold-onfill)" },
  goldSoft: { background: "var(--gold-soft)", color: "var(--gold)" },
  outline: { background: "transparent", color: "var(--ink-70)", border: "1px solid var(--line-strong)" },
  whatsapp: { background: "var(--wa-green-soft)", color: "var(--wa-green)" },
};

export function Badge({
  variant = "gold",
  icon = null,
  children,
  style,
}: {
  variant?: BadgeVariant;
  icon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: icon ? "0.375rem 0.875rem" : "0.25rem 0.75rem",
        borderRadius: "var(--radius-pill)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
        lineHeight: 1,
        whiteSpace: "nowrap",
        ...BADGE_VARIANTS[variant],
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

/* ── ProgressBar ─────────────────────────────────────────── */
export function ProgressBar({
  raised = 0,
  target = 1,
  showStats = true,
  style,
}: {
  raised?: number;
  target?: number;
  showStats?: boolean;
  style?: CSSProperties;
}) {
  const pct = Math.min(100, Math.round((raised / Math.max(1, target)) * 100));
  const [w, setW] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setW(pct), 80);
    const dur = 1100;
    let rafId = 0;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(raised * eased));
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    const done = setTimeout(() => setCount(raised), dur + 200);
    return () => {
      clearTimeout(t);
      clearTimeout(done);
      cancelAnimationFrame(rafId);
    };
  }, [pct, raised]);

  const countPct = Math.min(100, Math.round((count / Math.max(1, target)) * 100));

  return (
    <div style={style}>
      {showStats && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "var(--space-3)",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "var(--text-3xl)",
                fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"],
                color: "var(--ink)",
                margin: 0,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatRp(count)}
            </p>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-50)", margin: "0.25rem 0 0" }}>
              terkumpul dari {formatRp(target)}
            </p>
          </div>
          <p
            style={{
              fontSize: "var(--text-4xl)",
              fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"],
              color: "var(--gold)",
              margin: 0,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {countPct}%
          </p>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: "0.75rem",
          background: "var(--line)",
          borderRadius: "var(--radius-pill)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${w}%`,
            background: "linear-gradient(to right, var(--gold), var(--gold-amber))",
            borderRadius: "var(--radius-pill)",
            transition: "width var(--dur-bar) var(--ease-out)",
          }}
        />
      </div>
    </div>
  );
}

/* ── PackageCard ─────────────────────────────────────────── */
export function PackageCard({
  name,
  amount,
  description,
  benefits = [],
  popular = false,
  onPick,
  ctaLabel = "Pilih Paket",
}: {
  name: string;
  amount: number;
  description?: string;
  benefits?: string[];
  popular?: boolean;
  onPick?: () => void;
  ctaLabel?: string;
}) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-2xl)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        height: "100%",
        boxSizing: "border-box",
        textAlign: "left",
        background: popular ? "var(--fg-card-gold)" : "var(--fg-card-soft)",
        border: `1px solid ${popular ? "var(--gold-line)" : "var(--line)"}`,
        transition: "transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-standard)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <span
        aria-hidden={!popular}
        style={{
          alignSelf: "flex-start",
          visibility: popular ? "visible" : "hidden",
          fontSize: "var(--text-xs)",
          background: "var(--gold)",
          color: "var(--gold-onfill)",
          padding: "0.25rem 0.75rem",
          borderRadius: "var(--radius-pill)",
          fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
        }}
      >
        Populer
      </span>
      <div>
        <h3
          style={{
            fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"],
            color: "var(--ink)",
            fontSize: "var(--text-lg)",
            margin: 0,
          }}
        >
          {name}
        </h3>
        <p
          style={{
            color: "var(--gold)",
            fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
            fontSize: "var(--text-xl)",
            margin: "0.25rem 0 0",
          }}
        >
          {formatRp(amount)}
        </p>
      </div>
      {description && (
        <p
          style={{
            color: "var(--ink-60)",
            fontSize: "var(--text-sm)",
            margin: 0,
            lineHeight: "var(--leading-normal)",
            minHeight: "calc(var(--text-sm) * var(--leading-normal) * 2)",
          }}
        >
          {description}
        </p>
      )}
      {benefits.length > 0 && (
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {benefits.map((b, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                fontSize: "var(--text-sm)",
                color: "var(--ink-70)",
              }}
            >
              <Check size={14} strokeWidth={3} color="var(--gold)" style={{ marginTop: "0.2rem", flexShrink: 0 }} />
              {b}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={onPick}
        style={{
          marginTop: "auto",
          padding: "0.7rem",
          border: "1px solid var(--gold-line)",
          borderRadius: "var(--radius-xl)",
          background: "transparent",
          color: "var(--gold)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)" as CSSProperties["fontWeight"],
          cursor: "pointer",
          transition: "background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--gold)";
          e.currentTarget.style.color = "var(--gold-onfill)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--gold)";
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

/* ── DonorCard ───────────────────────────────────────────── */
export function DonorCard({
  name,
  amount,
  message,
  date,
  anonymous = false,
  showAmount = true,
}: {
  name: string;
  amount: number;
  message?: string | null;
  date?: string;
  anonymous?: boolean;
  showAmount?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-4)",
        padding: "var(--space-4)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--line-soft)",
        background: "var(--fg-card-soft)",
        transition: "border-color var(--dur-base) var(--ease-standard)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--line-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line-soft)")}
    >
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "var(--radius-pill)",
          background: "var(--gold-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Heart size={16} color="var(--gold)" fill="var(--gold)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
          <p
            style={{
              fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"],
              color: "var(--ink)",
              fontSize: "var(--text-sm)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {anonymous ? "Anonim" : name}
          </p>
          {showAmount && (
            <p
              style={{
                color: "var(--gold)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-medium)" as CSSProperties["fontWeight"],
                margin: 0,
                flexShrink: 0,
              }}
            >
              {formatRp(amount)}
            </p>
          )}
        </div>
        {message && (
          <p
            style={{
              color: "var(--ink-50)",
              fontSize: "var(--text-xs)",
              margin: "0.25rem 0 0",
              lineHeight: "var(--leading-snug)",
            }}
          >
            {message}
          </p>
        )}
        {date && <p style={{ color: "var(--ink-30)", fontSize: "var(--text-xs)", margin: "0.25rem 0 0" }}>{date}</p>}
      </div>
    </div>
  );
}
