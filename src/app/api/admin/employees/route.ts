import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const employees = await prisma.employees.findMany({
    include: { assignments: { include: { trip: true } } },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json({ employees });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, phone, email, photoUrl } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "name and role are required" }, { status: 400 });
    }

    const employee = await prisma.employees.create({
      data: { name, role, phone: phone || null, email: email || null, photo_url: photoUrl || null },
    });

    return NextResponse.json({ ok: true, employee });
  } catch (error) {
    console.error("Employee create error:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
