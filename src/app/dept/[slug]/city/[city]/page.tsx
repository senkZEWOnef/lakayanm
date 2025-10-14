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
  const businesses = places.filter(p => ['restaurant', 'hotel', 'shop'].includes(p.kind));
  const attractions = places.filter(p => ['beach', 'landmark', 'tour'].includes(p.kind));
  const activities = places.filter(p => ['activity', 'event'].includes(p.kind));

  return (
    <div className="space-y-8">
      {/* City Hero */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${city.hero_url ?? ""})` }} />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="hero-title">{city.name}</h1>
              <p className="text-brand font-medium">{dept.name}</p>
              {city.summary && <p className="sub mt-2 max-w-2xl">{city.summary}</p>}
            </div>
            <div className="text-right">
              <div className="text-sm sub">📍 Location</div>
              {city.lat && city.lng && (
                <div className="text-xs">
                  {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <a href="#businesses" className="btn text-sm">🍽️ Food & Hotels ({businesses.length})</a>
        <a href="#attractions" className="btn text-sm">🏛️ Attractions ({attractions.length})</a>
        <a href="#activities" className="btn text-sm">🎉 Activities ({activities.length})</a>
        <a href="#history" className="btn text-sm">📚 History & Culture</a>
        {events.length > 0 && (
          <a href="#events" className="btn text-sm">📅 Events ({events.length})</a>
        )}
      </div>

      {/* Upcoming Events (if any) */}
      {events.length > 0 && (
        <section id="events" className="card bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200">
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

      {/* Businesses (Restaurants, Hotels, Shops) */}
      <section id="businesses">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🍽️ Food, Hotels & Local Businesses
        </h2>
        <div className="grid-auto">
          {businesses.map((place) => (
            <div key={place.id} id={place.slug} className="card hover:shadow-lg">
              {place.cover_url && (
                <img src={place.cover_url} alt={place.name} className="w-full h-40 object-cover rounded-xl mb-3" />
              )}
              
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{place.name}</h3>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand">
                    {place.kind === 'restaurant' && '🍽️'}
                    {place.kind === 'hotel' && '🏨'}
                    {place.kind === 'shop' && '🛍️'}
                    {place.kind}
                  </span>
                  {place.price_range && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {place.price_range}
                    </span>
                  )}
                </div>
              </div>

              {place.address && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📍 {place.address}</p>
              )}

              {place.description && (
                <p className="sub text-sm line-clamp-2 mb-3">{place.description}</p>
              )}

              {/* Enhanced Action Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2 text-sm">
                  {place.phone && (
                    <a href={`tel:${place.phone}`} className="btn bg-green-100 text-green-700 hover:bg-green-200">
                      📞 Call
                    </a>
                  )}
                  {place.booking_phone && (
                    <a href={`tel:${place.booking_phone}`} className="btn bg-blue-100 text-blue-700 hover:bg-blue-200">
                      🏨 Book
                    </a>
                  )}
                  {place.website && (
                    <a href={place.website} target="_blank" className="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                      🌐 Website
                    </a>
                  )}
                </div>
                
                {/* Menu & Special Features */}
                {(place.menu_url || place.order_url) && (
                  <div className="flex gap-2 text-sm">
                    {place.menu_url && (
                      <a href={place.menu_url} target="_blank" className="btn bg-orange-100 text-orange-700 hover:bg-orange-200">
                        📋 View Menu
                      </a>
                    )}
                    {place.order_url && (
                      <a href={place.order_url} target="_blank" className="btn bg-red-100 text-red-700 hover:bg-red-200">
                        🛵 Order Online
                      </a>
                    )}
                  </div>
                )}

                {/* Opening Hours (if available) */}
                {place.opening_hours && (
                  <div className="text-xs text-gray-500">
                    🕒 Check opening hours
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attractions & Landmarks */}
      <section id="attractions">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🏛️ Attractions & Landmarks
        </h2>
        <div className="grid-auto">
          {attractions.map((place) => (
            <div key={place.id} id={place.slug} className="card hover:shadow-lg">
              {place.cover_url && (
                <img src={place.cover_url} alt={place.name} className="w-full h-40 object-cover rounded-xl mb-3" />
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{place.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue/10 text-blue-700">
                  {place.kind === 'beach' && '🏖️'}
                  {place.kind === 'landmark' && '🏛️'}
                  {place.kind === 'tour' && '🎯'}
                  {place.kind}
                </span>
              </div>
              {place.description && (
                <p className="sub text-sm line-clamp-3 mb-3">{place.description}</p>
              )}
              <div className="flex gap-2 text-sm">
                {place.booking_url && (
                  <a href={place.booking_url} target="_blank" className="btn btn-primary">
                    🎫 Book Tour
                  </a>
                )}
                {place.website && (
                  <a href={place.website} target="_blank" className="btn">
                    ℹ️ More Info
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      <section id="activities">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🎉 Activities & Experiences
        </h2>
        <div className="grid-auto">
          {activities.map((place) => (
            <div key={place.id} id={place.slug} className="card hover:shadow-lg border-l-4 border-brand">
              {place.cover_url && (
                <img src={place.cover_url} alt={place.name} className="w-full h-40 object-cover rounded-xl mb-3" />
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{place.name}</h3>
                <span className="text-xs px-2 py-1 rounded bg-brand/10 text-brand">
                  {place.activity_type || place.kind}
                </span>
              </div>
              {place.event_date && (
                <p className="text-sm text-brand mb-2">
                  📅 {new Date(place.event_date).toLocaleDateString()}
                  {place.event_end_date && ` - ${new Date(place.event_end_date).toLocaleDateString()}`}
                </p>
              )}
              {place.description && (
                <p className="sub text-sm line-clamp-3">{place.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* History & Culture */}
      <section id="history" className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📚 History & Culture of {city.name}
        </h2>
        
        {/* Historical Significance */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">🏛️ Historical Importance</h3>
          <p className="sub">
            {city.name} has played a significant role in Haiti's rich history. From colonial times through independence 
            and into the modern era, this city has been home to important events and influential figures.
          </p>
        </div>

        {/* Famous Figures */}
        {figures.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">👑 Notable Figures Born or Lived Here</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {figures.map((figure) => (
                <div key={figure.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  {figure.portrait_url && (
                    <img src={figure.portrait_url} alt={figure.name} className="w-16 h-16 object-cover rounded-full mb-3 mx-auto" />
                  )}
                  <h4 className="font-semibold text-center">{figure.name}</h4>
                  {(figure.birth_year || figure.death_year) && (
                    <p className="text-xs text-center text-gray-500 mb-2">
                      {figure.birth_year && figure.birth_year} - {figure.death_year && figure.death_year}
                    </p>
                  )}
                  {figure.bio && (
                    <p className="text-sm sub line-clamp-3">{figure.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for Streets and Future Features */}
        <div className="border-t border-amber-200 pt-4">
          <h3 className="font-semibold mb-2">🛣️ Historic Streets & Monuments</h3>
          <p className="text-sm sub">
            Many streets and landmarks in {city.name} are named after important historical figures and commemorate 
            significant events in Haitian history. Each tells a story of the city's past and its contribution to the nation.
          </p>
        </div>
      </section>
    </div>
  );
}