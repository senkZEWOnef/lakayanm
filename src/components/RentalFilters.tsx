"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Rental {
  id: string;
  name: string;
  price_range?: string | null;
  is_featured: boolean;
  address?: string | null;
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
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");

  const filteredRentals = useMemo(() => {
    return rentals.filter((rental) => {
      if (
        searchTerm &&
        !rental.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rental.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !rental.address?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (priceFilter !== "all" && rental.price_range !== priceFilter) {
        return false;
      }

      if (featuredOnly && !rental.is_featured) {
        return false;
      }

      return true;
    });
  }, [rentals, searchTerm, priceFilter, featuredOnly]);

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (featuredOnly) params.set("featured", "true");

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("all");
    setFeaturedOnly(false);
    router.push(window.location.pathname);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <input
            type="text"
            placeholder="Search properties by name or neighborhood..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateURL()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
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
                <option value="$$$$">$$$$ Luxury</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Featured Only:</label>
              <button
                onClick={() => {
                  setFeaturedOnly(!featuredOnly);
                  updateURL();
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  featuredOnly ? "bg-haiti-coral text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {featuredOnly ? "⭐ On" : "☆ Off"}
              </button>
            </div>
          </div>

          <button onClick={clearFilters} className="text-sm text-brand hover:text-brand-dark transition-colors">
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm sub">
        <span>
          Showing {filteredRentals.length} of {rentals.length} properties
        </span>
        {(searchTerm || priceFilter !== "all" || featuredOnly) && <span className="text-brand">Filters applied</span>}
      </div>
    </div>
  );
}
