import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

// Serves files from public/uploads with an explicit content-type and an
// inline content-disposition, so PDFs render in the browser instead of
// triggering a download (the default behaviour for runtime-written files
// in a standalone build can be wrong).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const safe = path.basename(name); // strip any path traversal

  const filePath = path.join(process.cwd(), "public", "uploads", safe);

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = safe.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME[ext] ?? "application/octet-stream";
  const download = _req.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(safe)}`,
      "Content-Length": data.length.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
