"use client";

import { useState, type CSSProperties } from "react";
import { convertQrisToDynamic, isValidQris } from "@/lib/qris";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import QRCode from "qrcode";
import { Section, Button } from "./ds";
import ConfirmDonationModal from "./ConfirmDonationModal";

interface Props {
  qrisString: string;
  minAmount: number;
}

const QUICK_AMOUNTS = [25000, 50000, 100000, 250000, 500000];
const CHIP_COLORS = ["var(--k-teal)", "var(--k-orange)", "var(--k-blue)", "var(--k-magenta)", "var(--k-green)"];

export default function QrisSection({ qrisString, minAmount }: Props) {
  const [amount, setAmount] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAmount, setLastAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

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
      const dataUrl = await QRCode.toDataURL(dynamic, { width: 280, margin: 2, color: { dark: "#000000", light: "#ffffff" } });
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

  const inputStyle: CSSProperties = {
    flex: 1,
    background: "var(--fg-card-soft)",
    border: "1px solid var(--line-strong)",
    borderRadius: "var(--radius-xl)",
    padding: "0.8rem 1rem",
    color: "var(--ink)",
    fontSize: "var(--text-sm)",
    outline: "none",
  };

  return (
    <Section id="donasi-langsung" eyebrow="Donasi Langsung" band center narrow>
      <h2 style={{ font: "var(--type-h2)", color: "var(--ink)", margin: "0 0 var(--space-3)" } as CSSProperties}>Pilih nominalmu</h2>
      <p style={{ color: "var(--ink-50)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-8)" }}>
        Scan QRIS untuk berdonasi berapa pun. Setiap dukungan sangat berarti.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
          {QUICK_AMOUNTS.map((a, i) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(String(a));
                generateQR(a);
              }}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "var(--text-xs)",
                border: "1px solid var(--line-strong)",
                borderRadius: "var(--radius-pill)",
                color: "var(--ink-70)",
                background: "transparent",
                cursor: "pointer",
                transition: "all var(--dur-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = CHIP_COLORS[i];
                e.currentTarget.style.color = CHIP_COLORS[i];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--line-strong)";
                e.currentTarget.style.color = "var(--ink-70)";
              }}
            >
              {formatRupiah(a)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            inputMode="numeric"
            placeholder={`Min. ${formatRupiah(minAmount)}`}
            value={amount ? formatRupiah(parseInt(amount.replace(/\D/g, "") || "0")) : ""}
            onChange={(e) => {
              setAmount(e.target.value.replace(/\D/g, ""));
              setQrDataUrl(null);
            }}
            style={inputStyle}
          />
          <Button variant="primary" pill={false} type="submit" disabled={loading}>
            {loading ? "..." : "Buat QR"}
          </Button>
        </div>
        {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)", margin: 0 }}>{error}</p>}
      </form>

      {qrDataUrl && (
        <div className="fg-anim-scale" style={{ marginTop: "var(--space-8)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ background: "#fff", padding: "1rem", borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-qr)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QRIS QR Code" width={240} height={240} />
          </div>
          <p style={{ color: "var(--gold)", fontWeight: "var(--weight-bold)" as CSSProperties["fontWeight"], fontSize: "var(--text-xl)", margin: 0 }}>
            {formatRupiah(lastAmount)}
          </p>
          <p style={{ color: "var(--ink-40)", fontSize: "var(--text-xs)", margin: 0 }}>
            Scan dengan aplikasi mobile banking / e-wallet apa pun
          </p>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "var(--space-6)", marginTop: "var(--space-2)", width: "100%", textAlign: "center" }}>
            <p style={{ color: "var(--ink-50)", fontSize: "var(--text-xs)", margin: "0 0 var(--space-3)" }}>
              Sudah transfer? Bantu kami catat donasimu.
            </p>
            <Button variant="ghostGold" pill={false} onClick={() => setShowConfirm(true)} icon={<CheckCircle2 size={16} />}>
              Konfirmasi Donasi
            </Button>
          </div>
        </div>
      )}

      {showConfirm && <ConfirmDonationModal defaultAmount={lastAmount} onClose={() => setShowConfirm(false)} />}
    </Section>
  );
}
