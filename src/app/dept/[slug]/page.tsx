import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import DepartmentShape from "@/components/DepartmentShape";

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
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/banner.png"
          alt="Haiti landscape"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-slate-800/60 dark:bg-slate-900/80"></div>
      </div>

      <div className="relative z-10 space-y-8 md:space-y-12 px-4 md:px-6 py-8 md:py-12">
        {/* Department Header */}
        <div className="relative bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 md:p-8 overflow-hidden">
          {dept.hero_url && (
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${dept.hero_url})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-400/5"></div>
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 md:mb-6">
              {dept.name}
            </h1>
            {dept.intro && (
              <p className="text-white/90 mt-4 max-w-3xl text-base md:text-lg leading-relaxed">
                {dept.intro}
              </p>
            )}
          </div>
        </div>

        {/* Department Map Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Department Shape */}
          <div className="lg:w-1/3">
            <DepartmentShape 
              departmentSlug={dept.slug}
              basePath={`/dept/${dept.slug}/city`}
              showCities={true}
            />
          </div>

          {/* Cities Section */}
          <div className="lg:w-2/3">
            <section className="relative">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Cities & Towns</h2>
                <div className="h-px bg-gradient-to-r from-amber-400 to-transparent flex-1"></div>
              </div>
          
          {/* Cities Grid */}
          {cities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cities.map((c) => (
                <Link 
                  key={c.id} 
                  href={`/dept/${dept.slug}/city/${c.slug}`} 
                  className="group relative bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-4 md:p-6 hover:border-amber-400/60 hover:bg-slate-800/90 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Golden corner accent */}
                  <div className="absolute top-3 right-3 w-4 h-4 md:w-6 md:h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
                  
                  {c.hero_url && (
                    <div className="relative w-full h-32 md:h-40 mb-4 overflow-hidden rounded-xl">
                      <Image 
                        src={c.hero_url} 
                        alt={c.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-lg md:text-xl mb-2 text-white group-hover:text-amber-200 transition-colors duration-300">
                    {c.name}
                  </h3>
                  
                  {c.summary && (
                    <p className="text-white/70 text-sm md:text-base leading-relaxed line-clamp-3 group-hover:text-white/90 transition-colors duration-300">
                      {c.summary}
                    </p>
                  )}
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8">
                <p className="text-white/70 text-lg">
                  Cities for this department are coming soon.
                </p>
              </div>
            </div>
          )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}