"use client";

/**
 * QRIS static-to-dynamic converter.
 * Implements EMVCo TLV manipulation + CRC16-CCITT checksum.
 * Based on the qris-dinamis algorithm (MIT license).
 */

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
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

function tlvLength(value: string): string {
  return value.length.toString().padStart(2, "0");
}

function buildTLV(tag: string, value: string): string {
  return tag + tlvLength(value) + value;
}

export function convertQrisToDynamic(
  staticQris: string,
  amount: number
): string {
  // Remove existing CRC (last 8 chars: tag 63 + len 04 + 4 crc chars)
  const qrisWithoutCrc = staticQris.slice(0, -4);

  // Change Point of Initiation (tag 01) from "11" (static) to "12" (dynamic)
  let qris = qrisWithoutCrc.replace("010211", "010212");

  // Insert amount tag 54 before tag 58 (country code)
  const amountStr = Math.round(amount).toString();
  const amountTLV = buildTLV("54", amountStr);

  // Find position of tag 58 to insert before it
  const tag58Pos = qris.indexOf("5802");
  if (tag58Pos !== -1) {
    qris = qris.slice(0, tag58Pos) + amountTLV + qris.slice(tag58Pos);
  } else {
    // Fallback: append before CRC tag area (before last 63 tag)
    const tag63Pos = qris.lastIndexOf("6304");
    if (tag63Pos !== -1) {
      qris = qris.slice(0, tag63Pos) + amountTLV + qris.slice(tag63Pos);
    } else {
      qris = qris + amountTLV;
    }
  }

  // Remove old CRC tag and recalculate
  const withoutOldCrc = qris.endsWith("6304")
    ? qris
    : qris.replace(/6304[0-9A-Fa-f]{4}$/, "");

  const dataForCrc = withoutOldCrc + "6304";
  const checksum = crc16(dataForCrc);

  return dataForCrc + checksum;
}

export function isValidQris(qris: string): boolean {
  if (!qris || qris.length < 10) return false;
  // QRIS must start with 000201 (payload format indicator)
  return qris.startsWith("000201");
}
