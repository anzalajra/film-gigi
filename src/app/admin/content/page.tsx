import { db } from "@/lib/db";
import ContentForm from "./ContentForm";
import { PageHeader } from "@/components/admin/ui";

export default async function ContentPage() {
  const config = await db.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-6">
      <PageHeader title="Konten Storefront" subtitle="Edit konten utama yang tampil di halaman publik" />
      <ContentForm config={config} />
    </div>
  );
}
