function getEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id = u.searchParams.get("v");
      if (!id && u.hostname === "youtu.be") id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return url;
}

export default function VideoSection({ videoUrl }: { videoUrl: string }) {
  if (!videoUrl) return null;
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section id="video" className="py-24 px-4 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Trailer</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10" />
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
          <iframe
            src={embedUrl}
            title="Film Gigi Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
