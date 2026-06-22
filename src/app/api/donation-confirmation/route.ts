import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("proof") as File | null;
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const amountRaw = (formData.get("amount") as string | null) ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const isAnonymous = formData.get("isAnonymous") === "true";

  const amount = parseInt(amountRaw.replace(/\D/g, ""), 10);

  if (!name) {
    return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
  }
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Nominal tidak valid" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "Bukti transfer wajib diunggah" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Format gambar tidak didukung" }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "Ukuran gambar terlalu besar (maks 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, filename), buffer);

  await db.donationConfirmation.create({
    data: {
      name,
      amount,
      message: message || null,
      isAnonymous,
      proofUrl: `/uploads/${filename}`,
    },
  });

  revalidatePath("/admin/donations");

  return NextResponse.json({ ok: true });
}
