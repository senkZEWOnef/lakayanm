import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import PlaceEditForm from "@/components/PlaceEditForm";

export default async function PlaceEditorPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const { id } = await params;
  const place = await prisma.places.findUnique({
    where: { id },
    include: { city: { include: { department: true } } },
  });

  if (!place) return <div className="sub">Business not found.</div>;

  const departments = await prisma.departments.findMany({
    orderBy: { name: "asc" },
    include: { cities: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/admin/places" className="text-brand hover:text-brand-dark text-sm">
          ← All Businesses
        </Link>
        {place.is_published && (
          <Link href="/discover" target="_blank" className="text-sm text-haiti-turquoise hover:underline">
            View on Discover →
          </Link>
        )}
      </div>

      <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">{place.name}</h1>

      <PlaceEditForm
        place={place}
        departments={departments.map((d) => ({ id: d.id, name: d.name, cities: d.cities.map((c) => ({ id: c.id, name: c.name })) }))}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
