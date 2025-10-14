import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  let departments = [];
  let featuredPlaces = [];
  let upcomingEvents = [];
  
  try {
    // Get departments for overview
    departments = await prisma.departments.findMany({
      where: { is_published: true },
      orderBy: { name: "asc" },
    });

    // Get featured places (random selection from different categories)
    featuredPlaces = await prisma.places.findMany({
      where: { 
        is_published: true,
        OR: [
          { kind: 'restaurant' },
          { kind: 'hotel' },
          { kind: 'landmark' },
          { kind: 'beach' }
        ]
      },
      include: { 
        city: { 
          include: { department: true } 
        } 
      },
      take: 6,
      orderBy: { created_at: 'desc' }
    });

    // Get upcoming events
    upcomingEvents = await prisma.places.findMany({
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
    });

  } catch (error) {
    console.error('Database connection error:', error);
    // Return empty arrays to show page with error message
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-brand to-brand-dark text-white rounded-3xl">
        <h1 className="hero-title text-white mb-4">Découvrez Haïti 🇭🇹</h1>
        <p className="text-xl mb-8 text-white/90">Your local guide to culture, food, activities & history</p>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search places, food, activities..."
              className="w-full px-4 py-3 rounded-xl text-gray-900 border-0"
            />
            <button className="absolute right-2 top-2 btn btn-primary">
              🔍
            </button>
          </div>
        </div>
      </section>

      {/* Departments Overview */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Haiti's 9 Departments</h2>
          <p className="sub max-w-2xl mx-auto">
            Discover unique experiences across all regions of Haiti. From northern fortresses to southern beaches,
            each department offers its own cultural treasures and local flavors.
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="card text-center">
            <h3 className="font-semibold mb-2">🔌 Database Connection Issue</h3>
            <p className="sub">
              We're having trouble connecting to our database right now. Please try again in a moment.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/dept/${dept.slug}`}
                className="card hover:shadow-lg text-center group"
              >
                {dept.hero_url && (
                  <img
                    src={dept.hero_url}
                    alt={dept.name}
                    className="w-full h-32 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="text-4xl mb-3">
                  {dept.slug === 'nord' && '🏰'}
                  {dept.slug === 'ouest' && '🏛️'}
                  {dept.slug === 'sud-est' && '🎨'}
                  {dept.slug === 'artibonite' && '🌾'}
                  {dept.slug === 'centre' && '⛪'}
                  {dept.slug === 'sud' && '🏖️'}
                  {dept.slug === 'grand-anse' && '🌿'}
                  {dept.slug === 'nord-est' && '🏔️'}
                  {dept.slug === 'nord-ouest' && '🗿'}
                </div>
                <h3 className="font-semibold text-lg mb-2">{dept.name}</h3>
                {dept.intro && (
                  <p className="sub text-sm line-clamp-2">{dept.intro}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Places */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">✨ Featured Places</h2>
          <p className="sub max-w-2xl mx-auto">
            Discover some of Haiti's most remarkable destinations, from historic landmarks like the Citadelle 
            to authentic local restaurants and beautiful accommodations.
          </p>
        </div>

        {featuredPlaces.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Featured places will appear here once the database is connected.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaces.map((place) => (
              <Link
                key={place.id}
                href={`/dept/${place.city.department.slug}/city/${place.city.slug}#${place.slug}`}
                className="card hover:shadow-lg group"
              >
                {place.cover_url && (
                  <img
                    src={place.cover_url}
                    alt={place.name}
                    className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand">
                    {place.kind === 'restaurant' && '🍽️'}
                    {place.kind === 'hotel' && '🏨'}
                    {place.kind === 'landmark' && '🏛️'}
                    {place.kind === 'beach' && '🏖️'}
                    {place.kind}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  📍 {place.city.name}, {place.city.department.name}
                </p>
                {place.description && (
                  <p className="sub text-sm line-clamp-2">{place.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">📅 Upcoming Events</h2>
            <p className="sub max-w-2xl mx-auto">
              Don't miss these exciting events happening across Haiti. From cultural festivals to local celebrations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/dept/${event.city.department.slug}/city/${event.city.slug}#${event.slug}`}
                className="card hover:shadow-lg border-l-4 border-orange-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{event.name}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">
                    📅 Event
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {event.city.name}, {event.city.department.name}
                </p>
                {event.event_date && (
                  <p className="text-sm text-orange-600 mb-2">
                    🗓️ {new Date(event.event_date).toLocaleDateString()}
                  </p>
                )}
                {event.description && (
                  <p className="sub text-sm line-clamp-3">{event.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
