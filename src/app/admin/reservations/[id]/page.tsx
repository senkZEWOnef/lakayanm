import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import ReservationActions from "@/components/ReservationActions";
import PaymentHistoryList from "@/components/PaymentHistoryList";
import AdminMessageThread from "@/components/AdminMessageThread";

function formatCurrency(cents: number | null, currency = "usd") {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const { id } = await params;
  const reservation = await prisma.reservations.findUnique({
    where: { id },
    include: {
      trip: true,
      assigned_employee: true,
      payments: { orderBy: { created_at: "desc" } },
      messages: { orderBy: { created_at: "asc" } },
    },
  });

  if (!reservation) return <div className="sub">Reservation not found.</div>;

  const employees = await prisma.employees.findMany({ where: { is_active: true }, orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <Link href="/admin/reservations" className="text-brand hover:text-brand-dark text-sm">
        ← All Reservations
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">{reservation.trip.title}</h1>
        <p className="sub mt-1">
          Requested {new Date(reservation.created_at).toLocaleString()}
          {reservation.confirmation_code && (
            <>
              {" "}
              · Trip code: <span className="font-mono">{reservation.confirmation_code}</span>
            </>
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-2">
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Traveler</h3>
            <p>
              <strong>{reservation.name}</strong> · {reservation.email}
              {reservation.phone ? ` · ${reservation.phone}` : ""}
            </p>
            <p className="text-sm sub">
              {reservation.traveler_count} traveler{reservation.traveler_count > 1 ? "s" : ""} ·{" "}
              {reservation.flexible_dates
                ? "Flexible dates"
                : reservation.preferred_start_date
                  ? new Date(reservation.preferred_start_date).toLocaleDateString()
                  : "No date given"}
            </p>
            {reservation.message && <p className="text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">{reservation.message}</p>}
          </div>

          <div className="card">
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-3">Pricing</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="sub text-xs">Quoted total</p>
                <p className="font-medium">{formatCurrency(reservation.quoted_total_cents, reservation.trip.currency)}</p>
              </div>
              <div>
                <p className="sub text-xs">Deposit due</p>
                <p className="font-medium">{formatCurrency(reservation.deposit_due_cents, reservation.trip.currency)}</p>
              </div>
              <div>
                <p className="sub text-xs">Amount paid</p>
                <p className="font-medium">{formatCurrency(reservation.amount_paid_cents, reservation.trip.currency)}</p>
              </div>
              <div>
                <p className="sub text-xs">Discount code</p>
                <p className="font-medium">{reservation.discount_code || "—"}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-3">Payment History</h3>
            <PaymentHistoryList payments={reservation.payments} />
          </div>

          <AdminMessageThread reservationId={reservation.id} messages={reservation.messages} />
        </div>

        <div>
          <ReservationActions
            reservationId={reservation.id}
            status={reservation.status}
            assignedEmployeeId={reservation.assigned_employee_id}
            employees={employees}
            paymentStatus={reservation.payment_status}
            depositDueCents={reservation.deposit_due_cents}
            currency={reservation.trip.currency}
          />
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
