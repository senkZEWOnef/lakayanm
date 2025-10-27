import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  let data: Array<{
    id: string;
    slug: string;
    name: string;
    intro: string | null;
    hero_url: string | null;
    is_published: boolean;
    created_at: Date;
  }> = [];
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
    <div className="space-y-8">
      <div className="card border-l-4 border-brand">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="hero-title text-brand">Haiti&apos;s 9 Departments</h1>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        <p className="sub text-lg max-w-2xl">
          Explore each of Haiti&apos;s unique departments, from the historic North to the scenic South. 
          Each region offers its own cultural treasures, culinary traditions, and stories.
        </p>
      </div>
      {data.length === 0 ? (
        <div className="card text-center">
          <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
          <p className="sub">
            We&apos;re having trouble connecting to our database right now. Please try again in a moment.
          </p>
        </div>
      ) : (
        <div className="grid-auto">
          {data.map((d) => (
            <Link key={d.id} href={`/dept/${d.slug}`} className="card hover:shadow-xl hover:border-brand/50 transition-all duration-300 group">
              {d.hero_url && (
                <div className="relative w-full h-40 mb-3 overflow-hidden rounded-xl">
                  <Image 
                    src={d.hero_url} 
                    alt={d.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg text-haiti-navy dark:text-haiti-turquoise">{d.name}</h3>
              {d.intro && <p className="sub mt-2 line-clamp-2">{d.intro}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}