import { NextRequest, NextResponse } from "next/server";
import { markPaymentSucceeded } from "@/lib/paymentLedger";

// Protected by the /api/admin/:path* matcher in src/middleware.ts (NextAuth).
// Confirms a pending cash payment was actually handed over.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payment = await markPaymentSucceeded(id);
    return NextResponse.json({ ok: true, payment });
  } catch (error) {
    console.error("Mark received error:", error);
    return NextResponse.json({ error: "Failed to mark payment received" }, { status: 500 });
  }
}
