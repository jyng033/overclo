import path from "node:path";
import { fileResponse, safePath } from "../../lib/file-response";

export const dynamic = "force-static";

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string[] }> }) {
  const { asset } = await params;
  const filePath = safePath(path.join(process.cwd(), "renewal"), asset);

  return fileResponse(filePath);
}
