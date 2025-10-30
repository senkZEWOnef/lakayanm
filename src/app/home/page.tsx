import Link from "next/link";
import Image from "next/image";
import { prisma, safeDbOperation, checkDatabaseConnection } from "@/lib/db";
import { DatabaseErrorState } from "@/components/ui/ErrorState";
import { DepartmentCardSkeleton } from "@/components/ui/LoadingState";
import { DepartmentsSection } from "@/components/DepartmentsSection";

interface Department {
  id: string;
  slug: string;
  name: string;
  intro: string | null;
  hero_url: string | null;
}

interface UpcomingEvent {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_date: Date | null;
  city: {
    name: string;
    slug: string;
    department: {
      name: string;
      slug: string;
    };
  };
}

// Custom department order as specified
const departmentOrder = ['nord', 'sud', 'sud-est', 'nord-est', 'nord-ouest', 'centre', 'artibonite', 'nippes', 'grand-anse', 'ouest'];

function sortDepartmentsByCustomOrder(departments: Department[]) {
  return departments.sort((a, b) => {
    const indexA = departmentOrder.indexOf(a.slug);
    const indexB = departmentOrder.indexOf(b.slug);
    return indexA - indexB;
  });
}

export default async function HomePage() {
  // Check database connection first
  const isDbConnected = await checkDatabaseConnection();
  
  // Get departments with retry logic
  const departmentsRaw = await safeDbOperation(
    () => prisma.departments.findMany({
      where: { is_published: true },
    }),
    [] // fallback to empty array
  );

  // Sort departments by custom order
  const departments = departmentsRaw ? sortDepartmentsByCustomOrder(departmentsRaw) : [];

  // Get upcoming events with retry logic
  const upcomingEvents = await safeDbOperation(
    () => prisma.places.findMany({
      where: { 
        kind: 'event',
        is_published: true,
        event_date: { gte: new Date() }
      },
      include: { 
        city: { 
          include: { department: true } 
        } 
      },
      take: 4,
      orderBy: { event_date: 'asc' }
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
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80"></div>
      </div>

      <div className="relative z-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-20 relative">
          {/* Golden decorative frame */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-amber-400/40"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-amber-400/40"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-amber-400/40"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-amber-400/40"></div>
          
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-4">
              Lakaya&apos;m
            </h1>
            
            {/* Golden accent line */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
            
            <p className="text-2xl font-light text-amber-700 dark:text-amber-300 mb-4 tracking-wide">
              DISCOVER HAITI
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Your guide to Haiti&apos;s vibrant culture, rich history, and hidden treasures
            </p>
            
            {/* Elegant Search */}
            <div className="max-w-lg mx-auto relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search places, culture, activities..."
                  className="w-full px-6 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-amber-200/50 dark:border-amber-400/30 rounded-full text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-amber-400 focus:outline-none transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-amber-400 hover:bg-amber-500 text-white rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* Departments Overview */}
      {!isDbConnected ? (
        <section className="relative">
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
          <DatabaseErrorState />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>
      ) : (
        <DepartmentsSection departments={departments || []} />
      )}

      {/* Food Section */}
      <section className="relative">
        {/* Golden decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
        
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
            🍽️ Food & Dining
          </h2>
          
          {/* Golden accent line */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover Haiti&apos;s culinary treasures, from authentic restaurants to local markets and specialty stores.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/food/restaurants" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🍴</div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Restaurants</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Find authentic Haitian cuisine and international dining options</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/food/supermarkets" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Supermarkets</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Grocery stores and markets for daily essentials and local products</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/food/local-business" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Local Business</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Specialty food stores, bakeries, and local food vendors</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>
        </div>

        {/* Bottom golden accent lines */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
      </section>

      {/* Activities Section */}
      <section className="relative">
        {/* Golden decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
        
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
            🎭 Activities & Entertainment
          </h2>
          
          {/* Golden accent line */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience Haiti&apos;s vibrant cultural scene through music, arts, sports, and community events.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/activities/music" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Music</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Live music venues and concerts</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/activities/theatres" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Theatres</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Cultural performances and shows</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/activities/sports" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">⚽</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Sports</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Sports venues and activities</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/activities/events" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">📅</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Events</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Community events and festivals</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>
        </div>

        {/* Bottom golden accent lines */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
      </section>

      {/* Stays Section */}
      <section className="relative">
        {/* Golden decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
        
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
            🏨 Places to Stay
          </h2>
          
          {/* Golden accent line */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Find comfortable accommodations across Haiti, from luxury hotels to cozy local rentals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/stays/hotels" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Hotels</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Luxury hotels and boutique accommodations</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/stays/airbnb" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Houses</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Private homes and unique local experiences</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>

          <Link href="/stays/rentals" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-4xl mb-4">🔑</div>
            <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Rentals</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Long-term rentals and vacation properties</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>
        </div>

        {/* Bottom golden accent lines */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
      </section>

      {/* History Section */}
      <section className="relative">
        {/* Golden decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
        
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
            📚 History & Culture
          </h2>
          
          {/* Golden accent line */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explore Haiti&apos;s rich historical heritage and learn about the stories that shaped each region.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Link href="/history" className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-8 text-center block hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10">
            <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
            <div className="text-5xl mb-6">🏛️</div>
            <h3 className="font-semibold text-2xl mb-4 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Discover Haiti&apos;s History</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">Learn about historical landmarks, important figures, and cultural heritage by city and region</p>
            <div className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium">
              <span>Explore by City</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
          </Link>
        </div>

        {/* Bottom golden accent lines */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
      </section>

      {/* Advertisement Section */}
      <section className="relative">
        {/* Golden decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
        
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
            📢 Featured Partners
          </h2>
          
          {/* Golden accent line */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover trusted local businesses and services across Haiti.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Advertisement Placeholders */}
          <div className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-dashed border-amber-300/50 dark:border-amber-400/30 rounded-2xl p-8 text-center hover:border-amber-400/60 transition-all duration-300">
            <div className="text-4xl mb-4 text-amber-400">📱</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-600 dark:text-slate-400">Ad Space Available</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm">Promote your business here</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 rounded-lg text-sm hover:bg-amber-400/30 transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-dashed border-amber-300/50 dark:border-amber-400/30 rounded-2xl p-8 text-center hover:border-amber-400/60 transition-all duration-300">
            <div className="text-4xl mb-4 text-amber-400">🏢</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-600 dark:text-slate-400">Business Spotlight</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm">Feature your services</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 rounded-lg text-sm hover:bg-amber-400/30 transition-colors duration-300">
                Get Featured
              </button>
            </div>
          </div>

          <div className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-dashed border-amber-300/50 dark:border-amber-400/30 rounded-2xl p-8 text-center hover:border-amber-400/60 transition-all duration-300">
            <div className="text-4xl mb-4 text-amber-400">🎯</div>
            <h3 className="font-semibold text-lg mb-3 text-slate-600 dark:text-slate-400">Premium Listing</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm">Reach more customers</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-amber-400/20 border border-amber-400/40 text-amber-700 dark:text-amber-300 rounded-lg text-sm hover:bg-amber-400/30 transition-colors duration-300">
                Start Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom golden accent lines */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
      </section>

      {/* Upcoming Events */}
      {isDbConnected && upcomingEvents && upcomingEvents.length > 0 && (
        <section className="relative">
          {/* Golden decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
          
          <div className="text-center mb-12 relative">
            <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              📅 Upcoming Events
            </h2>
            
            {/* Golden accent line */}
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
            
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Don&apos;t miss these exciting events happening across Haiti. From cultural festivals to local celebrations,
              experience the vibrant spirit of Haitian culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/dept/${event.city.department.slug}/city/${event.city.slug}#${event.slug}`}
                className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-5 hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10"
              >
                {/* Golden left accent bar */}
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-amber-400 to-amber-500 rounded-r-full"></div>
                
                {/* Golden corner accent */}
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
                
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300 leading-tight">
                    {event.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-400/20 ml-2 flex-shrink-0">
                    📅
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                  📍 {event.city.name}, {event.city.department.name}
                </p>
                
                {event.event_date && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-3 font-medium">
                    🗓️ {new Date(event.event_date).toLocaleDateString()}
                  </p>
                )}
                
                {event.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {event.description}
                  </p>
                )}

                {/* Golden bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
              </Link>
            ))}
          </div>
          
          {/* Bottom golden accent lines */}
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>
      )}
      </div>
    </div>
  );
}