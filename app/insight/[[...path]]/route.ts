import { NextRequest } from "next/server";

const INSIGHT_ORIGIN = "https://overclo-insight.pages.dev";

export const dynamic = "force-dynamic";

async function proxyInsight(
  request: NextRequest,
  params: Promise<{ path?: string[] }>,
  includeBody: boolean
) {
  const { path = [] } = await params;
  const sourceUrl = new URL(request.url);
  const lastSegment = path.at(-1) ?? "";
  const looksLikeFile = lastSegment.includes(".");
  const originPath =
    path.length === 0 ? "/" : `/${path.join("/")}${looksLikeFile ? "" : "/"}`;
  const upstreamUrl = new URL(originPath, INSIGHT_ORIGIN);
  upstreamUrl.search = sourceUrl.search;

  const upstream = await fetch(upstreamUrl, {
    redirect: "follow",
    headers: {
      "User-Agent": "overclo-site-proxy"
    },
    next: {
      revalidate: 60
    }
  });

  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  headers.delete("x-robots-tag");

  return new Response(includeBody ? upstream.body : null, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxyInsight(request, params, true);
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxyInsight(request, params, false);
}
