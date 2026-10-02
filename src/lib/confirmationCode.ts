import { prisma } from "@/lib/db";

// Short, human-typeable codes — excludes ambiguous characters (0/O, 1/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

// e.g. "LKYM-7F3K" — retries on the rare collision.
export async function generateConfirmationCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = `LKYM-${randomSegment(4)}`;
    const existing = await prisma.reservations.findUnique({ where: { confirmation_code: code } });
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique confirmation code");
}

export function normalizeConfirmationCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
