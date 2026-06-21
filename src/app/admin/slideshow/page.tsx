import { db } from "@/lib/db";
import SlideshowClient from "./SlideshowClient";

export default async function SlideshowPage() {
  const images = await db.slideImage.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Slideshow</h1>
        <p className="text-white/40 text-sm mt-1">Kelola gambar galeri film</p>
      </div>
      <SlideshowClient images={images} />
    </div>
  );
}
