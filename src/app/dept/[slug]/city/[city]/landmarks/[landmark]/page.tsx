import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import LandmarkGallery from "@/components/LandmarkGallery";

async function getLandmarkData(slug: string, citySlug: string, landmarkSlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  const landmark = await prisma.places.findFirst({
    where: { 
      slug: landmarkSlug,
      city_id: city.id, 
      is_published: true,
      kind: 'landmark'
    },
  });
  if (!landmark) return null;

  // Get landmark gallery photos
  const gallery = await prisma.media.findMany({
    where: { place_id: landmark.id },
    orderBy: { created_at: "desc" },
  });

  return { dept, city, landmark, gallery };
}

export default async function LandmarkPage({ params }: { params: Promise<{ slug: string; city: string; landmark: string }> }) {
  const { slug, city: citySlug, landmark: landmarkSlug } = await params;
  const session = await getServerSession();
  const data = await getLandmarkData(slug, citySlug, landmarkSlug);
  
  if (!data) return <div className="sub">Landmark not found.</div>;
  
  const { dept, city, landmark, gallery } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/dept/${slug}/city/${citySlug}`} className="text-brand hover:text-brand-dark text-sm">
            ← Back to {city.name}
          </Link>
          <span className="text-sm sub">•</span>
          <Link href={`/dept/${slug}/city/${citySlug}/landmarks`} className="text-brand hover:text-brand-dark text-sm">
            All Landmarks
          </Link>
        </div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">
              {landmark.name}
            </h1>
            <p className="sub">{city.name}, {dept.name} Department</p>
            
            {landmark.historical_significance && (
              <div className="mt-4 p-4 bg-haiti-amber/10 border-l-4 border-haiti-amber rounded-r-lg">
                <p className="text-haiti-amber font-medium text-sm">Historical Significance</p>
                <p className="text-sm">{landmark.historical_significance}</p>
              </div>
            )}
          </div>
          
          {(landmark.unesco_site || landmark.is_featured) && (
            <div className="flex gap-2 ml-4">
              {landmark.unesco_site && (
                <span className="bg-haiti-amber text-white text-xs px-3 py-1 rounded-full font-medium">
                  UNESCO Site
                </span>
              )}
              {landmark.is_featured && (
                <span className="bg-haiti-coral text-white text-xs px-3 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          {landmark.cover_url && (
            <div className="relative w-full h-96 overflow-hidden rounded-xl">
              <Image 
                src={landmark.cover_url} 
                alt={landmark.name} 
                fill 
                className="object-cover" 
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          )}

          {/* Description */}
          {landmark.description && (
            <div className="card">
              <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">About</h2>
              <p className="leading-relaxed">{landmark.description}</p>
            </div>
          )}

          {/* Gallery Section */}
          <LandmarkGallery 
            landmarkId={landmark.id}
            landmarkName={landmark.name}
            initialPhotos={gallery}
            userSession={session}
          />
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Visitor Information */}
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Visitor Information</h3>
            <div className="space-y-3">
              {landmark.address && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">📍</span>
                  <div>
                    <p className="font-medium text-sm">Address</p>
                    <p className="text-sm sub">{landmark.address}</p>
                  </div>
                </div>
              )}
              
              {landmark.entrance_fee && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">💰</span>
                  <div>
                    <p className="font-medium text-sm">Entrance Fee</p>
                    <p className="text-sm sub">{landmark.entrance_fee}</p>
                  </div>
                </div>
              )}
              
              {landmark.best_visiting_time && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">⏰</span>
                  <div>
                    <p className="font-medium text-sm">Best Time to Visit</p>
                    <p className="text-sm sub">{landmark.best_visiting_time}</p>
                  </div>
                </div>
              )}
              
              {landmark.guided_tours && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-teal mt-1">👥</span>
                  <div>
                    <p className="font-medium text-sm">Guided Tours</p>
                    <p className="text-sm sub">Available on site</p>
                  </div>
                </div>
              )}
              
              {landmark.accessibility && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-sage mt-1">♿</span>
                  <div>
                    <p className="font-medium text-sm">Accessibility</p>
                    <p className="text-sm sub">{landmark.accessibility}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(landmark.phone || landmark.website) && (
            <div className="card">
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Contact</h3>
              <div className="space-y-3">
                {landmark.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-haiti-coral">📞</span>
                    <a href={`tel:${landmark.phone}`} className="text-brand hover:text-brand-dark font-medium">
                      {landmark.phone}
                    </a>
                  </div>
                )}
                {landmark.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-haiti-coral">🌐</span>
                    <a 
                      href={landmark.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand hover:text-brand-dark font-medium"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="card">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">Get Directions</h3>
            <div className="space-y-3">
              {landmark.gps_coordinates && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">🗺️</span>
                  <div>
                    <p className="font-medium text-sm">GPS Coordinates</p>
                    <p className="text-sm sub font-mono">{landmark.gps_coordinates}</p>
                  </div>
                </div>
              )}
              
              {landmark.directions_text && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">🧭</span>
                  <div>
                    <p className="font-medium text-sm">Directions</p>
                    <p className="text-sm sub">{landmark.directions_text}</p>
                  </div>
                </div>
              )}
              
              {landmark.parking_info && (
                <div className="flex items-start gap-3">
                  <span className="text-haiti-coral mt-1">🚗</span>
                  <div>
                    <p className="font-medium text-sm">Parking</p>
                    <p className="text-sm sub">{landmark.parking_info}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full bg-haiti-coral text-white py-3 rounded-lg hover:bg-haiti-coral/80 transition-colors font-medium">
                Open in Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}