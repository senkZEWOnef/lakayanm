import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { isActive } = await request.json();
  const updated = await prisma.discount_codes.update({ where: { id }, data: { is_active: isActive } });
  return NextResponse.json({ ok: true, code: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.discount_codes.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
