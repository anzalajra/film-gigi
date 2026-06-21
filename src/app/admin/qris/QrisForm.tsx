"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import Image from "next/image";
import { updateSiteConfig } from "../actions";
import {
  isValidQris,
  parseQRIS,
  validateQRIS,
  convertQRIS,
  decodeQRISFromImage,
  type QRISData,
  type ValidationResult,
} from "@/lib/qris";
import { formatRupiah } from "@/lib/utils";
import { Button, Card, Field, Textarea, Input, ToggleRow } from "@/components/admin/ui";
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  X,
  QrCode,
  Info,
  Zap,
  Settings,
} from "lucide-react";

interface Props {
  qrisString: string;
  qrisActive: boolean;
  qrisMinAmount: number;
  qrisImageUrl: string;
}

export default function QrisForm({
  qrisString: initial,
  qrisActive: initialActive,
  qrisMinAmount: initialMin,
  qrisImageUrl: initialImageUrl,
}: Props) {
  // ─── State ────────────────────────────────────────────────
  const [qrisString, setQrisString] = useState(initial);
  const [qrisActive, setQrisActive] = useState(initialActive);
  const [qrisMinAmount, setQrisMinAmount] = useState(initialMin);
  const [qrisImageUrl, setQrisImageUrl] = useState(initialImageUrl);
  const [saving, setSaving] = useState(false);

  // Parsed data
  const [parsedData, setParsedData] = useState<QRISData | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  // Image upload
  const [uploading, setUploading] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Testing
  const [testAmount, setTestAmount] = useState("50000");
  const [testFeeType, setTestFeeType] = useState<"none" | "fixed" | "percentage">("none");
  const [testFeeValue, setTestFeeValue] = useState("0");
  const [testQrDataUrl, setTestQrDataUrl] = useState<string | null>(null);
  const [testResultString, setTestResultString] = useState<string | null>(null);

  // Preview QR for original static
  const [staticQrPreview, setStaticQrPreview] = useState<string | null>(null);

  // ─── Effects ──────────────────────────────────────────────

  useEffect(() => {
    if (!qrisString) {
      setParsedData(null);
      setValidation(null);
      setStaticQrPreview(null);
      return;
    }

    const v = validateQRIS(qrisString);
    setValidation(v);

    if (v.valid) {
      setParsedData(parseQRIS(qrisString));
      QRCode.toDataURL(qrisString, { width: 200, margin: 2 })
        .then(setStaticQrPreview)
        .catch(() => setStaticQrPreview(null));
    } else {
      setParsedData(null);
      setStaticQrPreview(null);
    }
  }, [qrisString]);

  // ─── Handlers ─────────────────────────────────────────────

  const handleImageUpload = async (file: File) => {
    // 1. Upload image to server
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQrisImageUrl(data.url);

      // 2. Decode QR from image
      setDecoding(true);
      const decoded = await decodeQRISFromImage(file);
      if (decoded) {
        setQrisString(decoded);
        toast.success("QRIS berhasil dideteksi dari gambar");
      } else {
        toast.error("Tidak dapat membaca QR code dari gambar. Paste string manual.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      setDecoding(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageUpload(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteConfig({ qrisString, qrisActive, qrisMinAmount, qrisImageUrl });
      toast.success("Pengaturan QRIS disimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleTestGenerate = async () => {
    const amount = parseInt(testAmount, 10);
    if (!amount || amount <= 0) {
      toast.error("Masukkan nominal yang valid");
      return;
    }
    if (!isValidQris(qrisString)) {
      toast.error("String QRIS tidak valid");
      return;
    }

    try {
      const fee =
        testFeeType === "none"
          ? undefined
          : { type: testFeeType as "fixed" | "percentage", value: parseFloat(testFeeValue) || 0 };

      const result = convertQRIS(qrisString, { amount, fee });
      setTestResultString(result);

      const dataUrl = await QRCode.toDataURL(result, {
        width: 240,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setTestQrDataUrl(dataUrl);
    } catch {
      toast.error("Gagal generate QRIS dinamis");
    }
  };

  const valid = qrisString ? isValidQris(qrisString) : null;

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ═══ Section A: QRIS Input ═══ */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 text-white/80 font-semibold text-sm">
          <Upload size={16} className="text-[#f5c842]" />
          Input QRIS
        </div>

        {/* Image Upload Zone */}
        <div
          className="relative border-2 border-dashed border-white/12 bg-white/[0.02] rounded-xl p-6 text-center cursor-pointer hover:border-[#f5c842]/40 hover:bg-white/[0.03] transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
        >
          {qrisImageUrl ? (
            <div className="relative inline-block">
              <Image
                src={qrisImageUrl}
                alt="QRIS Asli"
                width={180}
                height={180}
                className="rounded-xl object-contain mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQrisImageUrl("");
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={12} />
              </button>
              <p className="text-white/40 text-xs mt-3">Klik untuk ganti gambar QRIS</p>
            </div>
          ) : (
            <div className="py-4">
              <QrCode size={32} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/50 text-sm font-medium">
                {uploading ? "Mengupload..." : decoding ? "Membaca QR code..." : "Upload gambar QRIS"}
              </p>
              <p className="text-white/25 text-xs mt-1">
                Drag & drop atau klik. String QRIS akan dideteksi otomatis.
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f);
          }}
        />

        {/* Manual String Input */}
        <Field
          label="String QRIS"
          hint="Atau paste string QRIS secara manual"
          error={validation && !validation.valid ? validation.errors[0] : undefined}
        >
          <Textarea
            value={qrisString}
            onChange={(e) => setQrisString(e.target.value.trim())}
            rows={3}
            placeholder="000201..."
            className="text-xs font-mono resize-none"
          />
          {validation?.valid && (
            <p className="flex items-center gap-1.5 text-green-400 text-xs mt-1.5">
              <CheckCircle2 size={13} /> QRIS valid — CRC16 checksum cocok
            </p>
          )}
        </Field>
      </Card>

      {/* ═══ Section B: Parsed Info ═══ */}
      {parsedData && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-white/80 font-semibold text-sm">
            <Info size={16} className="text-[#f5c842]" />
            Informasi QRIS
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Merchant" value={parsedData.merchantName} />
            <InfoItem label="Kota" value={parsedData.merchantCity} />
            <InfoItem label="Negara" value={parsedData.countryCode} />
            <InfoItem label="Kategori" value={parsedData.merchantCategoryCode} />
            <InfoItem label="Mata Uang" value={parsedData.currency === "360" ? "IDR" : parsedData.currency} />
            <InfoItem
              label="Metode"
              value={
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    parsedData.method === "static"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {parsedData.method === "static" ? "STATIS" : "DINAMIS"}
                </span>
              }
            />
            {parsedData.amount && (
              <InfoItem label="Nominal" value={`Rp ${parseInt(parsedData.amount).toLocaleString("id-ID")}`} />
            )}
          </div>

          {/* Merchant Account Info (issuers) */}
          {parsedData.merchantAccountInfo.length > 0 && (
            <div className="pt-3 border-t border-white/8">
              <p className="text-white/40 text-xs mb-2 font-medium">Issuer / Acquirer</p>
              <div className="flex flex-wrap gap-2">
                {parsedData.merchantAccountInfo.map((mai, idx) => (
                  <span
                    key={idx}
                    className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-white/60"
                    title={`Tag ${mai.tag}`}
                  >
                    {mai.globalId || `Tag ${mai.tag}`}
                    {mai.issuer && <span className="text-white/30 ml-1">· {mai.issuer}</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Static QR preview */}
          {staticQrPreview && (
            <div className="pt-3 border-t border-white/8">
              <p className="text-white/40 text-xs mb-3 font-medium">Preview QR Statis</p>
              <div className="bg-white p-3 rounded-xl inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={staticQrPreview} alt="QRIS Static Preview" width={160} height={160} />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ═══ Section C: Dynamic QRIS Testing ═══ */}
      {validation?.valid && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-white/80 font-semibold text-sm">
            <Zap size={16} className="text-[#f5c842]" />
            Test Konversi Dinamis
          </div>
          <p className="text-white/30 text-xs -mt-3">
            Test konversi QRIS statis → dinamis. Ini hanya preview, tidak memengaruhi storefront.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Nominal (Rp)">
              <Input
                type="number"
                value={testAmount}
                onChange={(e) => {
                  setTestAmount(e.target.value);
                  setTestQrDataUrl(null);
                  setTestResultString(null);
                }}
                min={1000}
                step={1000}
                placeholder="50000"
              />
            </Field>

            <Field label="Service Fee">
              <select
                value={testFeeType}
                onChange={(e) => {
                  setTestFeeType(e.target.value as "none" | "fixed" | "percentage");
                  setTestQrDataUrl(null);
                  setTestResultString(null);
                }}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5c842]/70"
              >
                <option value="none">Tanpa Fee</option>
                <option value="fixed">Fixed (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </Field>

            {testFeeType !== "none" && (
              <Field label={testFeeType === "fixed" ? "Nilai Fee (Rp)" : "Persentase (%)"}>
                <Input
                  type="number"
                  value={testFeeValue}
                  onChange={(e) => {
                    setTestFeeValue(e.target.value);
                    setTestQrDataUrl(null);
                    setTestResultString(null);
                  }}
                  min={0}
                  step={testFeeType === "fixed" ? 100 : 0.1}
                  placeholder={testFeeType === "fixed" ? "1000" : "2.5"}
                />
              </Field>
            )}
          </div>

          <Button onClick={handleTestGenerate}>
            Generate QRIS Dinamis
          </Button>

          {/* Test Result */}
          {testQrDataUrl && (
            <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row items-start gap-6">
              <div className="bg-white p-3 rounded-xl shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={testQrDataUrl} alt="Dynamic QRIS" width={200} height={200} />
              </div>
              <div className="space-y-3 min-w-0 flex-1">
                <div>
                  <p className="text-white/40 text-xs mb-1">Nominal</p>
                  <p className="text-[#f5c842] font-bold text-lg">
                    {formatRupiah(parseInt(testAmount))}
                  </p>
                </div>
                {testFeeType !== "none" && (
                  <div>
                    <p className="text-white/40 text-xs mb-1">Service Fee</p>
                    <p className="text-white/70 text-sm">
                      {testFeeType === "fixed"
                        ? formatRupiah(parseFloat(testFeeValue))
                        : `${testFeeValue}%`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-white/40 text-xs mb-1">String Dinamis</p>
                  <code className="block text-[10px] font-mono text-white/50 bg-white/[0.03] border border-white/8 rounded-lg p-2 break-all max-h-24 overflow-auto">
                    {testResultString}
                  </code>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ═══ Section D: Settings ═══ */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-2 text-white/80 font-semibold text-sm">
          <Settings size={16} className="text-[#f5c842]" />
          Pengaturan
        </div>

        <ToggleRow
          title="Aktifkan QRIS"
          description="Tampilkan QRIS di halaman publik"
          checked={qrisActive}
          onChange={setQrisActive}
        />

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

      {/* Validation errors detail */}
      {validation && !validation.valid && validation.errors.length > 1 && (
        <Card className="p-5">
          <div className="flex items-start gap-2 text-amber-400/80 text-sm mb-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span className="font-medium">Masalah validasi:</span>
          </div>
          <ul className="space-y-1 pl-6">
            {validation.errors.map((err, i) => (
              <li key={i} className="text-white/40 text-xs list-disc">{err}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

// ─── Helper Components ──────────────────────────────────────

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-white/80 text-sm font-medium">{typeof value === "string" ? value || "—" : value}</p>
    </div>
  );
}
