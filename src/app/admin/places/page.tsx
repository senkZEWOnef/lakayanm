import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import PlaceCreateForm from "@/components/PlaceCreateForm";

const KIND_EMOJI: Record<string, string> = {
  hotel: "🏨",
  restaurant: "🍽️",
  shop: "🛍️",
  tour: "🧭",
  activity: "🎯",
  event: "🎉",
  beach: "🏖️",
  landmark: "🏛️",
};

export default async function AdminPlacesPage() {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const [places, departments] = await Promise.all([
    prisma.places.findMany({
      include: { city: { include: { department: true } } },
      orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
    }),
    prisma.departments.findMany({
      orderBy: { name: "asc" },
      include: { cities: { orderBy: { name: "asc" } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Discover Businesses</h1>
          <p className="sub mt-1">{places.length} listing{places.length === 1 ? "" : "s"} · hotels, restaurants, shops & more</p>
        </div>
        <PlaceCreateForm
          departments={departments.map((d) => ({ id: d.id, name: d.name, cities: d.cities.map((c) => ({ id: c.id, name: c.name })) }))}
        />
      </div>

      {places.length === 0 ? (
        <div className="card text-center py-12">
          <p className="sub">No businesses yet — add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {places.map((p) => (
            <Link key={p.id} href={`/admin/places/${p.id}`} className="card flex items-center justify-between flex-wrap gap-3 hover:shadow-lg transition-shadow">
              <div>
                <p className="font-bold text-haiti-navy dark:text-haiti-turquoise">
                  {KIND_EMOJI[p.kind] ?? "📍"} {p.name}
                </p>
                <p className="text-sm sub">
                  {p.city.department.name} · {p.city.name} · {p.kind}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {p.is_featured && <span className="text-xs px-3 py-1 rounded-full font-medium bg-haiti-coral/10 text-haiti-coral">Featured</span>}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.is_published ? "bg-green-500/10 text-green-600" : "bg-gray-200 text-gray-600 dark:bg-gray-700"}`}>
                  {p.is_published ? "Published" : "Draft"}
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
