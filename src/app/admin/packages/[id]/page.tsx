import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import PackageDetailsForm from "@/components/PackageDetailsForm";
import PackagePricingForm from "@/components/PackagePricingForm";
import PackageIncludesExcludes from "@/components/PackageIncludesExcludes";
import PackageDaysEditor from "@/components/PackageDaysEditor";
import PackageTeamAndCities from "@/components/PackageTeamAndCities";
import PackageDangerZone from "@/components/PackageDangerZone";

export default async function PackageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const { id } = await params;

  const trip = await prisma.trips.findUnique({
    where: { id },
    include: {
      days: { orderBy: { day_number: "asc" } },
      cities: true,
      assignments: true,
      department: true,
    },
  });

  if (!trip) return <div className="sub">Package not found.</div>;

  const [departments, cities, employees] = await Promise.all([
    prisma.departments.findMany({ orderBy: { name: "asc" } }),
    prisma.cities.findMany({ where: { department_id: trip.department_id }, orderBy: { name: "asc" } }),
    prisma.employees.findMany({ where: { is_active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/packages" className="text-brand hover:text-brand-dark text-sm">
          ← All Packages
        </Link>
        {trip.is_published && (
          <Link href={`/trips/${trip.slug}`} target="_blank" className="text-sm text-haiti-turquoise hover:underline">
            View live page →
          </Link>
        )}
      </div>

      <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">{trip.title}</h1>

      <PackageDetailsForm trip={trip} departments={departments} />
      <PackagePricingForm trip={trip} />
      <PackageIncludesExcludes trip={trip} />
      <PackageDaysEditor tripId={trip.id} days={trip.days} />
      <PackageTeamAndCities
        tripId={trip.id}
        cities={cities}
        employees={employees}
        selectedCityIds={trip.cities.map((c) => c.city_id)}
        selectedEmployeeIds={trip.assignments.map((a) => a.employee_id)}
      />
      <PackageDangerZone tripId={trip.id} />
    </div>
  );
}

export const dynamic = "force-dynamic";
