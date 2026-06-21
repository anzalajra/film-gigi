"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateSiteConfig } from "../actions";
import { formatRupiah } from "@/lib/utils";
import { Button, Card, Field, Input } from "@/components/admin/ui";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <Field label="Target Dana (Rp)" hint={formatRupiah(form.targetAmount)}>
          <Input
            type="number"
            value={form.targetAmount}
            onChange={(e) => setForm((f) => ({ ...f, targetAmount: Number(e.target.value) }))}
            min={0}
            step={100000}
          />
        </Field>
      </Card>

      <Card className="p-6 space-y-5">
        <p className="text-white font-medium">Info Kontak</p>
        <Field label="WhatsApp (nomor, tanpa +)">
          <Input
            value={form.contactWhatsapp}
            onChange={(e) => setForm((f) => ({ ...f, contactWhatsapp: e.target.value }))}
            placeholder="628123456789"
          />
        </Field>
        <Field label="Instagram (username tanpa @)">
          <Input
            value={form.contactInstagram}
            onChange={(e) => setForm((f) => ({ ...f, contactInstagram: e.target.value }))}
            placeholder="filmgigi"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
            placeholder="hello@filmgigi.com"
          />
        </Field>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Simpan Pengaturan
        </Button>
      </div>
    </form>
  );
}
