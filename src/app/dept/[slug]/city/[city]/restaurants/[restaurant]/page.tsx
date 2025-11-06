import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import RestaurantGallery from "@/components/RestaurantGallery";

async function getRestaurantData(slug: string, citySlug: string, restaurantSlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  const restaurant = await prisma.places.findFirst({
    where: { 
      slug: restaurantSlug,
      city_id: city.id, 
      is_published: true,
      kind: { in: ['restaurant', 'shop'] }
    },
  });
  if (!restaurant) return null;

  // Get restaurant gallery photos
  const gallery = await prisma.media.findMany({
    where: { place_id: restaurant.id },
    orderBy: { created_at: "desc" },
  });

  return { dept, city, restaurant, gallery };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string; city: string; restaurant: string }> }) {
  const { slug, city: citySlug, restaurant: restaurantSlug } = await params;
  const session = await getServerSession();
  const data = await getRestaurantData(slug, citySlug, restaurantSlug);
  
  if (!data) return <div className="sub">Restaurant not found.</div>;
  
  const { dept, city, restaurant, gallery } = data;

  const getTypeLabel = (kind: string) => {
    switch (kind) {
      case 'restaurant': return '🍽️ Restaurant';
      case 'shop': return '🏪 Local Shop';
      default: return '🍽️ Dining';
    }
  };

  const getTypeColor = (kind: string) => {
    switch (kind) {
      case 'restaurant': return 'bg-brand text-white';
      case 'shop': return 'bg-haiti-teal text-white';
      default: return 'bg-brand text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/dept/${slug}/city/${citySlug}`} className="text-brand hover:text-brand-dark text-sm">
            ← Back to {city.name}
          </Link>
          <span className="text-sm sub">•</span>
          <Link href={`/dept/${slug}/city/${citySlug}/restaurants`} className="text-brand hover:text-brand-dark text-sm">
            All Restaurants
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">
              {restaurant.name}
            </h1>
            <p className="sub">{city.name}, {dept.name} Department</p>
            
            {restaurant.description && (
              <div className="mt-4 p-4 bg-brand/10 border-l-4 border-brand rounded-r-lg">
                <p className="text-sm">{restaurant.description}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            {restaurant.is_featured && (
              <span className="bg-haiti-amber text-white text-xs px-3 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeColor(restaurant.kind)}`}>
              {getTypeLabel(restaurant.kind)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          {restaurant.cover_url && (
            <div className="relative w-full h-96 overflow-hidden rounded-xl">
              <Image 
                src={restaurant.cover_url} 
                alt={restaurant.name} 
                fill 
                className="object-cover" 
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          )}

          {/* Menu & Items */}
          {(restaurant.menu_items || restaurant.menu_url) && (
            <div className="card">
              <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Menu & Items</h2>
              {restaurant.menu_items && (
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">Menu Items</h3>
                  <p className="leading-relaxed">{typeof restaurant.menu_items === 'string' ? restaurant.menu_items : JSON.stringify(restaurant.menu_items)}</p>
                </div>
              )}
              {restaurant.menu_url && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Full Menu</h3>
                  <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-dark">
                    View Complete Menu →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Gallery Section */}
          <RestaurantGallery 
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            initialPhotos={gallery}
            userSession={session}
          />
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Restaurant Info</h3>
            <div className="space-y-3">
              {restaurant.address && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">📍</span>
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-sm sub">{restaurant.address}</p>
                  </div>
                </div>
              )}
              
              {restaurant.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">📞</span>
                  <div>
                    <p className="font-medium text-sm">Phone</p>
                    <a href={`tel:${restaurant.phone}`} className="text-sm text-brand hover:text-brand-dark">
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {restaurant.price_range && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">💰</span>
                  <div>
                    <p className="font-medium text-sm">Price Range</p>
                    <p className="text-sm sub">{restaurant.price_range}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hours & Availability */}
          {restaurant.opening_hours && (
            <div className="card">
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Hours & Service</h3>
              <div className="space-y-3">
                {restaurant.opening_hours && (
                  <div className="flex items-start gap-3">
                    <span className="text-haiti-coral mt-1">⏰</span>
                    <div>
                      <p className="font-medium text-sm">Hours</p>
                      <p className="text-sm sub">{typeof restaurant.opening_hours === 'string' ? restaurant.opening_hours : JSON.stringify(restaurant.opening_hours)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact & Website */}
          {restaurant.website && (
            <div className="card">
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Online</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-haiti-coral">🌐</span>
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand-dark font-medium"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="card space-y-3">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Quick Actions</h3>
            
            {restaurant.phone && (
              <button 
                onClick={() => window.open(`tel:${restaurant.phone}`)}
                className="w-full bg-brand text-white py-3 rounded-lg hover:bg-brand/80 transition-colors font-medium"
              >
                📞 Call Now
              </button>
            )}
            
            {restaurant.gps_coordinates && (
              <button 
                onClick={() => window.open(`https://maps.google.com/maps?q=${restaurant.gps_coordinates}`)}
                className="w-full bg-haiti-coral text-white py-3 rounded-lg hover:bg-haiti-coral/80 transition-colors font-medium"
              >
                🗺️ Get Directions
              </button>
            )}
            
            {restaurant.website && (
              <button 
                onClick={() => window.open(restaurant.website!, '_blank')}
                className="w-full bg-haiti-teal text-white py-3 rounded-lg hover:bg-haiti-teal/80 transition-colors font-medium"
              >
                🌐 Visit Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}