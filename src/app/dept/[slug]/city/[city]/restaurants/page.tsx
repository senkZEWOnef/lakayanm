import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import RestaurantFilters from "@/components/RestaurantFilters";

async function getCityRestaurants(slug: string, citySlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  // Get all restaurants and dining establishments
  const restaurants = await prisma.places.findMany({
    where: { 
      city_id: city.id, 
      is_published: true,
      kind: { in: ['restaurant', 'shop'] }
    },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });

  return { dept, city, restaurants };
}

export default async function RestaurantsPage({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city: citySlug } = await params;
  const data = await getCityRestaurants(slug, citySlug);
  
  if (!data) return <div className="sub">City not found.</div>;
  
  const { dept, city, restaurants } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/dept/${slug}/city/${citySlug}`} className="text-brand hover:text-brand-dark text-sm mb-2 inline-block">
            ← Back to {city.name}
          </Link>
          <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise">
            🍽️ Restaurants & Dining in {city.name}
          </h1>
          <p className="sub mt-2">{dept.name} Department • {restaurants.length} establishments</p>
        </div>
      </div>

      {/* Filters */}
      <RestaurantFilters restaurants={restaurants} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand">{restaurants.filter(r => r.kind === 'restaurant').length}</div>
          <p className="text-sm sub">Restaurants</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-teal">{restaurants.filter(r => r.kind === 'shop').length}</div>
          <p className="text-sm sub">Local Shops</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-amber">{restaurants.filter(r => r.is_featured).length}</div>
          <p className="text-sm sub">Featured</p>
        </div>
      </div>

      {/* Featured Section */}
      {restaurants.filter(r => r.is_featured).length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">⭐ Featured Establishments</h2>
            <div className="h-px bg-gradient-to-r from-brand to-haiti-coral flex-1"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.filter(r => r.is_featured).map((restaurant) => (
              <Link key={restaurant.id} href={`/dept/${slug}/city/${citySlug}/restaurants/${restaurant.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
                {restaurant.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={restaurant.cover_url} 
                      alt={restaurant.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 bg-haiti-coral text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </div>
                  </div>
                )}
                <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-2">{restaurant.name}</h3>
                {restaurant.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{restaurant.description}</p>
                )}
                
                {/* Details */}
                <div className="space-y-2 mb-4">
                  {restaurant.address && (
                    <p className="text-xs sub">📍 {restaurant.address}</p>
                  )}
                  {restaurant.price_range && (
                    <p className="text-xs text-brand">💰 {restaurant.price_range}</p>
                  )}
                  {restaurant.phone && (
                    <p className="text-xs sub">📞 {restaurant.phone}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    View Details →
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    restaurant.kind === 'restaurant' ? 'bg-brand/10 text-brand' :
                    'bg-haiti-teal/10 text-haiti-teal'
                  }`}>
                    {restaurant.kind === 'restaurant' ? '🍽️ Restaurant' : '🏪 Local Shop'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Restaurants Grid */}
      <section id="all-restaurants">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">All Dining Options</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        
        {restaurants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
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
                      <div className="absolute top-3 right-3 bg-haiti-coral text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                <h3 className="font-bold text-xl text-haiti-navy dark:text-haiti-turquoise mb-2">{restaurant.name}</h3>
                {restaurant.description && (
                  <p className="sub text-sm line-clamp-3 mb-4">{restaurant.description}</p>
                )}
                
                {/* Details */}
                <div className="space-y-2 mb-4">
                  {restaurant.address && (
                    <p className="text-xs sub">📍 {restaurant.address}</p>
                  )}
                  {restaurant.price_range && (
                    <p className="text-xs text-brand">💰 {restaurant.price_range}</p>
                  )}
                  {restaurant.phone && (
                    <p className="text-xs sub">📞 {restaurant.phone}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                    View Details →
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    restaurant.kind === 'restaurant' ? 'bg-brand/10 text-brand' :
                    'bg-haiti-teal/10 text-haiti-teal'
                  }`}>
                    {restaurant.kind === 'restaurant' ? '🍽️ Restaurant' : '🏪 Local Shop'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Restaurants Yet</h3>
            <p className="sub">We're working on adding dining options for {city.name}. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}