import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

async function getCityData(slug: string, citySlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  // Get all places with enhanced data
  const places = await prisma.places.findMany({
    where: { city_id: city.id, is_published: true },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });

  // Get historical figures
  const figures = await prisma.figures.findMany({
    where: { city_id: city.id, is_published: true },
    orderBy: { name: "asc" },
  });

  // Get upcoming events
  const events = places.filter(p => 
    p.kind === 'event' && 
    p.event_date && 
    new Date(p.event_date) >= new Date()
  );

  // Get recent reviews (when schema is updated)
  // const recentReviews = await prisma.reviews.findMany({
  //   where: { place: { city_id: city.id } },
  //   include: { place: true },
  //   orderBy: { created_at: 'desc' },
  //   take: 5
  // });

  return { dept, city, places, figures, events };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city: citySlug } = await params;
  const data = await getCityData(slug, citySlug);
  
  if (!data) return <div className="sub">City not found.</div>;
  
  const { dept, city, places, figures, events } = data;

  // Group places by category for filtering
  const restaurants = places.filter(p => p.kind === 'restaurant');
  const hotels = places.filter(p => p.kind === 'hotel');
  const shops = places.filter(p => p.kind === 'shop');
  const landmarks = places.filter(p => p.kind === 'landmark');

  return (
    <div className="space-y-12">
      {/* City Hero */}
      <div className="relative overflow-hidden rounded-2xl">
        {city.hero_url && (
          <div className="absolute inset-0">
            <Image
              src={city.hero_url}
              alt={city.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-haiti-midnight/80 via-haiti-navy/40 to-transparent"></div>
          </div>
        )}
        <div className="relative z-10 px-8 py-16 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{city.name}</h1>
          <p className="text-xl text-haiti-turquoise font-medium mb-2">{dept.name}</p>
          {city.summary && <p className="text-lg max-w-2xl mx-auto leading-relaxed">{city.summary}</p>}
        </div>
      </div>

      {/* Business Categories */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🍽️ Food, Hotels & Local Businesses</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Restaurants Card */}
          <div className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-brand">
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍽️</div>
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Restaurants</h3>
              <p className="sub text-sm mb-4">Authentic Haitian cuisine and international flavors</p>
              <div className="text-2xl font-bold text-brand">{restaurants.length}</div>
              <p className="text-xs sub">Places to discover</p>
            </div>
          </div>

          {/* Hotels Card */}
          <div className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-teal">
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏨</div>
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Hotels & Stays</h3>
              <p className="sub text-sm mb-4">Hotels, guesthouses and local accommodations</p>
              <div className="text-2xl font-bold text-haiti-teal">{hotels.length}</div>
              <p className="text-xs sub">Places to stay</p>
            </div>
          </div>

          {/* Local Businesses Card */}
          <div className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Local Businesses</h3>
              <p className="sub text-sm mb-4">Shops, markets and local entrepreneurs</p>
              <div className="text-2xl font-bold text-haiti-coral">{shops.length}</div>
              <p className="text-xs sub">Local businesses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events (if any) */}
      {events.length > 0 && (
        <section id="events" className="card bg-gradient-to-r from-brand/5 to-haiti-coral/5 dark:from-brand/10 dark:to-haiti-coral/10 border-brand/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📅 Upcoming Events in {city.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {events.slice(0, 4).map((event) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{event.name}</h3>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                    {event.event_date && new Date(event.event_date).toLocaleDateString()}
                  </span>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.description}</p>
                )}
                {event.booking_phone && (
                  <div className="mt-2">
                    <a href={`tel:${event.booking_phone}`} className="text-sm text-brand">
                      📞 {event.booking_phone}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* City Story */}
      <section className="card bg-gradient-to-r from-haiti-amber/5 to-brand/5 dark:from-haiti-amber/10 dark:to-brand/10 border-haiti-amber/20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">📚 History & Culture of {city.name}</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-amber flex-1"></div>
        </div>
        
        <div className="max-w-4xl">
          <p className="text-lg leading-relaxed sub mb-6">
            Founded in <span className="font-semibold text-brand">1670</span> by French colonists, Cap-Haïtien was originally called <em>Cap-Français</em> and served as the colonial capital of Saint-Domingue. This historic port city became the economic heart of the colony and later played a pivotal role in Haiti&apos;s independence revolution.
          </p>
          <p className="leading-relaxed sub">
            Known as the &ldquo;Paris of the Antilles&rdquo; during colonial times, Cap-Haïtien was home to revolutionary leaders, royal palaces, and the birthplace of Haiti&apos;s fight for freedom. Today, it stands as Haiti&apos;s second-largest city and a UNESCO World Heritage gateway to the magnificent Citadelle Laferrière.
          </p>
        </div>
      </section>

      {/* Famous People */}
      {figures.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">👑 Famous People from Cap-Haïtien</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {figures.map((figure) => (
              <Link key={figure.id} href={`/figure/${figure.id}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-brand">
                <div className="text-center">
                  {figure.portrait_url && (
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image 
                        src={figure.portrait_url} 
                        alt={figure.name} 
                        fill 
                        className="object-cover rounded-full border-3 border-brand/20 group-hover:border-brand/60 transition-colors" 
                        sizes="96px"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise mb-1">{figure.name}</h3>
                  {figure.category && (
                    <span className="inline-block text-xs px-3 py-1 bg-brand/10 text-brand rounded-full mb-2">
                      {figure.category}
                    </span>
                  )}
                  {(figure.birth_year || figure.death_year) && (
                    <p className="text-sm sub">
                      {figure.birth_year} - {figure.death_year}
                    </p>
                  )}
                  <div className="mt-4 text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    Learn more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Landmarks */}
      {landmarks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🏛️ Historic Landmarks</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-coral flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {landmarks.map((landmark) => (
              <div key={landmark.id} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
                {landmark.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={landmark.cover_url} 
                      alt={landmark.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-2">{landmark.name}</h3>
                {landmark.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{landmark.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    Explore & Get Directions →
                  </div>
                  <span className="text-xs px-2 py-1 bg-haiti-coral/10 text-haiti-coral rounded-full">
                    🏛️ Landmark
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}