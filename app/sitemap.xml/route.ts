import path from "node:path";
import { fileResponse } from "../lib/file-response";

export const dynamic = "force-static";

export async function GET() {
  return fileResponse(path.join(process.cwd(), "sitemap.xml"), "application/xml; charset=utf-8");
}
