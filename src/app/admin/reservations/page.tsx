import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

function formatCurrency(cents: number | null, currency = "usd") {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-green-500/10 text-green-600",
  completed: "bg-blue-500/10 text-blue-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export default async function ReservationsPage() {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const reservations = await prisma.reservations.findMany({
    include: { trip: true, assigned_employee: true },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Reservations</h1>
        <p className="sub mt-1">{reservations.length} total</p>
      </div>

      {reservations.length === 0 ? (
        <div className="card text-center py-12">
          <p className="sub">No reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <Link key={r.id} href={`/admin/reservations/${r.id}`} className="card flex items-center justify-between flex-wrap gap-3 hover:shadow-lg transition-shadow">
              <div>
                <p className="font-bold text-haiti-navy dark:text-haiti-turquoise">{r.trip.title}</p>
                <p className="text-sm sub">
                  {r.name} · {r.email} · {r.traveler_count} traveler{r.traveler_count > 1 ? "s" : ""}
                </p>
                {r.assigned_employee && <p className="text-xs sub mt-1">Assigned: {r.assigned_employee.name}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{formatCurrency(r.quoted_total_cents, r.trip.currency)}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[r.status] || "bg-gray-200 text-gray-700"}`}>
                  {r.status}
                </span>
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-800 capitalize">
                  {r.payment_status.replace("_", " ")}
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
