"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { updateSiteConfig } from "../actions";
import { isValidQris } from "@/lib/qris";
import { formatRupiah } from "@/lib/utils";
import { Button, Card, Field, Textarea, Input, ToggleRow } from "@/components/admin/ui";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Props {
  qrisString: string;
  qrisActive: boolean;
  qrisMinAmount: number;
}

export default function QrisForm({
  qrisString: initial,
  qrisActive: initialActive,
  qrisMinAmount: initialMin,
}: Props) {
  const [qrisString, setQrisString] = useState(initial);
  const [qrisActive, setQrisActive] = useState(initialActive);
  const [qrisMinAmount, setQrisMinAmount] = useState(initialMin);
  const [saving, setSaving] = useState(false);
  const [previewQr, setPreviewQr] = useState<string | null>(null);

  useEffect(() => {
    if (isValidQris(qrisString)) {
      QRCode.toDataURL(qrisString, { width: 200, margin: 2 }).then(setPreviewQr).catch(() => setPreviewQr(null));
    } else {
      setPreviewQr(null);
    }
  }, [qrisString]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteConfig({ qrisString, qrisActive, qrisMinAmount });
      toast.success("Pengaturan QRIS disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const valid = qrisString ? isValidQris(qrisString) : null;

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <ToggleRow
          title="Aktifkan QRIS"
          description="Tampilkan QRIS di halaman publik"
          checked={qrisActive}
          onChange={setQrisActive}
        />

        <Field
          label="String QRIS Statis"
          error={valid === false ? "String QRIS tidak valid (harus diawali 000201)" : undefined}
        >
          <Textarea
            value={qrisString}
            onChange={(e) => setQrisString(e.target.value.trim())}
            rows={4}
            placeholder="Paste string QRIS statis di sini (dimulai dengan 000201...)"
            className="text-xs font-mono resize-none"
          />
          {valid === true && (
            <p className="flex items-center gap-1.5 text-green-400 text-xs mt-1.5">
              <CheckCircle2 size={13} /> QRIS valid
            </p>
          )}
        </Field>

        <Field label="Minimal Donasi" hint={formatRupiah(qrisMinAmount)}>
          <Input
            type="number"
            value={qrisMinAmount}
            onChange={(e) => setQrisMinAmount(Number(e.target.value))}
            min={1000}
            step={1000}
          />
        </Field>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Simpan Pengaturan QRIS
          </Button>
        </div>
      </Card>

      {previewQr ? (
        <Card className="p-6">
          <p className="text-white/60 text-sm mb-4 font-medium">Preview QRIS Statis</p>
          <div className="bg-white p-4 rounded-xl inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewQr} alt="QRIS Preview" width={200} height={200} />
          </div>
          <p className="text-white/30 text-xs mt-3 max-w-md">
            Ini adalah QR statis. Di storefront, donatur input nominal dan QR dinamis dibuat secara client-side.
          </p>
        </Card>
      ) : qrisString && valid === false ? (
        <Card className="p-6 flex items-center gap-3 text-amber-400/80 text-sm">
          <AlertTriangle size={18} className="shrink-0" />
          Preview akan muncul setelah string QRIS valid dimasukkan.
        </Card>
      ) : null}
    </div>
  );
}
