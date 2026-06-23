"use client";

import { useState, type CSSProperties } from "react";
import { X, Download, QrCode, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { convertQrisToDynamic, isValidQris } from "@/lib/qris";
import QRCode from "qrcode";
import { Section, ProgressBar, PackageCard, Button, Badge } from "./ds";
import ConfirmDonationModal from "./ConfirmDonationModal";

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
  totalRaised: number;
  target: number;
  parallax?: string;
}

export default function PackagesSection({ packages, qrisString, totalRaised, target, parallax }: Props) {
  const [modal, setModal] = useState<{ pkg: Package; qrDataUrl: string } | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePick = async (pkg: Package) => {
    if (!qrisString || !isValidQris(qrisString)) {
      document.getElementById("donasi-langsung")?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <>
      <Section id="donasi" eyebrow="Dukung Film Ini" parallax={parallax} center>
        <div data-reveal style={{ marginBottom: "var(--space-12)" }}>
          <ProgressBar raised={totalRaised} target={target} />
        </div>

        {packages.length > 0 && (
          <>
            <p style={{ color: "var(--ink-60)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-6)" }}>
              Pilih paket dukungan yang pas buat kamu. Pembayaran lewat QRIS — gampang dan aman.
            </p>
            <div className="fg-pkg-grid">
              {packages.map((p, i) => {
                let benefits: string[] = [];
                try {
                  benefits = JSON.parse(p.benefits);
                } catch {}
                return (
                  <div data-reveal data-delay={String((i % 3) + 1)} key={p.id}>
                    <PackageCard
                      name={p.name}
                      amount={p.amount}
                      description={p.description}
                      benefits={benefits}
                      popular={i === 0}
                      onPick={() => handlePick(p)}
                    />
                  </div>
                );
              })}
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)", marginTop: "var(--space-4)" }}>{error}</p>}
            {loading && <p style={{ color: "var(--ink-50)", fontSize: "var(--text-sm)", marginTop: "var(--space-4)" }}>Membuat QR…</p>}
          </>
        )}
      </Section>

      {modal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)" }}
          onClick={() => setModal(null)}
        >
          <div className="fg-anim-fade" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
          <div
            className="fg-anim-scale"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "var(--fg-card)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-2xl)",
              padding: "var(--space-8)",
              maxWidth: "26rem",
              width: "100%",
              boxShadow: "var(--shadow-modal)",
            }}
          >
            <button
              onClick={() => setModal(null)}
              aria-label="Tutup"
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--ink-40)", cursor: "pointer", display: "flex" }}
            >
              <X size={20} />
            </button>
            <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
              <Badge variant="goldSoft" icon={<QrCode size={14} />}>
                QRIS Payment
              </Badge>
              <h3 style={{ color: "var(--ink)", fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"], fontSize: "var(--text-lg)", margin: "var(--space-4) 0 0" }}>
                {modal.pkg.name}
              </h3>
              <p style={{ color: "var(--gold)", fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"], fontSize: "var(--text-2xl)", margin: "0.25rem 0 0" }}>
                {formatRupiah(modal.pkg.amount)}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
              <div style={{ background: "#fff", padding: "1rem", borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-qr)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={modal.qrDataUrl} alt="QRIS QR Code" width={240} height={240} />
              </div>
              <p style={{ color: "var(--ink-40)", fontSize: "var(--text-xs)", textAlign: "center", margin: 0 }}>
                Scan dengan aplikasi mobile banking atau e-wallet apa pun.
              </p>
              <Button variant="ghostGold" pill={false} full onClick={() => setConfirm(true)} icon={<CheckCircle2 size={15} />}>
                Konfirmasi Donasi
              </Button>
              <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
                <Button
                  variant="secondary"
                  pill={false}
                  full
                  href={modal.qrDataUrl}
                  download={`qris-${modal.pkg.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                  icon={<Download size={14} />}
                >
                  Unduh QR
                </Button>
                <Button variant="primary" pill={false} full onClick={() => setModal(null)}>
                  Selesai
                </Button>
              </div>
            </div>
          </div>
          {confirm && (
            <ConfirmDonationModal
              defaultAmount={modal.pkg.amount}
              onClose={() => {
                setConfirm(false);
                setModal(null);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
