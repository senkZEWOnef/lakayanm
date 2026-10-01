import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.role !== undefined) data.role = body.role;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.email !== undefined) data.email = body.email;
    if (body.photoUrl !== undefined) data.photo_url = body.photoUrl;
    if (body.isActive !== undefined) data.is_active = body.isActive;

    const employee = await prisma.employees.update({ where: { id }, data });
    return NextResponse.json({ ok: true, employee });
  } catch (error) {
    console.error("Employee update error:", error);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.employees.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Employee delete error:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
