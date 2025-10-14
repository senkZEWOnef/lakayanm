import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let dept = null;
  let cities = [];
  
  try {
    dept = await prisma.departments.findUnique({ where: { slug } });
    if (!dept || !dept.is_published) return <div className="sub">Department not found.</div>;

    cities = await prisma.cities.findMany({
      where: { department_id: dept.id, is_published: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return (
      <div className="card text-center">
        <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
        <p className="sub">
          We're having trouble connecting to our database right now. Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${dept.hero_url ?? ""})` }} />
        <div className="relative">
          <h1 className="hero-title">{dept.name}</h1>
          {dept.intro && <p className="sub mt-2 max-w-2xl">{dept.intro}</p>}
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Cities</h2>
        <div className="grid-auto">
          {cities.map((c) => (
            <Link key={c.id} href={`/dept/${dept.slug}/city/${c.slug}`} className="card hover:shadow-lg">
              {c.hero_url && <img src={c.hero_url} alt={c.name} className="w-full h-40 object-cover rounded-xl mb-3" />}
              <h3 className="font-semibold">{c.name}</h3>
              {c.summary && <p className="sub mt-1 line-clamp-2">{c.summary}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}