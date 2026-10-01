import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Replaces the full set of assigned employees for this trip.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { employeeIds } = await request.json();

    await prisma.trip_assignments.deleteMany({ where: { trip_id: id } });
    if (Array.isArray(employeeIds) && employeeIds.length > 0) {
      await prisma.trip_assignments.createMany({
        data: employeeIds.map((employeeId: string) => ({ trip_id: id, employee_id: employeeId })),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Trip assignments update error:", error);
    return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
  }
}
