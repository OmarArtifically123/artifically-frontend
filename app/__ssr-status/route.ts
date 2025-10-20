import { NextResponse } from "next/server";
import { ssrStatusPayload } from "@/server/seo";

export const revalidate = 60;

export function GET() {
  const timestamp = new Date().toISOString();
  const payload = ssrStatusPayload({
    healthy: true,
    lastSuccessAt: timestamp,
    lastErrorAt: null,
    lastErrorMessage: null,
    lastFallbackAt: null,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "production",
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}