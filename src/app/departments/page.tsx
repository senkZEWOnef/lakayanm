import Link from "next/link";
import Image from "next/image";
import { prisma, safeDbOperation, checkDatabaseConnection } from "@/lib/db";
import { DatabaseErrorState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  // Check database connection
  const isDbConnected = await checkDatabaseConnection();
  
  // Get departments with retry logic
  const data = await safeDbOperation(
    () => prisma.departments.findMany({
      where: { is_published: true },
      orderBy: { name: "asc" },
    }),
    [] // fallback to empty array
  );

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
        {/* Very subtle overlay for content readability */}
        <div className="absolute inset-0 bg-slate-800/40 dark:bg-slate-900/80"></div>
      </div>

      <div className="relative z-10 space-y-16 px-6 py-12">
        {/* Header Section */}
        <section className="text-center relative">
          {/* Golden decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
          
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Haiti&apos;s 10 Departments
            </h1>
            
            {/* Golden accent line */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore each of Haiti&apos;s unique departments, from the historic North to the scenic South. 
              Each region offers its own cultural treasures, culinary traditions, and stories.
            </p>
          </div>
          
          {/* Bottom golden accent lines */}
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>
        {/* Departments Grid Section */}
        <section className="relative">
          {/* Golden decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
          
          {!isDbConnected ? (
            <DatabaseErrorState />
          ) : data === null || data.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Golden grid accent lines */}
              <div className="absolute inset-0 grid md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-none">
                <div className="border-r border-amber-400/10"></div>
                <div className="border-r border-amber-400/10"></div>
                <div></div>
              </div>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center">
                    <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40"></div>
                    <div className="w-full h-40 bg-amber-200 dark:bg-amber-800 rounded-xl mb-4"></div>
                    <div className="h-6 bg-amber-200 dark:bg-amber-800 rounded mb-2"></div>
                    <div className="h-4 bg-amber-100 dark:bg-amber-900 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Golden grid accent lines */}
              <div className="absolute inset-0 grid md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-none">
                <div className="border-r border-amber-400/10"></div>
                <div className="border-r border-amber-400/10"></div>
                <div></div>
              </div>
              
              {data.map((dept) => (
                <Link
                  key={dept.id}
                  href={`/dept/${dept.slug}`}
                  className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10"
                >
                  {/* Golden corner accent */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
                  
                  {dept.hero_url && (
                    <div className="relative mb-6 overflow-hidden rounded-xl">
                      <Image
                        src={dept.hero_url}
                        alt={dept.name}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Golden overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  <div className="text-xl mb-3 transform group-hover:scale-105 transition-transform duration-300">
                    {dept.slug === 'nord' && '🏰'}
                    {dept.slug === 'ouest' && '🏛️'}
                    {dept.slug === 'sud-est' && '🎨'}
                    {dept.slug === 'artibonite' && '🌾'}
                    {dept.slug === 'centre' && '⛪'}
                    {dept.slug === 'sud' && '🏖️'}
                    {dept.slug === 'grand-anse' && '🌿'}
                    {dept.slug === 'nord-est' && '🏔️'}
                    {dept.slug === 'nord-ouest' && '🗿'}
                    {dept.slug === 'nippes' && '🌊'}
                  </div>
                  
                  <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
                    {dept.name}
                  </h3>
                  
                  {dept.intro && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {dept.intro}
                    </p>
                  )}

                  {/* Golden bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
                </Link>
              ))}
            </div>
          )}
          
          {/* Bottom golden accent lines */}
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>
      </div>
    </div>
  );
}