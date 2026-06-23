"use client";

import { useState, useRef, type CSSProperties } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Button } from "./ds";

export default function ConfirmDonationModal({ defaultAmount, onClose }: { defaultAmount: number; onClose: () => void }) {
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
    if (!name.trim() && !isAnonymous) return setError("Nama wajib diisi.");
    if (!num || num <= 0) return setError("Nominal tidak valid.");
    if (!proof) return setError("Unggah bukti transfer QRIS.");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim() || "Anonim");
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

  const lbl: CSSProperties = {
    display: "block",
    color: "var(--ink-60)",
    fontSize: "var(--text-xs)",
    fontWeight: "var(--weight-medium)" as CSSProperties["fontWeight"],
    marginBottom: "0.4rem",
  };
  const fld: CSSProperties = {
    width: "100%",
    background: "var(--fg-card-soft)",
    border: "1px solid var(--line)",
    borderRadius: "var(--radius-xl)",
    padding: "0.65rem 0.9rem",
    color: "var(--ink)",
    fontSize: "var(--text-sm)",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--gutter)" }}>
      <div className="fg-anim-fade" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />
      <div
        className="fg-anim-scale"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "27rem",
          background: "var(--fg-card)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-modal)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.5rem", borderBottom: "1px solid var(--line-soft)" }}>
          <h3 style={{ color: "var(--ink)", fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"], margin: 0, fontSize: "var(--text-base)" }}>Konfirmasi Donasi</h3>
          <button onClick={onClose} aria-label="Tutup" style={{ background: "none", border: "none", color: "var(--ink-40)", cursor: "pointer", display: "flex", padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
            <CheckCircle2 size={40} color="var(--gold)" style={{ margin: "0 auto var(--space-4)" }} />
            <p style={{ color: "var(--ink)", fontWeight: "var(--weight-semibold)" as CSSProperties["fontWeight"], margin: "0 0 0.35rem" }}>Terima kasih!</p>
            <p style={{ color: "var(--ink-50)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-6)" }}>
              Konfirmasi donasimu telah kami terima dan akan diverifikasi oleh admin.
            </p>
            <Button variant="primary" pill={false} onClick={onClose}>Tutup</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem 1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <span style={lbl}>Bukti Transfer QRIS</span>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: "2px dashed var(--line-strong)", background: "var(--fg-card-soft)", borderRadius: "var(--radius-xl)", padding: "1rem", textAlign: "center", cursor: "pointer" }}
              >
                {proof ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={URL.createObjectURL(proof)} alt="Bukti" style={{ maxHeight: "10rem", width: "auto", margin: "0 auto", borderRadius: "var(--radius-md)", objectFit: "contain" }} />
                ) : (
                  <div style={{ padding: "0.75rem 0" }}>
                    <Upload size={22} color="var(--ink-30)" style={{ margin: "0 auto 0.5rem" }} />
                    <p style={{ color: "var(--ink-40)", fontSize: "var(--text-xs)", margin: 0 }}>Klik untuk unggah screenshot bukti</p>
                    <p style={{ color: "var(--ink-20)", fontSize: "var(--text-xs)", margin: "0.25rem 0 0" }}>PNG, JPG, WebP — Maks. 5MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setProof(e.target.files?.[0] ?? null)} />
            </div>
            <div>
              <span style={lbl}>Nama</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" style={fld} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", userSelect: "none" }}>
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--gold)" }} />
              <span style={{ color: "var(--ink-70)", fontSize: "var(--text-sm)" }}>Tampilkan sebagai Anonim</span>
            </label>
            <div>
              <span style={lbl}>Kata-kata / Ucapan</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Opsional" style={{ ...fld, resize: "vertical" }} />
            </div>
            <div>
              <span style={lbl}>Nominal</span>
              <input type="text" inputMode="numeric" value={amount ? formatRupiah(parseInt(amount.replace(/\D/g, "") || "0")) : ""} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="Nominal donasi" style={fld} />
            </div>
            {error && <p style={{ color: "var(--danger)", fontSize: "var(--text-sm)", margin: 0 }}>{error}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.25rem" }}>
              <Button variant="secondary" pill={false} size="sm" onClick={onClose} disabled={submitting}>Batal</Button>
              <Button variant="primary" pill={false} size="sm" type="submit" disabled={submitting}>{submitting ? "Mengirim…" : "Kirim Konfirmasi"}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
