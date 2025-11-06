import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

async function getCityLandmarks(slug: string, citySlug: string) {
  const dept = await prisma.departments.findUnique({ where: { slug } });
  if (!dept || !dept.is_published) return null;

  const city = await prisma.cities.findFirst({
    where: { slug: citySlug, department_id: dept.id, is_published: true },
  });
  if (!city) return null;

  // Get all landmarks
  const landmarks = await prisma.places.findMany({
    where: { 
      city_id: city.id, 
      is_published: true,
      kind: 'landmark'
    },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });

  return { dept, city, landmarks };
}

export default async function LandmarksPage({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city: citySlug } = await params;
  const data = await getCityLandmarks(slug, citySlug);
  
  if (!data) return <div className="sub">City not found.</div>;
  
  const { dept, city, landmarks } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/dept/${slug}/city/${citySlug}`} className="text-brand hover:text-brand-dark text-sm mb-2 inline-block">
            ← Back to {city.name}
          </Link>
          <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise">
            🏛️ Historic Landmarks in {city.name}
          </h1>
          <p className="sub mt-2">{dept.name} Department • {landmarks.length} landmarks</p>
        </div>
      </div>

      {/* Landmarks Grid */}
      {landmarks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landmarks.map((landmark) => (
            <Link key={landmark.id} href={`/dept/${slug}/city/${citySlug}/landmarks/${landmark.slug}`} className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-coral">
              {landmark.cover_url && (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                  <Image 
                    src={landmark.cover_url} 
                    alt={landmark.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {landmark.unesco_site && (
                    <div className="absolute top-3 right-3 bg-haiti-amber text-white text-xs px-2 py-1 rounded-full font-medium">
                      UNESCO Site
                    </div>
                  )}
                  {landmark.is_featured && (
                    <div className="absolute top-3 left-3 bg-haiti-coral text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
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
              
              {/* Details */}
              <div className="space-y-2 mb-4">
                {landmark.address && (
                  <p className="text-xs sub">📍 {landmark.address}</p>
                )}
                {landmark.entrance_fee && (
                  <p className="text-xs text-haiti-coral">💰 {landmark.entrance_fee}</p>
                )}
                {landmark.best_visiting_time && (
                  <p className="text-xs sub">⏰ Best time: {landmark.best_visiting_time}</p>
                )}
                {landmark.guided_tours && (
                  <p className="text-xs text-haiti-teal">👥 Guided tours available</p>
                )}
                {landmark.accessibility && (
                  <p className="text-xs text-haiti-sage">♿ {landmark.accessibility}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-brand text-sm font-medium group-hover:text-brand-dark transition-colors">
                  Get Directions →
                </div>
                <span className="text-xs px-2 py-1 bg-haiti-coral/10 text-haiti-coral rounded-full">
                  🏛️ Landmark
                </span>
              </div>
              
              {/* Contact Info */}
              {(landmark.phone || landmark.website) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  {landmark.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📞</span>
                      <a href={`tel:${landmark.phone}`} className="text-xs text-brand hover:text-brand-dark">
                        {landmark.phone}
                      </a>
                    </div>
                  )}
                  {landmark.website && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🌐</span>
                      <a 
                        href={landmark.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-brand hover:text-brand-dark"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Landmarks Yet</h3>
          <p className="sub">We're working on adding historic landmarks for {city.name}. Check back soon!</p>
        </div>
      )}
    </div>
  );
}