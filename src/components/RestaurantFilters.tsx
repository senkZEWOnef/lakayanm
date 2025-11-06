"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  kind: string;
  price_range?: string | null;
  is_featured: boolean;
  address?: string | null;
  phone?: string | null;
  cover_url?: string | null;
  description?: string | null;
  slug: string;
}

interface RestaurantFiltersProps {
  restaurants: Restaurant[];
}

export default function RestaurantFilters({ restaurants }: RestaurantFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");
  
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      // Search filter
      if (searchTerm && !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (selectedType !== "all" && restaurant.kind !== selectedType) {
        return false;
      }
      
      // Price filter
      if (priceFilter !== "all" && restaurant.price_range !== priceFilter) {
        return false;
      }
      
      // Featured filter
      if (featuredOnly && !restaurant.is_featured) {
        return false;
      }
      
      return true;
    });
  }, [restaurants, searchTerm, selectedType, priceFilter, featuredOnly]);

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedType !== "all") params.set("type", selectedType);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (featuredOnly) params.set("featured", "true");
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setPriceFilter("all");
    setFeaturedOnly(false);
    router.push(window.location.pathname);
  };

  const getTypeCount = (type: string) => {
    if (type === "all") return restaurants.length;
    return restaurants.filter(r => r.kind === type).length;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurants, cuisines, or dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && updateURL()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
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
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  updateURL();
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="all">All ({getTypeCount("all")})</option>
                <option value="restaurant">🍽️ Restaurants ({getTypeCount("restaurant")})</option>
                <option value="shop">🏪 Local Shops ({getTypeCount("shop")})</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Price:</label>
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  updateURL();
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="$">$ Budget</option>
                <option value="$$">$$ Moderate</option>
                <option value="$$$">$$$ Upscale</option>
                <option value="$$$$">$$$$ Fine Dining</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Featured Only:</label>
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

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="text-sm text-brand hover:text-brand-dark transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm sub">
        <span>
          Showing {filteredRestaurants.length} of {restaurants.length} establishments
        </span>
        {(searchTerm || selectedType !== "all" || priceFilter !== "all" || featuredOnly) && (
          <span className="text-brand">
            Filters applied
          </span>
        )}
      </div>

      {/* No Results */}
      {filteredRestaurants.length === 0 && restaurants.length > 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Results Found</h3>
          <p className="sub text-sm mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/80 transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}