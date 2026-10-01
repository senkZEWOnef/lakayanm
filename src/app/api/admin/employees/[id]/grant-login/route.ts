import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomUUID, randomBytes } from "crypto";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employee = await prisma.employees.findUnique({ where: { id } });
    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    if (employee.user_id) return NextResponse.json({ error: "Already has login access" }, { status: 400 });
    if (!employee.email) return NextResponse.json({ error: "Employee needs an email first" }, { status: 400 });

    const existingUser = await prisma.users.findUnique({ where: { email: employee.email } });
    if (existingUser) return NextResponse.json({ error: "That email already has an account" }, { status: 400 });

    const password = randomBytes(9).toString("base64").replace(/[+/=]/g, "").slice(0, 12);
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: employee.email,
        password: hashed,
        name: employee.name,
        role: "employee",
        updated_at: new Date(),
      },
    });

    await prisma.employees.update({ where: { id }, data: { user_id: user.id } });

    return NextResponse.json({ ok: true, email: employee.email, password });
  } catch (error) {
    console.error("Grant login error:", error);
    return NextResponse.json({ error: "Failed to grant login" }, { status: 500 });
  }
}
