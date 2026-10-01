import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import StaffStatusSelect from "@/components/StaffStatusSelect";

export default async function MyTripsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/signin?callbackUrl=/admin/my-trips");

  const employee = await prisma.employees.findUnique({ where: { user_id: user.id } });

  if (!employee) {
    return (
      <div className="card text-center py-12">
        <p className="sub">
          {user.role === "admin"
            ? "You're signed in as an admin — use the sidebar to manage everything."
            : "No employee profile is linked to your account yet."}
        </p>
      </div>
    );
  }

  const assignments = await prisma.trip_assignments.findMany({ where: { employee_id: employee.id }, select: { trip_id: true } });
  const tripIds = assignments.map((a) => a.trip_id);

  const reservations = tripIds.length
    ? await prisma.reservations.findMany({ where: { trip_id: { in: tripIds } }, include: { trip: true }, orderBy: { created_at: "desc" } })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">My Trips</h1>
        <p className="sub mt-1">Reservations for the packages you&apos;re assigned to.</p>
      </div>

      {reservations.length === 0 ? (
        <div className="card text-center py-12">
          <p className="sub">No reservations for your assigned trips yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="card flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold text-haiti-navy dark:text-haiti-turquoise">{r.trip.title}</p>
                <p className="text-sm sub">
                  {r.name} · {r.traveler_count} traveler{r.traveler_count > 1 ? "s" : ""} ·{" "}
                  {r.flexible_dates ? "Flexible dates" : r.preferred_start_date ? new Date(r.preferred_start_date).toLocaleDateString() : "No date"}
                </p>
              </div>
              <StaffStatusSelect reservationId={r.id} status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
