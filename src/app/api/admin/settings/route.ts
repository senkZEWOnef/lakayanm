import { NextRequest, NextResponse } from "next/server";
import { getUsdToHtgRate, setUsdToHtgRate } from "@/lib/settings";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
export async function GET() {
  const rate = await getUsdToHtgRate();
  return NextResponse.json({ usdToHtgRate: rate });
}

export async function POST(request: NextRequest) {
  try {
    const { usdToHtgRate } = await request.json();
    const rate = parseFloat(usdToHtgRate);
    if (!Number.isFinite(rate) || rate <= 0) {
      return NextResponse.json({ error: "Rate must be a positive number" }, { status: 400 });
    }
    await setUsdToHtgRate(rate);
    return NextResponse.json({ ok: true, usdToHtgRate: rate });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update rate" }, { status: 500 });
  }
}
