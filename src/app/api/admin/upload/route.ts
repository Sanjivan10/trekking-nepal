import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { sameOrigin } from "@/lib/security";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/**
 * Saves an uploaded image and returns its public URL.
 *
 * Two storage backends, chosen automatically:
 *
 *   Vercel Blob  — used whenever BLOB_READ_WRITE_TOKEN is present. Required in
 *                  production: Vercel's filesystem is read-only, so the old
 *                  implementation (writing to public/uploads) returned a 500 on
 *                  every upload and the admin Upload button silently never
 *                  worked once deployed.
 *   Local disk   — fallback for `next dev` / self-hosting, where public/uploads
 *                  is writable and survives.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Image must be 8 MB or smaller (this one is ${(file.size / 1048576).toFixed(1)} MB).` },
      { status: 413 },
    );
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WebP, AVIF, GIF and SVG files are allowed." },
      { status: 415 },
    );
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const filename = `${base}-${randomUUID().slice(0, 8)}.${extension}`;

  // ---- Production: Vercel Blob ----
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url, filename, size: file.size });
    } catch (error) {
      console.error("[upload] Vercel Blob failed", error);
      return NextResponse.json(
        { error: "Upload to blob storage failed. Check the Blob store is connected in Vercel." },
        { status: 502 },
      );
    }
  }

  // ---- Local development: write to public/uploads ----
  try {
    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${filename}`, filename, size: file.size });
  } catch (error) {
    console.error("[upload] local write failed", error);
    return NextResponse.json(
      {
        error:
          "Could not save the file. On Vercel this means no Blob store is connected — add one under Storage, then redeploy.",
      },
      { status: 500 },
    );
  }
}
