import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  // Prevent directory traversal
  if (segments.some((s) => s === ".." || s.includes("\0"))) {
    return NextResponse.json({ error: "Bad path" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", ...segments);

  try {
    const [buffer, info] = await Promise.all([readFile(filePath), stat(filePath)]);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
