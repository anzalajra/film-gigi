import { db } from "@/lib/db";
import ContentForm from "./ContentForm";

export default async function ContentPage() {
  const config = await db.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Konten Storefront</h1>
        <p className="text-white/40 text-sm mt-1">Edit konten utama yang tampil di halaman publik</p>
      </div>
      <ContentForm config={config} />
    </div>
  );
}
