"use client";

import { useState, useRef } from "react";
import { convertQrisToDynamic, isValidQris } from "@/lib/qris";
import { formatRupiah } from "@/lib/utils";
import { X, Upload, CheckCircle2 } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  qrisString: string;
  minAmount: number;
  sectionId?: string;
}

export default function QrisSection({ qrisString, minAmount, sectionId = "donasi" }: Props) {
  const [amount, setAmount] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAmount, setLastAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const quickAmounts = [25000, 50000, 100000, 250000, 500000];

  const generateQR = async (nominalAmount: number) => {
    setError("");
    if (!isValidQris(qrisString)) {
      setError("QRIS belum dikonfigurasi.");
      return;
    }
    if (nominalAmount < minAmount) {
      setError(`Minimal donasi ${formatRupiah(minAmount)}`);
      return;
    }
    setLoading(true);
    try {
      const dynamic = convertQrisToDynamic(qrisString, nominalAmount);
      const dataUrl = await QRCode.toDataURL(dynamic, {
        width: 280,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
      setLastAmount(nominalAmount);
    } catch {
      setError("Gagal membuat QR Code. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!num || num <= 0) {
      setError("Masukkan nominal yang valid.");
      return;
    }
    generateQR(num);
  };

  return (
    <section id={sectionId} className="py-24 px-4 bg-[#0f0f0f]">
      <div className="max-w-xl mx-auto text-center">
        <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Donasi</p>
        <div className="w-12 h-px bg-[#f5c842] mb-10 mx-auto" />
        <h2 className="text-3xl font-bold text-white mb-3">Dukung Film Gigi</h2>
        <p className="text-white/50 mb-10 text-sm">Scan QRIS untuk berdonasi. Setiap dukungan sangat berarti.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {quickAmounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAmount(a.toString());
                  generateQR(a);
                }}
                className="px-4 py-2 text-xs border border-white/20 rounded-full text-white/70 hover:border-[#f5c842] hover:text-[#f5c842] transition-colors"
              >
                {formatRupiah(a)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Min. ${formatRupiah(minAmount)}`}
              value={amount ? formatRupiah(parseInt(amount.replace(/\D/g, "") || "0")) : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setAmount(raw);
                setQrDataUrl(null);
              }}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#f5c842] text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 transition-colors text-sm disabled:opacity-50"
            >
              {loading ? "..." : "Buat QR"}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {qrDataUrl && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="QRIS QR Code" width={280} height={280} />
            </div>
            <p className="text-white/50 text-xs">Scan dengan aplikasi mobile banking / e-wallet apapun</p>
            <a
              href={qrDataUrl}
              download="qris-filmgigi.png"
              className="text-[#f5c842] text-xs underline hover:no-underline"
            >
              Download QR Code
            </a>

            <div className="mt-2 w-full border-t border-white/10 pt-6">
              <p className="text-white/50 text-xs mb-3">Sudah transfer? Bantu kami catat donasimu.</p>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#f5c842]/60 text-[#f5c842] font-semibold rounded-xl hover:bg-[#f5c842] hover:text-black transition-colors text-sm"
              >
                <CheckCircle2 size={16} />
                Konfirmasi Donasi
              </button>
            </div>
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmDonationModal
          defaultAmount={lastAmount}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </section>
  );
}

function ConfirmDonationModal({
  defaultAmount,
  onClose,
}: {
  defaultAmount: number;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(defaultAmount ? defaultAmount.toString() : "");
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const num = parseInt(amount.replace(/\D/g, ""), 10);
    if (!name.trim()) return setError("Nama wajib diisi.");
    if (!num || num <= 0) return setError("Nominal tidak valid.");
    if (!proof) return setError("Unggah bukti transfer QRIS.");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("amount", num.toString());
      fd.append("message", message.trim());
      fd.append("isAnonymous", isAnonymous ? "true" : "false");
      fd.append("proof", proof);
      const res = await fetch("/api/donation-confirmation", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim konfirmasi");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengirim konfirmasi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
          <h3 className="text-white font-semibold">Konfirmasi Donasi</h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 size={40} className="text-[#f5c842] mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Terima kasih!</p>
            <p className="text-white/50 text-sm mb-6">
              Konfirmasi donasimu telah kami terima dan akan diverifikasi oleh admin.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Bukti Transfer QRIS</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/12 bg-white/[0.02] rounded-xl p-4 text-center cursor-pointer hover:border-[#f5c842]/40 transition-colors"
              >
                {proof ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(proof)}
                    alt="Bukti transfer"
                    className="max-h-40 w-auto mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="py-3">
                    <Upload size={22} className="mx-auto text-white/30 mb-2" />
                    <p className="text-white/40 text-xs">Klik untuk unggah screenshot bukti</p>
                    <p className="text-white/20 text-xs mt-1">PNG, JPG, WebP — Maks. 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProof(e.target.files?.[0] ?? null)}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Nama</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#f5c842]/70"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-[#f5c842]"
              />
              <span className="text-white/70 text-sm">Tampilkan sebagai Anonim</span>
            </label>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Kata-kata / Ucapan</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Opsional"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#f5c842]/70 resize-y"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-1.5">Nominal</label>
              <input
                type="text"
                value={amount ? formatRupiah(parseInt(amount.replace(/\D/g, "") || "0")) : ""}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="Nominal donasi"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#f5c842]/70"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 border border-white/15 text-white/70 rounded-xl text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "Kirim Konfirmasi"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
