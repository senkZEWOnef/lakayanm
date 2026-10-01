import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

const ADMIN_LINKS = [
  { href: "/admin/packages", label: "📦 Packages" },
  { href: "/admin/reservations", label: "📋 Reservations" },
  { href: "/admin/discount-codes", label: "🏷️ Discount Codes" },
  { href: "/admin/payments", label: "💳 Payments" },
  { href: "/admin/employees", label: "👥 Employees" },
  { href: "/admin/access-codes", label: "🔑 Access Codes" },
  { href: "/admin/gallery", label: "🖼️ Gallery" },
  { href: "/admin/site-images", label: "🎨 Site Images" },
];

const STAFF_LINKS = [{ href: "/admin/my-trips", label: "🧭 My Trips" }];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=/admin/packages");
  }

  const isAdminUser = user.role === "admin";

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      <aside className="md:w-56 shrink-0">
        <nav className="card space-y-1 md:sticky md:top-4">
          {isAdminUser
            ? ADMIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-haiti-turquoise/10 hover:text-haiti-turquoise transition-colors"
                >
                  {link.label}
                </Link>
              ))
            : STAFF_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-haiti-turquoise/10 hover:text-haiti-turquoise transition-colors"
                >
                  {link.label}
                </Link>
              ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
