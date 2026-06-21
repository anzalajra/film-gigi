"use client";

import { useState } from "react";
import { Check, X, Download, QrCode } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { convertQrisToDynamic, isValidQris } from "@/lib/qris";
import QRCode from "qrcode";

interface Package {
  id: number;
  name: string;
  amount: number;
  description: string;
  benefits: string;
}

interface Props {
  packages: Package[];
  qrisString?: string;
}

export default function PackagesSection({ packages, qrisString }: Props) {
  const [modal, setModal] = useState<{
    pkg: Package;
    qrDataUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePickPackage = async (pkg: Package) => {
    if (!qrisString || !isValidQris(qrisString)) {
      // Fallback: scroll to donasi section if QRIS not configured
      document.getElementById("donasi")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const dynamic = convertQrisToDynamic(qrisString, pkg.amount);
      const dataUrl = await QRCode.toDataURL(dynamic, {
        width: 320,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setModal({ pkg, qrDataUrl: dataUrl });
    } catch {
      setError("Gagal membuat QR Code.");
    } finally {
      setLoading(false);
    }
  };

  if (!packages.length) return null;

  return (
    <>
      <section id="paket" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-[#f5c842] text-xs mb-4 font-medium">Paket Dukungan</p>
          <div className="w-12 h-px bg-[#f5c842] mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, i) => {
              let benefits: string[] = [];
              try { benefits = JSON.parse(pkg.benefits); } catch {}
              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border p-6 flex flex-col gap-4 ${i === 0 ? "border-[#f5c842]/50 bg-[#f5c842]/5" : "border-white/10 bg-white/2"}`}
                >
                  {i === 0 && (
                    <span className="self-start text-xs bg-[#f5c842] text-black px-3 py-1 rounded-full font-semibold">Populer</span>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
                    <p className="text-[#f5c842] font-semibold text-xl mt-1">{formatRupiah(pkg.amount)}</p>
                  </div>
                  <p className="text-white/60 text-sm">{pkg.description}</p>
                  {benefits.length > 0 && (
                    <ul className="flex flex-col gap-2 mt-auto">
                      {benefits.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-sm text-white/70">
                          <Check size={14} className="text-[#f5c842] mt-0.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => handlePickPackage(pkg)}
                    disabled={loading}
                    className="mt-4 block text-center py-2.5 border border-[#f5c842]/40 rounded-xl text-[#f5c842] text-sm hover:bg-[#f5c842] hover:text-black transition-colors font-medium disabled:opacity-50 cursor-pointer"
                  >
                    Pilih Paket
                  </button>
                </div>
              );
            })}
          </div>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>
      </section>

      {/* QRIS Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <div
            className="relative bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-[#f5c842]/10 text-[#f5c842] px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
                <QrCode size={14} />
                QRIS Payment
              </div>
              <h3 className="text-white font-bold text-lg">{modal.pkg.name}</h3>
              <p className="text-[#f5c842] font-bold text-2xl mt-1">{formatRupiah(modal.pkg.amount)}</p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={modal.qrDataUrl} alt="QRIS QR Code" width={280} height={280} />
              </div>
              <p className="text-white/40 text-xs text-center">
                Scan dengan aplikasi mobile banking atau e-wallet
              </p>
              <div className="flex gap-3 w-full">
                <a
                  href={modal.qrDataUrl}
                  download={`qris-${modal.pkg.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-white/15 rounded-xl text-white/70 text-sm hover:border-white/30 transition-colors"
                >
                  <Download size={14} />
                  Download QR
                </a>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 bg-[#f5c842] text-black rounded-xl text-sm font-semibold hover:bg-[#f5c842]/90 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
