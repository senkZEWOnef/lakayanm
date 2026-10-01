import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin, isStaff, getSessionUser } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  // Employees may only update status on reservations for trips they're
  // assigned to; admins can change anything.
  if (!(await isAdmin())) {
    if (!(await isStaff())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await getSessionUser();
    const employee = await prisma.employees.findUnique({ where: { user_id: user?.id } });
    const reservation = await prisma.reservations.findUnique({ where: { id } });
    if (!employee || !reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const assigned = await prisma.trip_assignments.findUnique({
      where: { trip_id_employee_id: { trip_id: reservation.trip_id, employee_id: employee.id } },
    });
    if (!assigned) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updated = await prisma.reservations.update({ where: { id }, data: { status: body.status } });
    return NextResponse.json({ ok: true, reservation: updated });
  }

  try {
    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.assignedEmployeeId !== undefined) data.assigned_employee_id = body.assignedEmployeeId || null;

    const updated = await prisma.reservations.update({ where: { id }, data });
    return NextResponse.json({ ok: true, reservation: updated });
  } catch (error) {
    console.error("Reservation update error:", error);
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}
