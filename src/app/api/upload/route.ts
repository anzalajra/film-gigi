import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

async function fileExists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const isPdf = file.type === "application/pdf";
  const maxSize = isPdf ? 20 * 1024 * 1024 : 5 * 1024 * 1024; // 20MB pdf, 5MB image
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large (max ${isPdf ? "20MB" : "5MB"})` },
      { status: 400 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Keep the original file name (only sanitise characters that are unsafe for
  // URLs / the filesystem) instead of renaming to a random id.
  const original = file.name || "file";
  const dot = original.lastIndexOf(".");
  const rawBase = dot > 0 ? original.slice(0, dot) : original;
  const ext = (dot > 0 ? original.slice(dot + 1) : "").toLowerCase() || (isPdf ? "pdf" : "jpg");

  const safeBase =
    rawBase
      .normalize("NFKD")
      .replace(/[^\w.\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "-") || "file";

  // Avoid silently overwriting a different file that has the same name.
  let filename = `${safeBase}.${ext}`;
  let n = 1;
  while (await fileExists(path.join(uploadDir, filename))) {
    filename = `${safeBase}-${n}.${ext}`;
    n++;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
