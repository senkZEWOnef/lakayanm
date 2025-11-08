import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import RentalsFilters from "@/components/RentalsFilters";

async function getAllRentals() {
  const rentals = await prisma.places.findMany({
    where: { 
      kind: { in: ['hotel', 'shop'] }, // Using existing enum values for rentals/accommodations
      is_published: true 
    },
    include: {
      city: {
        include: {
          department: true
        }
      }
    },
    orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
  });

  return rentals;
}

async function getDepartments() {
  return await prisma.departments.findMany({
    where: { is_published: true },
    orderBy: { name: 'asc' }
  });
}

async function getCities() {
  return await prisma.cities.findMany({
    where: { is_published: true },
    include: { department: true },
    orderBy: { name: 'asc' }
  });
}

export default async function RentalsPage() {
  const [rentals, departments, cities] = await Promise.all([
    getAllRentals(),
    getDepartments(),
    getCities()
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/home" className="text-brand hover:text-brand-dark text-sm">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
          🏠 Vacation Rentals & Stays
        </h1>
        <p className="text-lg sub max-w-3xl mx-auto">
          Find your perfect accommodation across Haiti. From luxury hotels to cozy vacation rentals, 
          discover comfortable stays in every department.
        </p>
      </div>

      {/* Filters */}
      <RentalsFilters 
        rentals={rentals} 
        departments={departments}
        cities={cities}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand">{rentals.filter(r => r.kind === 'hotel').length}</div>
          <p className="text-sm sub">Hotels</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-teal">{rentals.filter(r => r.kind === 'shop').length}</div>
          <p className="text-sm sub">Local Rentals</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-coral">{departments.length}</div>
          <p className="text-sm sub">Departments</p>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-haiti-amber">{rentals.filter(r => r.is_featured).length}</div>
          <p className="text-sm sub">Featured</p>
        </div>
      </div>

      {/* Featured Rentals */}
      {rentals.filter(r => r.is_featured).length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6">
            ⭐ Featured Properties
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {rentals.filter(r => r.is_featured).slice(0, 6).map((rental) => (
              <Link 
                key={rental.id} 
                href={`/dept/${rental.city.department.slug}/city/${rental.city.slug}/rentals/${rental.slug}`} 
                className="card hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-haiti-turquoise"
              >
                {rental.cover_url && (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                    <Image 
                      src={rental.cover_url} 
                      alt={rental.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 bg-haiti-turquoise text-white text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      📍 {rental.city.name}, {rental.city.department.name}
                    </div>
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
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rental.kind === 'hotel' ? 'bg-brand/10 text-brand' : 'bg-haiti-teal/10 text-haiti-teal'
                  }`}>
                    {rental.kind === 'hotel' ? '🏨 Hotel' : '🏠 Rental'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Rentals */}
      <section id="all-rentals">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">
            All Properties ({rentals.length})
          </h2>
          <div className="h-px bg-gradient-to-r from-haiti-turquoise to-haiti-teal flex-1"></div>
        </div>
        
        {rentals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="rental-results">
            {rentals.map((rental) => (
              <Link 
                key={rental.id} 
                href={`/dept/${rental.city.department.slug}/city/${rental.city.slug}/rentals/${rental.slug}`} 
                className="card hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {rental.cover_url && (
                  <div className="relative w-full h-40 mb-3 overflow-hidden rounded-xl">
                    <Image 
                      src={rental.cover_url} 
                      alt={rental.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {rental.is_featured && (
                      <div className="absolute top-2 right-2 bg-haiti-turquoise text-white text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}
                
                <h3 className="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise mb-2 line-clamp-1">
                  {rental.name}
                </h3>
                
                <p className="text-xs text-haiti-coral mb-2">
                  📍 {rental.city.name}, {rental.city.department.name}
                </p>
                
                {rental.description && (
                  <p className="sub text-sm line-clamp-2 mb-3">{rental.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  {rental.price_range && (
                    <p className="text-xs text-haiti-turquoise font-medium">💰 {rental.price_range}</p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rental.kind === 'hotel' ? 'bg-brand/10 text-brand' : 'bg-haiti-teal/10 text-haiti-teal'
                  }`}>
                    {rental.kind === 'hotel' ? '🏨' : '🏠'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Properties Found</h3>
            <p className="sub">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <div className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20 text-center py-8">
        <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
          List Your Property
        </h3>
        <p className="sub mb-6 max-w-2xl mx-auto">
          Join our platform and reach thousands of travelers looking for authentic Haitian experiences. 
          Start earning from your property today.
        </p>
        <Link 
          href="/rentals/list-property" 
          className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium"
        >
          List Your Property →
        </Link>
      </div>
    </div>
  );
}