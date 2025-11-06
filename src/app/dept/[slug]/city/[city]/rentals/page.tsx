import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import RentalFilters from "@/components/RentalFilters";

async function getCityRentals(slug: string, citySlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  // Get all vacation rentals (hotels for now)
  const rentals = await prisma.places.findMany({
    where: { 
      city_id: city.id, 
      is_published: true,
      kind: 'hotel'
    },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });

  return { dept, city, rentals };
}

export default async function RentalsPage({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city: citySlug } = await params;
  const data = await getCityRentals(slug, citySlug);
  
  if (!data) return <div className="sub">City not found.</div>;
  
  const { dept, city, rentals } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/dept/${slug}/city/${citySlug}`} className="text-brand hover:text-brand-dark text-sm mb-2 inline-block">
            ← Back to {city.name}
          </Link>
          <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise">
            🏠 Vacation Rentals in {city.name}
          </h1>
          <p className="sub mt-2">{dept.name} Department • {rentals.length} properties available</p>
        </div>
        <Link 
          href={`/dept/${slug}/city/${citySlug}/rentals/list-property`} 
          className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium"
        >
          + List Your Property
        </Link>
      </div>

      {/* Search & Filters */}
      <RentalFilters rentals={rentals} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-turquoise">{rentals.length}</div>
          <p className="text-sm sub">Properties</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-coral">{rentals.filter(r => r.is_featured).length}</div>
          <p className="text-sm sub">Featured</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-sage">{rentals.filter(r => r.price_range && r.price_range.includes('$$$')).length}</div>
          <p className="text-sm sub">Luxury</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-amber">{rentals.filter(r => r.price_range && r.price_range.includes('$')).length}</div>
          <p className="text-sm sub">Budget</p>
        </div>
      </div>

      {/* Featured Properties */}
      {rentals.filter(r => r.is_featured).length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">⭐ Featured Properties</h2>
            <div className="h-px bg-gradient-to-r from-haiti-turquoise to-haiti-coral flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.filter(r => r.is_featured).map((rental) => (
              <Link key={rental.id} href={`/dept/${slug}/city/${citySlug}/rentals/${rental.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
                {rental.cover_url && (
                  <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={rental.cover_url} 
                      alt={rental.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 bg-haiti-coral text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      🏠 Rental
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise flex-1">{rental.name}</h3>
                  {rental.price_range && (
                    <span className="text-lg font-bold text-haiti-turquoise ml-2">{rental.price_range}</span>
                  )}
                </div>
                
                {rental.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{rental.description}</p>
                )}
                
                {/* Property Details */}
                <div className="space-y-2 mb-4">
                  {rental.address && (
                    <p className="text-xs sub flex items-center gap-1">
                      📍 {rental.address}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs">
                    {rental.booking_url && (
                      <span className="text-haiti-teal">📞 Instant Booking</span>
                    )}
                    {rental.website && (
                      <span className="text-haiti-sage">🌐 Website</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-haiti-turquoise text-sm font-medium group-hover:text-haiti-turquoise/80 transition-colors">
                    View Property →
                  </div>
                  <button className="bg-haiti-turquoise text-white text-xs px-3 py-1 rounded-lg hover:bg-haiti-turquoise/80 transition-colors">
                    Book Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Properties */}
      <section id="all-rentals">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">All Properties</h2>
          <div className="h-px bg-gradient-to-r from-haiti-turquoise to-haiti-teal flex-1"></div>
        </div>
        
        {rentals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <Link key={rental.id} href={`/dept/${slug}/city/${citySlug}/rentals/${rental.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise">
                {rental.cover_url && (
                  <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={rental.cover_url} 
                      alt={rental.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {rental.is_featured && (
                      <div className="absolute top-3 right-3 bg-haiti-coral text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      🏠 Rental
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise flex-1">{rental.name}</h3>
                  {rental.price_range && (
                    <span className="text-lg font-bold text-haiti-turquoise ml-2">{rental.price_range}</span>
                  )}
                </div>
                
                {rental.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{rental.description}</p>
                )}
                
                {/* Property Details */}
                <div className="space-y-2 mb-4">
                  {rental.address && (
                    <p className="text-xs sub flex items-center gap-1">
                      📍 {rental.address}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs">
                    {rental.booking_url && (
                      <span className="text-haiti-teal">📞 Instant Booking</span>
                    )}
                    {rental.website && (
                      <span className="text-haiti-sage">🌐 Website</span>
                    )}
                    {rental.phone && (
                      <span className="text-haiti-amber">📱 Call</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-haiti-turquoise text-sm font-medium group-hover:text-haiti-turquoise/80 transition-colors">
                    View Property →
                  </div>
                  <button className="bg-haiti-turquoise text-white text-xs px-3 py-1 rounded-lg hover:bg-haiti-turquoise/80 transition-colors">
                    Book Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Properties Yet</h3>
            <p className="sub mb-6">Be the first to list your property in {city.name}!</p>
            <Link 
              href={`/dept/${slug}/city/${citySlug}/rentals/list-property`} 
              className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium inline-block"
            >
              List Your Property
            </Link>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <div className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20 text-center py-12">
        <h3 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
          Own a Property in {city.name}?
        </h3>
        <p className="sub max-w-2xl mx-auto mb-6">
          Join our platform and start earning from your vacation rental. We connect you with travelers 
          looking for authentic experiences in {city.name}.
        </p>
        <Link 
          href={`/dept/${slug}/city/${citySlug}/rentals/list-property`} 
          className="bg-haiti-turquoise text-white px-8 py-4 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium text-lg"
        >
          List Your Property Today
        </Link>
      </div>
    </div>
  );
}