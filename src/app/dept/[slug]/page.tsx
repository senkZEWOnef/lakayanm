import Link from "next/link";
import Image from "next/image";
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
          We&apos;re having trouble connecting to our database right now. Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card relative overflow-hidden border-l-4 border-brand">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${dept.hero_url ?? ""})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-haiti-navy/10 via-transparent to-haiti-teal/10"></div>
        <div className="relative">
          <h1 className="hero-title text-brand">{dept.name}</h1>
          {dept.intro && <p className="sub mt-4 max-w-2xl text-lg">{dept.intro}</p>}
        </div>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">Cities & Towns</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        <div className="grid-auto">
          {cities.map((c) => (
            <Link key={c.id} href={`/dept/${dept.slug}/city/${c.slug}`} className="card hover:shadow-xl hover:border-brand/50 transition-all duration-300 group">
              {c.hero_url && (
                <div className="relative w-full h-40 mb-3 overflow-hidden rounded-xl">
                  <Image 
                    src={c.hero_url} 
                    alt={c.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg text-haiti-navy dark:text-haiti-turquoise">{c.name}</h3>
              {c.summary && <p className="sub mt-2 line-clamp-2">{c.summary}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}