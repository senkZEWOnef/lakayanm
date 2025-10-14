import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  let data = [];
  try {
    data = await prisma.departments.findMany({
      where: { is_published: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error('Database connection error:', error);
    // Return empty array to show page with error message
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      {data.length === 0 ? (
        <div className="card text-center">
          <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
          <p className="sub">
            We're having trouble connecting to our database right now. Please try again in a moment.
          </p>
        </div>
      ) : (
        <div className="grid-auto">
          {data.map((d) => (
            <Link key={d.id} href={`/dept/${d.slug}`} className="card hover:shadow-lg">
              {d.hero_url && <img src={d.hero_url} alt={d.name} className="w-full h-40 object-cover rounded-xl mb-3" />}
              <h3 className="font-semibold">{d.name}</h3>
              {d.intro && <p className="sub mt-1 line-clamp-2">{d.intro}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}