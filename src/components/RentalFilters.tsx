"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Rental {
  id: string;
  name: string;
  price_range?: string | null;
  is_featured: boolean;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  booking_url?: string | null;
  cover_url?: string | null;
  description?: string | null;
  slug: string;
}

interface RentalFiltersProps {
  rentals: Rental[];
}

export default function RentalFilters({ rentals }: RentalFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [stayDuration, setStayDuration] = useState(searchParams.get("duration") || "all");
  const [amenityFilter, setAmenityFilter] = useState(searchParams.get("amenity") || "all");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  
  const filteredRentals = useMemo(() => {
    const filtered = rentals.filter(rental => {
      // Search filter
      if (searchTerm && !rental.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rental.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rental.address?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (priceFilter !== "all" && rental.price_range !== priceFilter) {
        return false;
      }
      
      // Featured filter
      if (featuredOnly && !rental.is_featured) {
        return false;
      }
      
      return true;
    });

    // Sort results
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => {
          const priceA = a.price_range?.length || 0;
          const priceB = b.price_range?.length || 0;
          return priceA - priceB;
        });
        break;
      case "price_high":
        filtered.sort((a, b) => {
          const priceA = a.price_range?.length || 0;
          const priceB = b.price_range?.length || 0;
          return priceB - priceA;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
    }

    return filtered;
  }, [rentals, searchTerm, priceFilter, featuredOnly, sortBy]);

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (stayDuration !== "all") params.set("duration", stayDuration);
    if (amenityFilter !== "all") params.set("amenity", amenityFilter);
    if (featuredOnly) params.set("featured", "true");
    if (sortBy !== "featured") params.set("sort", sortBy);
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
    setStayDuration("all");
    setAmenityFilter("all");
    setFeaturedOnly(false);
    setSortBy("featured");
    router.push(window.location.pathname);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties by name, location, or amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && updateURL()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                updateURL();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Price:</label>
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  updateURL();
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="$">$ Budget</option>
                <option value="$$">$$ Moderate</option>
                <option value="$$$">$$$ Upscale</option>
                <option value="$$$$">$$$$ Luxury</option>
              </select>
            </div>

            {/* Stay Duration */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Duration:</label>
              <select
                value={stayDuration}
                onChange={(e) => {
                  setStayDuration(e.target.value);
                  updateURL();
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              >
                <option value="all">Any Duration</option>
                <option value="short">Short Stay (1-7 days)</option>
                <option value="medium">Medium Stay (1-4 weeks)</option>
                <option value="long">Long Stay (1+ months)</option>
              </select>
            </div>

            {/* Amenities Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Amenities:</label>
              <select
                value={amenityFilter}
                onChange={(e) => {
                  setAmenityFilter(e.target.value);
                  updateURL();
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              >
                <option value="all">All Amenities</option>
                <option value="wifi">WiFi</option>
                <option value="pool">Swimming Pool</option>
                <option value="parking">Parking</option>
                <option value="kitchen">Kitchen</option>
                <option value="ac">Air Conditioning</option>
                <option value="ocean">Ocean View</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Featured:</label>
              <button
                onClick={() => {
                  setFeaturedOnly(!featuredOnly);
                  updateURL();
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  featuredOnly
                    ? "bg-haiti-coral text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {featuredOnly ? "⭐ On" : "☆ Off"}
              </button>
            </div>
          </div>

          {/* Sort & Clear */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateURL();
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              >
                <option value="featured">Featured First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-haiti-turquoise hover:text-haiti-turquoise/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm sub">
        <span>
          Showing {filteredRentals.length} of {rentals.length} properties
        </span>
        {(searchTerm || priceFilter !== "all" || stayDuration !== "all" || amenityFilter !== "all" || featuredOnly || sortBy !== "featured") && (
          <span className="text-haiti-turquoise">
            Filters applied
          </span>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setFeaturedOnly(true);
            updateURL();
          }}
          className="px-3 py-1 bg-haiti-coral/10 text-haiti-coral rounded-full text-xs hover:bg-haiti-coral/20 transition-colors"
        >
          ⭐ Featured
        </button>
        <button
          onClick={() => {
            setPriceFilter("$");
            updateURL();
          }}
          className="px-3 py-1 bg-haiti-amber/10 text-haiti-amber rounded-full text-xs hover:bg-haiti-amber/20 transition-colors"
        >
          💰 Budget Friendly
        </button>
        <button
          onClick={() => {
            setPriceFilter("$$$$");
            updateURL();
          }}
          className="px-3 py-1 bg-haiti-sage/10 text-haiti-sage rounded-full text-xs hover:bg-haiti-sage/20 transition-colors"
        >
          ✨ Luxury
        </button>
        <button
          onClick={() => {
            setStayDuration("long");
            updateURL();
          }}
          className="px-3 py-1 bg-haiti-teal/10 text-haiti-teal rounded-full text-xs hover:bg-haiti-teal/20 transition-colors"
        >
          🏠 Long Stay
        </button>
      </div>

      {/* No Results */}
      {filteredRentals.length === 0 && rentals.length > 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Properties Found</h3>
          <p className="sub text-sm mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg hover:bg-haiti-turquoise/80 transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}