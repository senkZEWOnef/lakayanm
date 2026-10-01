import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user) return null;
  return user;
}

// Admin-only pages/routes call this and render/return nothing further if it's false.
export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "admin";
}

// Admin or employee (any authenticated staff account) — used by the shared
// admin layout and the employee-facing "My Trips" view.
export async function isStaff(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "admin" || user?.role === "employee";
}
