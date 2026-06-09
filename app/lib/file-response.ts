import { readFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf"
};

export async function fileResponse(filePath: string, contentType?: string) {
  const bytes = await readFile(filePath);
  const type = contentType ?? CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

  return new Response(bytes, {
    headers: {
      "content-type": type,
      "cache-control": type.startsWith("text/html")
        ? "no-cache"
        : "public, max-age=31536000, immutable"
    }
  });
}

export function safePath(root: string, segments: string[]) {
  const target = path.join(root, ...segments);
  const normalizedRoot = path.resolve(root);
  const normalizedTarget = path.resolve(target);

  if (normalizedTarget !== normalizedRoot && !normalizedTarget.startsWith(normalizedRoot + path.sep)) {
    throw new Error("Invalid path");
  }

  return normalizedTarget;
}
