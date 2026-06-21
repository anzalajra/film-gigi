import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const config = await db.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-6 pt-8 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        <p className="text-white/40 text-sm mt-1">Target dana, info kontak, dan link lainnya</p>
      </div>
      <SettingsForm config={config} />
    </div>
  );
}
