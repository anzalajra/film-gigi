import { db } from "@/lib/db";
import SlideshowClient from "./SlideshowClient";
import { PageHeader } from "@/components/admin/ui";

export default async function SlideshowPage() {
  const images = await db.slideImage.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <PageHeader title="Slideshow" subtitle="Kelola gambar galeri film" />
      <SlideshowClient images={images} />
    </div>
  );
}
