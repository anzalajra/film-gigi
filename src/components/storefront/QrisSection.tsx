"use client";

import { useState, useRef, useEffect } from "react";
import { convertQrisToDynamic, isValidQris } from "@/lib/qris";
import { formatRupiah } from "@/lib/utils";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          </div>
        )}
      </div>
    </section>
  );
}
