import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import RentalGallery from "@/components/RentalGallery";
import BookingWidget from "@/components/BookingWidget";

async function getRentalData(slug: string, citySlug: string, rentalSlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  const rental = await prisma.places.findFirst({
    where: { 
      slug: rentalSlug,
      city_id: city.id, 
      is_published: true,
      kind: 'hotel'
    },
  });
  if (!rental) return null;

  // Get rental gallery photos
  const gallery = await prisma.media.findMany({
    where: { place_id: rental.id },
    orderBy: { created_at: "desc" },
  });

  return { dept, city, rental, gallery };
}

export default async function RentalPage({ params }: { params: Promise<{ slug: string; city: string; rental: string }> }) {
  const { slug, city: citySlug, rental: rentalSlug } = await params;
  const session = await getServerSession();
  const data = await getRentalData(slug, citySlug, rentalSlug);
  
  if (!data) return <div className="sub">Property not found.</div>;
  
  const { dept, city, rental, gallery } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/dept/${slug}/city/${citySlug}`} className="text-brand hover:text-brand-dark text-sm">
            ← Back to {city.name}
          </Link>
          <span className="text-sm sub">•</span>
          <Link href={`/dept/${slug}/city/${citySlug}/rentals`} className="text-brand hover:text-brand-dark text-sm">
            All Rentals
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">
              {rental.name}
            </h1>
            <p className="sub mb-2">{city.name}, {dept.name} Department</p>
            
            {rental.address && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">📍 {rental.address}</p>
            )}
            
            {rental.description && (
              <div className="mt-4 p-4 bg-haiti-turquoise/10 border-l-4 border-haiti-turquoise rounded-r-lg">
                <p className="text-sm">{rental.description}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            {rental.is_featured && (
              <span className="bg-haiti-coral text-white text-xs px-3 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            <span className="bg-haiti-turquoise text-white text-xs px-3 py-1 rounded-full font-medium">
              🏠 Vacation Rental
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          {rental.cover_url && (
            <div className="relative w-full h-96 overflow-hidden rounded-xl">
              <Image 
                src={rental.cover_url} 
                alt={rental.name} 
                fill 
                className="object-cover" 
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          )}

          {/* Property Description */}
          <div className="card">
            <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">About This Property</h2>
            <div className="prose prose-sm max-w-none">
              <p className="leading-relaxed">
                {rental.description || "This beautiful vacation rental offers the perfect getaway in the heart of " + city.name + 
                ". Experience authentic Haitian hospitality while enjoying modern comforts and amenities."}
              </p>
            </div>
            
            {/* Amenities */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-haiti-turquoise">📶</span>
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-haiti-turquoise">❄️</span>
                <span>Air Conditioning</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-haiti-turquoise">🚿</span>
                <span>Private Bathroom</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-haiti-turquoise">🍳</span>
                <span>Kitchen Access</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-haiti-turquoise">🏊</span>
                <span>Swimming Pool</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-haiti-turquoise">🚗</span>
                <span>Free Parking</span>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <RentalGallery 
            rentalId={rental.id}
            rentalName={rental.name}
            initialPhotos={gallery}
            userSession={session}
          />

          {/* Location & Nearby */}
          <div className="card">
            <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Location & Nearby</h2>
            <div className="space-y-4">
              {rental.address && (
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm sub">{rental.address}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">What&apos;s Nearby</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>🏛️</span>
                    <span>Citadelle Laferrière - 5 min drive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏖️</span>
                    <span>Labadee Beach - 15 min drive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🍽️</span>
                    <span>Local restaurants - Walking distance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏪</span>
                    <span>Local market - 2 min walk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking & Info */}
        <div className="space-y-6">
          {/* Booking Widget */}
          <BookingWidget rental={rental} />

          {/* Host Information */}
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Your Host</h3>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-haiti-turquoise rounded-full flex items-center justify-center text-white font-bold">
                H
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Host Name</h4>
                <p className="text-sm sub">Superhost • Hosting since 2020</p>
                <p className="text-xs text-haiti-turquoise mt-1">⭐ 4.9 rating • 150+ reviews</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full bg-haiti-turquoise text-white py-2 rounded-lg hover:bg-haiti-turquoise/80 transition-colors text-sm font-medium">
                Contact Host
              </button>
            </div>
          </div>

          {/* Property Info */}
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-haiti-turquoise">🏠</span>
                <div>
                  <p className="font-medium text-sm">Property Type</p>
                  <p className="text-sm sub">Vacation Rental</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-haiti-turquoise">👥</span>
                <div>
                  <p className="font-medium text-sm">Guests</p>
                  <p className="text-sm sub">Up to 4 guests</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-haiti-turquoise">🛏️</span>
                <div>
                  <p className="font-medium text-sm">Bedrooms</p>
                  <p className="text-sm sub">2 bedrooms, 2 beds</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-haiti-turquoise">🚿</span>
                <div>
                  <p className="font-medium text-sm">Bathrooms</p>
                  <p className="text-sm sub">1 bathroom</p>
                </div>
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">House Rules</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Check-in: After 3:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Check-out: Before 11:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Self check-in with keypad</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>No smoking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>No pets</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>No parties or events</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card space-y-3">
            {rental.phone && (
              <button 
                onClick={() => window.open(`tel:${rental.phone}`)}
                className="w-full bg-haiti-coral text-white py-3 rounded-lg hover:bg-haiti-coral/80 transition-colors font-medium"
              >
                📞 Call Property
              </button>
            )}
            
            {rental.website && (
              <button 
                onClick={() => window.open(rental.website!, '_blank')}
                className="w-full bg-haiti-teal text-white py-3 rounded-lg hover:bg-haiti-teal/80 transition-colors font-medium"
              >
                🌐 Visit Website
              </button>
            )}

            <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
              💝 Save to Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">⭐ Reviews</h2>
          <span className="text-sm sub">4.9 • 15 reviews</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-haiti-coral rounded-full flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <div>
                <h4 className="font-semibold">Marie</h4>
                <p className="text-xs sub">March 2024</p>
              </div>
              <div className="ml-auto text-haiti-amber">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-sm">
              &quot;Amazing stay! The property was exactly as described and the location was perfect. 
              Our host was very responsive and helpful. Highly recommend!&quot;
            </p>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-haiti-teal rounded-full flex items-center justify-center text-white font-bold text-sm">
                J
              </div>
              <div>
                <h4 className="font-semibold">Jean</h4>
                <p className="text-xs sub">February 2024</p>
              </div>
              <div className="ml-auto text-haiti-amber">⭐⭐⭐⭐⭐</div>
            </div>
            <p className="text-sm">
              &quot;Great place to stay in Cap-Haïtien. Clean, comfortable, and great value. 
              Walking distance to many attractions. Will definitely book again!&quot;
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <button className="text-haiti-turquoise hover:text-haiti-turquoise/80 text-sm font-medium">
            Show all 15 reviews →
          </button>
        </div>
      </div>
    </div>
  );
}