"use client";

/**
 * Full-featured QRIS library.
 * Implements EMVCo TLV parsing, validation, static→dynamic conversion,
 * and QR image decoding.
 *
 * Based on the qris-dinamis algorithm (MIT license).
 * @see https://github.com/verssache/qris-dinamis
 */

import jsQR from "jsqr";

// ─── Types ────────────────────────────────────────────────────

export interface TLV {
  tag: string;
  name: string;
  length: number;
  value: string;
  children?: TLV[];
}

export interface QRISData {
  version: string;
  method: "static" | "dynamic";
  merchantAccountInfo: MerchantAccountInfo[];
  merchantCategoryCode: string;
  currency: string;
  amount?: string;
  tipIndicator?: "prompt" | "fixed" | "percentage";
  tipFixed?: string;
  tipPercentage?: string;
  merchantName: string;
  merchantCity: string;
  postalCode?: string;
  countryCode: string;
  crc: string;
  raw: TLV[];
}

export interface MerchantAccountInfo {
  tag: string;
  globalId: string;
  issuer?: string;
  merchantId?: string;
  raw: TLV[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ConvertOptions {
  amount: number;
  fee?: {
    type: "fixed" | "percentage";
    value: number;
  };
}

// ─── Tag Names ────────────────────────────────────────────────

const TAG_NAMES: Record<string, string> = {
  "00": "Payload Format Indicator",
  "01": "Point of Initiation Method",
  "02": "Visa",
  "03": "Mastercard",
  "04": "Mastercard",
  "15": "Visa",
  "52": "Merchant Category Code",
  "53": "Transaction Currency",
  "54": "Transaction Amount",
  "55": "Tip or Convenience Indicator",
  "56": "Value of Convenience Fee Fixed",
  "57": "Value of Convenience Fee Percentage",
  "58": "Country Code",
  "59": "Merchant Name",
  "60": "Merchant City",
  "61": "Postal Code",
  "62": "Additional Data Field",
  "63": "CRC",
};

// Tags 26-51 are all Merchant Account Information
for (let i = 26; i <= 51; i++) {
  TAG_NAMES[i.toString().padStart(2, "0")] = "Merchant Account Information";
}

// ─── CRC16-CCITT ──────────────────────────────────────────────

export function calculateCRC16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// ─── TLV Parser ───────────────────────────────────────────────

export function parseTLV(data: string): TLV[] {
  const elements: TLV[] = [];
  let i = 0;

  while (i < data.length) {
    if (i + 4 > data.length) break;

    const tag = data.substring(i, i + 2);
    const length = parseInt(data.substring(i + 2, i + 4), 10);
    if (isNaN(length)) break;

    const value = data.substring(i + 4, i + 4 + length);
    const name = TAG_NAMES[tag] || `Unknown (${tag})`;

    const element: TLV = { tag, name, length, value };

    // Merchant Account Info tags (26-51) and Additional Data (62) have sub-TLVs
    const tagNum = parseInt(tag, 10);
    if ((tagNum >= 26 && tagNum <= 51) || tag === "62") {
      element.children = parseTLV(value);
    }

    elements.push(element);
    i += 4 + length;
  }

  return elements;
}

// ─── QRIS Parser ──────────────────────────────────────────────

export function parseQRIS(qrisString: string): QRISData {
  const raw = parseTLV(qrisString);

  const find = (tag: string) => raw.find((e) => e.tag === tag);

  const method = find("01")?.value === "12" ? "dynamic" : "static";

  // Parse merchant account info (tags 26-51)
  const merchantAccountInfo: MerchantAccountInfo[] = raw
    .filter((e) => {
      const t = parseInt(e.tag, 10);
      return t >= 26 && t <= 51;
    })
    .map((e) => {
      const children = e.children || [];
      return {
        tag: e.tag,
        globalId: children.find((c) => c.tag === "00")?.value || "",
        issuer: children.find((c) => c.tag === "01")?.value,
        merchantId: children.find((c) => c.tag === "02")?.value,
        raw: children,
      };
    });

  // Tip indicator
  let tipIndicator: QRISData["tipIndicator"];
  const tipTag = find("55")?.value;
  if (tipTag === "01") tipIndicator = "prompt";
  else if (tipTag === "02") tipIndicator = "fixed";
  else if (tipTag === "03") tipIndicator = "percentage";

  return {
    version: find("00")?.value || "",
    method,
    merchantAccountInfo,
    merchantCategoryCode: find("52")?.value || "",
    currency: find("53")?.value || "",
    amount: find("54")?.value,
    tipIndicator,
    tipFixed: find("56")?.value,
    tipPercentage: find("57")?.value,
    merchantName: find("59")?.value || "",
    merchantCity: find("60")?.value || "",
    postalCode: find("61")?.value,
    countryCode: find("58")?.value || "",
    crc: find("63")?.value || "",
    raw,
  };
}

// ─── Validator ────────────────────────────────────────────────

export function validateQRIS(qrisString: string): ValidationResult {
  const errors: string[] = [];

  if (!qrisString || qrisString.trim().length === 0) {
    return { valid: false, errors: ["QRIS string kosong"] };
  }

  const str = qrisString.trim();

  if (!str.startsWith("000201")) {
    errors.push('QRIS harus diawali dengan "000201"');
  }

  if (str.length < 20) {
    errors.push("QRIS string terlalu pendek");
    return { valid: false, errors };
  }

  // CRC validation
  const dataWithoutCRC = str.substring(0, str.length - 4);
  const declaredCRC = str.substring(str.length - 4);
  const calculatedCRC = calculateCRC16(dataWithoutCRC);

  if (declaredCRC.toUpperCase() !== calculatedCRC) {
    errors.push(`CRC tidak cocok: expected ${calculatedCRC}, got ${declaredCRC.toUpperCase()}`);
  }

  // Check required tags
  const raw = parseTLV(str);
  const tags = new Set(raw.map((e) => e.tag));

  if (!tags.has("00")) errors.push("Tag 00 (Payload Format Indicator) tidak ditemukan");
  if (!tags.has("01")) errors.push("Tag 01 (Point of Initiation Method) tidak ditemukan");
  if (!tags.has("52")) errors.push("Tag 52 (Merchant Category Code) tidak ditemukan");
  if (!tags.has("53")) errors.push("Tag 53 (Transaction Currency) tidak ditemukan");
  if (!tags.has("58")) errors.push("Tag 58 (Country Code) tidak ditemukan");
  if (!tags.has("59")) errors.push("Tag 59 (Merchant Name) tidak ditemukan");
  if (!tags.has("60")) errors.push("Tag 60 (Merchant City) tidak ditemukan");
  if (!tags.has("63")) errors.push("Tag 63 (CRC) tidak ditemukan");

  return { valid: errors.length === 0, errors };
}

// ─── Converter ────────────────────────────────────────────────

function buildTLVString(elements: TLV[]): string {
  return elements
    .map((el) => {
      const value = el.children ? buildTLVString(el.children) : el.value;
      const length = value.length.toString().padStart(2, "0");
      return `${el.tag}${length}${value}`;
    })
    .join("");
}

function makeTLV(tag: string, value: string, name = ""): TLV {
  return { tag, name, length: value.length, value };
}

export function convertQRIS(qrisString: string, options: ConvertOptions): string {
  const elements = parseTLV(qrisString);

  // 1. Change Point of Initiation Method from "11" (static) to "12" (dynamic)
  const poiElement = elements.find((e) => e.tag === "01");
  if (poiElement) {
    poiElement.value = "12";
  }

  // 2. Remove existing amount, tip tags, and CRC
  const filtered = elements.filter(
    (e) => !["54", "55", "56", "57", "63"].includes(e.tag)
  );

  // 3. Insert amount (tag 54) before tag 58 (country code)
  const amountStr = Math.round(options.amount).toString();
  const tag58Index = filtered.findIndex((e) => e.tag === "58");
  const insertIndex = tag58Index !== -1 ? tag58Index : filtered.length;
  filtered.splice(insertIndex, 0, makeTLV("54", amountStr, "Transaction Amount"));

  // 4. Insert fee tags if provided
  if (options.fee) {
    const feeInsertIndex = filtered.findIndex((e) => e.tag === "58");
    const fIdx = feeInsertIndex !== -1 ? feeInsertIndex : filtered.length;

    if (options.fee.type === "fixed") {
      filtered.splice(fIdx, 0,
        makeTLV("55", "02", "Tip Indicator"),
        makeTLV("56", options.fee.value.toString(), "Fixed Fee")
      );
    } else {
      filtered.splice(fIdx, 0,
        makeTLV("55", "03", "Tip Indicator"),
        makeTLV("57", options.fee.value.toString(), "Percentage Fee")
      );
    }
  }

  // 5. Rebuild string and recalculate CRC
  const dataStr = buildTLVString(filtered) + "6304";
  const crc = calculateCRC16(dataStr);

  return dataStr + crc;
}

// ─── Backward-compat wrapper ──────────────────────────────────

export function convertQrisToDynamic(staticQris: string, amount: number): string {
  return convertQRIS(staticQris, { amount });
}

// ─── Simple validation check ─────────────────────────────────

export function isValidQris(qris: string): boolean {
  if (!qris || qris.length < 10) return false;
  return qris.startsWith("000201");
}

// ─── QR Image Decoder ─────────────────────────────────────────

export function decodeQRISFromImage(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        resolve(code?.data || null);
      };
      img.onerror = () => resolve(null);
      img.src = reader.result as string;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
