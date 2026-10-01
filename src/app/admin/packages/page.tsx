import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import PackageCreateForm from "@/components/PackageCreateForm";

function formatCurrency(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default async function PackagesPage() {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const [trips, departments] = await Promise.all([
    prisma.trips.findMany({ include: { department: true, _count: { select: { reservations: true } } }, orderBy: { created_at: "desc" } }),
    prisma.departments.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Packages</h1>
          <p className="sub mt-1">{trips.length} package{trips.length === 1 ? "" : "s"}</p>
        </div>
        <PackageCreateForm departments={departments} />
      </div>

      {trips.length === 0 ? (
        <div className="card text-center py-12">
          <p className="sub">No packages yet — create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((t) => (
            <Link key={t.id} href={`/admin/packages/${t.id}`} className="card flex items-center justify-between flex-wrap gap-3 hover:shadow-lg transition-shadow">
              <div>
                <p className="font-bold text-haiti-navy dark:text-haiti-turquoise">{t.title}</p>
                <p className="text-sm sub">
                  {t.department.name} · {t.duration_days} day{t.duration_days > 1 ? "s" : ""} · {t._count.reservations} reservation
                  {t._count.reservations === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{formatCurrency(t.price_individual_cents, t.currency)}/person</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${t.is_published ? "bg-green-500/10 text-green-600" : "bg-gray-200 text-gray-600 dark:bg-gray-700"}`}>
                  {t.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
