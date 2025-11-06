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

  // Get historical events
  const historicalEvents = await prisma.historical_events.findMany({
    where: { city_id: city.id, is_published: true },
    orderBy: { year: "asc" },
  });

  // Get streets with stories
  const streets = await prisma.streets.findMany({
    where: { city_id: city.id, is_published: true },
    orderBy: { name: "asc" },
  });

  // Get upcoming events
  const events = places.filter(p => 
    p.kind === 'event' && 
    p.event_date && 
    new Date(p.event_date) >= new Date()
  );

  // Get media gallery
  const media = await prisma.media.findMany({
    where: { city_id: city.id },
    orderBy: { created_at: "desc" },
    take: 12,
  });

  return { dept, city, places, figures, events, historicalEvents, streets, media };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city: citySlug } = await params;
  const data = await getCityData(slug, citySlug);
  
  if (!data) return <div className="sub">City not found.</div>;
  
  const { dept, city, places, figures, events, historicalEvents, streets, media } = data;

  // Group places by category for filtering
  const restaurants = places.filter(p => p.kind === 'restaurant');
  const hotels = places.filter(p => p.kind === 'hotel');
  const shops = places.filter(p => p.kind === 'shop');
  const landmarks = places.filter(p => p.kind === 'landmark');
  const beaches = places.filter(p => p.kind === 'beach');
  const tours = places.filter(p => p.kind === 'tour');
  const activities = places.filter(p => p.kind === 'activity');
  const rentals = hotels; // Hotels serve as vacation rentals

  // Calculate city stats
  const totalPlaces = places.length;
  const unescoSites = places.filter(p => p.unesco_site).length;

  return (
    <div className="space-y-12">
      {/* Enhanced City Hero */}
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
          <p className="text-xl text-haiti-turquoise font-medium mb-2">{dept.name} Department</p>
          {city.summary && <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-6">{city.summary}</p>}
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="font-bold text-haiti-turquoise">{totalPlaces}</div>
              <div>Places</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="font-bold text-haiti-turquoise">{figures.length}</div>
              <div>Notable Figures</div>
            </div>
            {unescoSites > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="font-bold text-haiti-turquoise">{unescoSites}</div>
                <div>UNESCO Sites</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Categories Grid */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🗺️ Explore {city.name}</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Landmarks */}
          {landmarks.length > 0 && (
            <Link href={`/dept/${slug}/city/${citySlug}/landmarks`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏛️</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Landmarks</h3>
                <div className="text-xl font-bold text-haiti-coral">{landmarks.length}</div>
                <p className="text-xs sub">Historic sites</p>
              </div>
            </Link>
          )}

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <a href="#restaurants" className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-brand">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🍽️</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Restaurants</h3>
                <div className="text-xl font-bold text-brand">{restaurants.length}</div>
                <p className="text-xs sub">Culinary experiences</p>
              </div>
            </a>
          )}

          {/* Hotels & Stays */}
          {hotels.length > 0 && (
            <a href="#hotels" className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-teal">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏨</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Hotels & Stays</h3>
                <div className="text-xl font-bold text-haiti-teal">{hotels.length}</div>
                <p className="text-xs sub">Accommodations</p>
              </div>
            </a>
          )}

          {/* Rentals */}
          {rentals.length > 0 && (
            <Link href={`/dept/${slug}/city/${citySlug}/rentals`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏠</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Rentals</h3>
                <div className="text-xl font-bold text-haiti-turquoise">{rentals.length}</div>
                <p className="text-xs sub">Vacation homes</p>
              </div>
            </Link>
          )}

          {/* Gallery */}
          {media.length > 0 && (
            <a href="#gallery" className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-sage">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Gallery</h3>
                <div className="text-xl font-bold text-haiti-sage">{media.length}</div>
                <p className="text-xs sub">Photo collection</p>
              </div>
            </a>
          )}

          {/* History */}
          {(historicalEvents.length > 0 || figures.length > 0) && (
            <a href="#history" className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-amber">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📜</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">History</h3>
                <div className="text-xl font-bold text-haiti-amber">{historicalEvents.length + figures.length}</div>
                <p className="text-xs sub">Stories & people</p>
              </div>
            </a>
          )}

          {/* Beaches */}
          {beaches.length > 0 && (
            <a href="#beaches" className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🏖️</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Beaches</h3>
                <div className="text-xl font-bold text-haiti-turquoise">{beaches.length}</div>
                <p className="text-xs sub">Coastal paradise</p>
              </div>
            </a>
          )}

          {/* Tours & Activities */}
          {(tours.length > 0 || activities.length > 0) && (
            <a href="#activities" className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-amber">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="text-lg font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Activities</h3>
                <div className="text-xl font-bold text-haiti-amber">{tours.length + activities.length}</div>
                <p className="text-xs sub">Tours & experiences</p>
              </div>
            </a>
          )}
        </div>
      </section>

      {/* History & Culture Section */}
      <section id="history">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">📚 History & Culture of Cap-Haïtien</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-coral flex-1"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Colonial Heritage</h3>
            <p className="mb-4">
              Founded in 1670 as Cap-Français, Cap-Haïtien was once the colonial capital of Saint-Domingue (now Haiti) 
              under French rule. The city served as the economic heart of the most profitable colony in the Caribbean, 
              built on sugar and coffee plantations.
            </p>
            <p>
              Today, visitors can explore remnants of this colonial past through the city's architecture, 
              museums, and historic sites that tell the story of both the colonial era and the Haitian Revolution.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Revolutionary Legacy</h3>
            <p className="mb-4">
              Cap-Haïtien played a pivotal role in the Haitian Revolution (1791-1804), the only successful slave revolt 
              in history. The city was home to many key figures of the revolution and witnessed crucial battles that 
              led to Haiti's independence.
            </p>
            <p>
              The nearby Citadelle Laferrière and Sans-Souci Palace, built by King Henri Christophe, stand as 
              monuments to Haiti's triumph over slavery and colonialism.
            </p>
          </div>
          
          <div className="card lg:col-span-2">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Cultural Significance Today</h3>
            <p className="mb-4">
              Modern Cap-Haïtien is a vibrant cultural center, known for its arts scene, traditional music, and festivals. 
              The city hosts numerous cultural events throughout the year, celebrating both its historic heritage and 
              contemporary Haitian culture.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🎭</div>
                <h4 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Arts & Theater</h4>
                <p className="text-sm sub">Rich tradition of performing arts and local theater productions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🥁</div>
                <h4 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Traditional Music</h4>
                <p className="text-sm sub">Home to authentic Haitian rhythms and musical heritage</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h4 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">Festivals</h4>
                <p className="text-sm sub">Annual celebrations of culture, history, and community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Landmarks */}
      {landmarks.length > 0 && (
        <section id="landmarks">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🏛️ Historic Landmarks</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-coral flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {landmarks.slice(0, 2).map((landmark) => (
              <Link key={landmark.id} href={`/dept/${slug}/city/${citySlug}/landmarks/${landmark.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
                {landmark.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={landmark.cover_url} 
                      alt={landmark.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {landmark.unesco_site && (
                      <div className="absolute top-3 right-3 bg-haiti-amber text-white text-xs px-2 py-1 rounded-full font-medium">
                        UNESCO Site
                      </div>
                    )}
                  </div>
                )}
                <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-2">{landmark.name}</h3>
                {landmark.historical_significance && (
                  <p className="text-haiti-amber text-sm font-medium mb-2">{landmark.historical_significance}</p>
                )}
                {landmark.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{landmark.description}</p>
                )}
                <div className="space-y-2">
                  {landmark.entrance_fee && (
                    <p className="text-xs text-haiti-coral">💰 {landmark.entrance_fee}</p>
                  )}
                  {landmark.best_visiting_time && (
                    <p className="text-xs sub">⏰ Best time: {landmark.best_visiting_time}</p>
                  )}
                  {landmark.guided_tours && (
                    <p className="text-xs text-haiti-teal">👥 Guided tours available</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    Explore & Get Directions →
                  </div>
                  <span className="text-xs px-2 py-1 bg-haiti-coral/10 text-haiti-coral rounded-full">
                    🏛️ Landmark
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          {landmarks.length > 2 && (
            <div className="text-center mt-6">
              <Link 
                href={`/dept/${slug}/city/${citySlug}/landmarks`}
                className="inline-flex items-center gap-2 bg-haiti-coral text-white px-6 py-3 rounded-lg hover:bg-haiti-coral/80 transition-colors font-medium"
              >
                See All {landmarks.length} Landmarks →
              </Link>
            </div>
          )}
          
          {landmarks.length <= 2 && landmarks.length > 0 && (
            <div className="text-center mt-6">
              <Link 
                href={`/dept/${slug}/city/${citySlug}/landmarks`}
                className="inline-flex items-center gap-2 border-2 border-haiti-coral text-haiti-coral px-6 py-3 rounded-lg hover:bg-haiti-coral hover:text-white transition-colors font-medium"
              >
                View Landmark Details →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Restaurants Section */}
      {restaurants.length > 0 && (
        <section id="restaurants">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🍽️ Restaurants & Dining</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
            <Link href={`/dept/${slug}/city/${citySlug}/restaurants`} className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/80 transition-colors text-sm font-medium">
              See All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.slice(0, 3).map((restaurant) => (
              <Link key={restaurant.id} href={`/dept/${slug}/city/${citySlug}/restaurants/${restaurant.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-brand">
                {restaurant.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={restaurant.cover_url} 
                      alt={restaurant.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {restaurant.is_featured && (
                      <div className="absolute top-3 right-3 bg-brand text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <h3 className="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise mb-2">{restaurant.name}</h3>
                {restaurant.description && (
                  <p className="sub text-sm line-clamp-2 mb-3">{restaurant.description}</p>
                )}
                <div className="space-y-2">
                  {restaurant.price_range && (
                    <p className="text-xs text-brand">💰 {restaurant.price_range}</p>
                  )}
                  {restaurant.phone && (
                    <p className="text-xs sub">📞 {restaurant.phone}</p>
                  )}
                  {restaurant.address && (
                    <p className="text-xs sub">📍 {restaurant.address}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    View Details →
                  </div>
                  <span className="text-xs px-2 py-1 bg-brand/10 text-brand rounded-full">
                    🍽️ Restaurant
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Hotels & Accommodations Section */}
      {hotels.length > 0 && (
        <section id="hotels">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🏨 Hotels & Accommodations</h2>
            <div className="h-px bg-gradient-to-r from-haiti-teal to-haiti-turquoise flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-teal">
                {hotel.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={hotel.cover_url} 
                      alt={hotel.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {hotel.is_featured && (
                      <div className="absolute top-3 right-3 bg-haiti-teal text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-2">{hotel.name}</h3>
                {hotel.description && (
                  <p className="sub text-sm line-clamp-2 mb-3">{hotel.description}</p>
                )}
                <div className="space-y-2">
                  {hotel.price_range && (
                    <p className="text-xs text-haiti-teal">💰 {hotel.price_range}</p>
                  )}
                  {hotel.booking_phone && (
                    <p className="text-xs sub">📞 {hotel.booking_phone}</p>
                  )}
                  {hotel.address && (
                    <p className="text-xs sub">📍 {hotel.address}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-haiti-teal text-sm font-medium group-hover:text-haiti-teal/80 transition-colors">
                    Book Now →
                  </div>
                  <span className="text-xs px-2 py-1 bg-haiti-teal/10 text-haiti-teal rounded-full">
                    🏨 Hotel
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vacation Rentals Section */}
      {rentals.length > 0 ? (
        <section id="rentals">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🏠 Vacation Rentals</h2>
            <div className="h-px bg-gradient-to-r from-haiti-turquoise to-haiti-teal flex-1"></div>
            <Link href={`/dept/${slug}/city/${citySlug}/rentals`} className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg hover:bg-haiti-turquoise/80 transition-colors text-sm font-medium">
              See All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.slice(0, 3).map((rental) => (
              <Link key={rental.id} href={`/dept/${slug}/city/${citySlug}/rentals/${rental.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise">
                {rental.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={rental.cover_url} 
                      alt={rental.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {rental.is_featured && (
                      <div className="absolute top-3 right-3 bg-haiti-turquoise text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-2">{rental.name}</h3>
                {rental.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{rental.description}</p>
                )}
                
                {/* Details */}
                <div className="space-y-2 mb-4">
                  {rental.address && (
                    <p className="text-xs sub">📍 {rental.address}</p>
                  )}
                  {rental.price_range && (
                    <p className="text-xs text-haiti-turquoise">💰 {rental.price_range}</p>
                  )}
                  {rental.phone && (
                    <p className="text-xs sub">📞 {rental.phone}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-haiti-turquoise text-sm font-medium group-hover:text-haiti-turquoise/80 transition-colors">
                    View Property →
                  </div>
                  <span className="text-xs px-2 py-1 bg-haiti-turquoise/10 text-haiti-turquoise rounded-full">
                    🏠 Rental
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section id="rentals" className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🏠 Vacation Rentals</h2>
            <div className="h-px bg-gradient-to-r from-haiti-turquoise to-haiti-teal flex-1"></div>
          </div>
          
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Coming Soon!</h3>
            <p className="sub max-w-2xl mx-auto">
              We're working on bringing you the best vacation rental options in {city.name}. 
              From cozy guesthouses to luxury villas, find your perfect home away from home.
            </p>
            <div className="mt-6">
              <Link href={`/dept/${slug}/city/${citySlug}/rentals`} className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium">
                List Your Property
              </Link>
            </div>
          </div>
        </section>
      )}

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


      {/* Historical Timeline */}
      {historicalEvents.length > 0 && (
        <section id="history">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">📜 Historical Timeline</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-amber flex-1"></div>
          </div>
          
          <div className="space-y-6">
            {historicalEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="card border-l-4 border-haiti-amber hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-haiti-amber/10 text-haiti-amber rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0">
                    {event.year || new Date(event.date || '').getFullYear()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise mb-2">{event.title}</h3>
                    <p className="sub text-sm leading-relaxed">{event.description}</p>
                    {event.location && (
                      <p className="text-xs text-haiti-amber mt-2">📍 {event.location}</p>
                    )}
                  </div>
                  {event.image_url && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Famous Streets */}
      {streets.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🛣️ Historic Streets</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {streets.map((street) => (
              <div key={street.id} className="card border-l-4 border-haiti-teal hover:shadow-xl transition-all duration-300">
                {street.image_url && (
                  <div className="relative w-full h-32 mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={street.image_url}
                      alt={street.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <h3 className="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise mb-2">{street.name}</h3>
                {street.named_after && (
                  <p className="text-sm text-haiti-teal mb-2">
                    <span className="font-medium">Named after:</span> {street.named_after}
                  </p>
                )}
                {street.story && (
                  <p className="sub text-sm line-clamp-3">{street.story}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Enhanced Famous People */}
      {figures.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">👑 Notable Figures from {city.name}</h2>
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
                    <p className="text-sm sub mb-2">
                      {figure.birth_year} - {figure.death_year || 'Present'}
                    </p>
                  )}
                  {figure.legacy && (
                    <p className="text-xs sub line-clamp-2 mb-3">{figure.legacy}</p>
                  )}
                  <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    Learn more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {media.length > 0 && (
        <section id="gallery">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">📸 Photo Gallery</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-sage flex-1"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.slice(0, 8).map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src={image.path}
                  alt={image.alt || `Photo of ${city.name}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
          
          {media.length > 8 && (
            <div className="text-center mt-6">
              <button className="btn-primary">
                View All {media.length} Photos
              </button>
            </div>
          )}
        </section>
      )}
      {/* Getting Around Section */}
      <section className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">🚗 Getting Around {city.name}</h2>
          <div className="h-px bg-gradient-to-r from-haiti-turquoise to-haiti-teal flex-1"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Navigation</h3>
            <p className="sub text-sm">GPS coordinates available for all major landmarks and businesses</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🚌</div>
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Public Transport</h3>
            <p className="sub text-sm">Tap-taps and buses connect you throughout the city</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Parking</h3>
            <p className="sub text-sm">Parking information available for each location</p>
          </div>
        </div>
      </section>

    </div>
  );
}