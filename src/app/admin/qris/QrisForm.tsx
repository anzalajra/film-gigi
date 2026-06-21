"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { updateSiteConfig } from "../actions";
import { isValidQris } from "@/lib/qris";
import { formatRupiah } from "@/lib/utils";

interface Props {
  qrisString: string;
  qrisActive: boolean;
  qrisMinAmount: number;
}

export default function QrisForm({ qrisString: initial, qrisActive: initialActive, qrisMinAmount: initialMin }: Props) {
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

  return (
    <div className="space-y-6">
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Aktifkan QRIS</p>
            <p className="text-white/40 text-xs mt-0.5">Tampilkan QRIS di halaman publik</p>
          </div>
          <button
            type="button"
            onClick={() => setQrisActive(!qrisActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${qrisActive ? "bg-[#f5c842]" : "bg-white/20"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${qrisActive ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-1.5">String QRIS Statis</label>
          <textarea
            value={qrisString}
            onChange={(e) => setQrisString(e.target.value.trim())}
            rows={4}
            placeholder="Paste string QRIS statis di sini (dimulai dengan 000201...)"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-[#f5c842] placeholder:text-white/20 resize-none"
          />
          {qrisString && !isValidQris(qrisString) && (
            <p className="text-red-400 text-xs mt-1">⚠ String QRIS tidak valid (harus diawali 000201)</p>
          )}
          {qrisString && isValidQris(qrisString) && (
            <p className="text-green-400 text-xs mt-1">✓ QRIS valid</p>
          )}
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-1.5">Minimal Donasi</label>
          <input
            type="number"
            value={qrisMinAmount}
            onChange={(e) => setQrisMinAmount(Number(e.target.value))}
            min={1000}
            step={1000}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842]"
          />
          <p className="text-white/30 text-xs mt-1">{formatRupiah(qrisMinAmount)}</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 transition-colors text-sm disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Pengaturan QRIS"}
        </button>
      </div>

      {previewQr && (
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <p className="text-white/60 text-sm mb-4">Preview QRIS Statis</p>
          <div className="bg-white p-4 rounded-xl inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewQr} alt="QRIS Preview" width={200} height={200} />
          </div>
          <p className="text-white/30 text-xs mt-3">
            Ini adalah QR statis. Di storefront, donatur input nominal dan QR dinamis dibuat secara client-side.
          </p>
        </div>
      )}
    </div>
  );
}
