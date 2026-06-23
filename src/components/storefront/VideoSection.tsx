"use client";

import { useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import { Section } from "./ds";

function getEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id = u.searchParams.get("v");
      if (!id && u.hostname === "youtu.be") id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").pop();
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
  } catch {}
  return url;
}

interface Props {
  videoUrl: string;
  thumb?: string;
}

export default function VideoSection({ videoUrl, thumb }: Props) {
  const [playing, setPlaying] = useState(false);
  if (!videoUrl) return null;
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <Section id="trailer" eyebrow="Pre-Visual Film Gigi" band center>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          border: "1px solid var(--line)",
          cursor: playing ? "default" : "pointer",
          background: "var(--fg-card)",
        }}
        onClick={() => !playing && setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            title="Film Gigi Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <>
            {thumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt="Trailer Film Gigi"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "var(--radius-pill)",
                  background: "var(--gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 4,
                  animation: "fg-pulse-ring 2.4s ease-out infinite",
                }}
              >
                <Play size={28} color="#000" fill="#000" />
              </span>
              <span style={{ color: "var(--ink-70)", fontSize: "var(--text-sm)" } as CSSProperties}>Putar trailer</span>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
