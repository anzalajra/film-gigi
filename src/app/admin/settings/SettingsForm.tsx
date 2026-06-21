"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateSiteConfig } from "../actions";
import { formatRupiah } from "@/lib/utils";

interface Config {
  targetAmount: number;
  contactWhatsapp: string;
  contactInstagram: string;
  contactEmail: string;
}

export default function SettingsForm({ config }: { config: Config | null }) {
  const [form, setForm] = useState({
    targetAmount: config?.targetAmount ?? 20000000,
    contactWhatsapp: config?.contactWhatsapp ?? "",
    contactInstagram: config?.contactInstagram ?? "",
    contactEmail: config?.contactEmail ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteConfig(form);
      toast.success("Pengaturan disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#141414] border border-white/8 rounded-2xl p-6">
      <div>
        <label className="block text-white/60 text-sm mb-1.5">Target Dana (Rp)</label>
        <input
          type="number"
          value={form.targetAmount}
          onChange={(e) => setForm((f) => ({ ...f, targetAmount: Number(e.target.value) }))}
          min={0}
          step={100000}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842]"
        />
        <p className="text-white/30 text-xs mt-1">{formatRupiah(form.targetAmount)}</p>
      </div>

      <hr className="border-white/8" />

      <div>
        <p className="text-white font-medium mb-4">Info Kontak</p>
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1.5">WhatsApp (nomor, tanpa +)</label>
            <input
              value={form.contactWhatsapp}
              onChange={(e) => setForm((f) => ({ ...f, contactWhatsapp: e.target.value }))}
              placeholder="628123456789"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Instagram (username tanpa @)</label>
            <input
              value={form.contactInstagram}
              onChange={(e) => setForm((f) => ({ ...f, contactInstagram: e.target.value }))}
              placeholder="filmgigi"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
              placeholder="hello@filmgigi.com"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842] placeholder:text-white/30"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 transition-colors text-sm disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </form>
  );
}
