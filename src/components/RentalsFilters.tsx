"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Rental {
  id: string;
  name: string;
  kind: string;
  price_range?: string | null;
  is_featured: boolean;
  description?: string | null;
  address?: string | null;
  city: {
    id: string;
    name: string;
    slug: string;
    department: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface City {
  id: string;
  name: string;
  slug: string;
  department: {
    id: string;
    name: string;
    slug: string;
  };
}

interface RentalsFiltersProps {
  rentals: Rental[];
  departments: Department[];
  cities: City[];
}

export default function RentalsFilters({ rentals, departments, cities }: RentalsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get("dept") || "all");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "all");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "all");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  
  const filteredRentals = useMemo(() => {
    const filtered = rentals.filter(rental => {
      // Search filter
      if (searchTerm && !rental.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rental.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rental.address?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rental.city.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !rental.city.department.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Department filter
      if (selectedDepartment !== "all" && rental.city.department.slug !== selectedDepartment) {
        return false;
      }
      
      // City filter
      if (selectedCity !== "all" && rental.city.slug !== selectedCity) {
        return false;
      }
      
      // Price filter
      if (priceFilter !== "all" && rental.price_range !== priceFilter) {
        return false;
      }
      
      // Type filter
      if (typeFilter !== "all" && rental.kind !== typeFilter) {
        return false;
      }
      
      // Featured filter
      if (featuredOnly && !rental.is_featured) {
        return false;
      }
      
      return true;
    });

    // Sort results
    if (sortBy === "name") {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "location") {
      return filtered.sort((a, b) => {
        const locationA = `${a.city.department.name} - ${a.city.name}`;
        const locationB = `${b.city.department.name} - ${b.city.name}`;
        return locationA.localeCompare(locationB);
      });
    } else {
      return filtered.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      });
    }

    return filtered;
  }, [rentals, searchTerm, selectedDepartment, selectedCity, priceFilter, typeFilter, featuredOnly, sortBy]);

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedDepartment !== "all") params.set("dept", selectedDepartment);
    if (selectedCity !== "all") params.set("city", selectedCity);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (featuredOnly) params.set("featured", "true");
    if (sortBy !== "featured") params.set("sort", sortBy);
    
    router.push(`/rentals?${params.toString()}`, { scroll: false });
  };

  // Update rental results on page
  const updateResults = () => {
    const resultsContainer = document.getElementById('rental-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = filteredRentals.map(rental => `
        <a href="/dept/${rental.city.department.slug}/city/${rental.city.slug}/rentals/${rental.slug}" 
           class="card hover:shadow-xl transition-all duration-300 group cursor-pointer">
          ${rental.cover_url ? `
            <div class="relative w-full h-40 mb-3 overflow-hidden rounded-xl">
              <img src="${rental.cover_url}" alt="${rental.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
              ${rental.is_featured ? '<div class="absolute top-2 right-2 bg-haiti-turquoise text-white text-xs px-2 py-1 rounded-full font-medium">Featured</div>' : ''}
            </div>
          ` : ''}
          <h3 class="font-bold text-lg text-haiti-navy dark:text-haiti-turquoise mb-2 line-clamp-1">${rental.name}</h3>
          <p class="text-xs text-haiti-coral mb-2">📍 ${rental.city.name}, ${rental.city.department.name}</p>
          ${rental.description ? `<p class="sub text-sm line-clamp-2 mb-3">${rental.description}</p>` : ''}
          <div class="flex items-center justify-between">
            ${rental.price_range ? `<p class="text-xs text-haiti-turquoise font-medium">💰 ${rental.price_range}</p>` : '<span></span>'}
            <span class="text-xs px-2 py-1 rounded-full ${rental.kind === 'hotel' ? 'bg-brand/10 text-brand' : 'bg-haiti-teal/10 text-haiti-teal'}">
              ${rental.kind === 'hotel' ? '🏨' : '🏠'}
            </span>
          </div>
        </a>
      `).join('');
    }
  };

  // Get filtered cities based on selected department
  const filteredCities = useMemo(() => {
    if (selectedDepartment === "all") return cities;
    return cities.filter(city => city.department.slug === selectedDepartment);
  }, [cities, selectedDepartment]);

  // Helper functions for counts
  const getTypeCount = (type: string) => {
    if (type === "all") return filteredRentals.length;
    return filteredRentals.filter(r => r.kind === type).length;
  };

  const getDepartmentCount = (deptSlug: string) => {
    if (deptSlug === "all") return filteredRentals.length;
    return filteredRentals.filter(r => r.city.department.slug === deptSlug).length;
  };

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    const urlSearchTerm = searchParams.get("search");
    const urlDepartment = searchParams.get("dept");
    const urlCity = searchParams.get("city");
    const urlPrice = searchParams.get("price");
    const urlType = searchParams.get("type");
    const urlFeatured = searchParams.get("featured");
    const urlSort = searchParams.get("sort");

    if (urlSearchTerm) setSearchTerm(urlSearchTerm);
    if (urlDepartment) setSelectedDepartment(urlDepartment);
    if (urlCity) setSelectedCity(urlCity);
    if (urlPrice) setPriceFilter(urlPrice);
    if (urlType) setTypeFilter(urlType);
    if (urlFeatured === "true") setFeaturedOnly(true);
    if (urlSort) setSortBy(urlSort);
  }, [searchParams]);

  // Update results whenever filters change
  useEffect(() => {
    updateResults();
  }, [filteredRentals]);

  return (
    <div className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            Search Properties
          </label>
          <input
            type="text"
            placeholder="Search by name, location, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent bg-white dark:bg-gray-800 text-sm"
          />
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedCity("all"); // Reset city when department changes
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Departments ({getDepartmentCount("all")})</option>
            {departments.map(dept => (
              <option key={dept.slug} value={dept.slug}>
                {dept.name} ({getDepartmentCount(dept.slug)})
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Cities</option>
            {filteredCities.map(city => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            Property Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Types ({getTypeCount("all")})</option>
            <option value="hotel">🏨 Hotels ({getTypeCount("hotel")})</option>
            <option value="shop">🏠 Rentals ({getTypeCount("shop")})</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            Price Range
          </label>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">All Prices</option>
            <option value="$">$ Budget</option>
            <option value="$$">$$ Moderate</option>
            <option value="$$$">$$$ Luxury</option>
            <option value="$$$$">$$$$ Premium</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent bg-white dark:bg-gray-800 text-sm"
          >
            <option value="featured">Featured First</option>
            <option value="name">Name A-Z</option>
            <option value="location">Location</option>
          </select>
        </div>

        {/* Featured Only */}
        <div>
          <label className="block text-sm font-medium text-haiti-navy dark:text-haiti-turquoise mb-2">
            &nbsp;
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-haiti-turquoise focus:ring-haiti-turquoise"
            />
            <span className="text-sm">Featured Properties Only</span>
          </label>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {searchTerm && (
          <span className="bg-haiti-turquoise text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            Search: {searchTerm}
            <button onClick={() => setSearchTerm("")} className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">×</button>
          </span>
        )}
        {selectedDepartment !== "all" && (
          <span className="bg-haiti-coral text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {departments.find(d => d.slug === selectedDepartment)?.name}
            <button onClick={() => setSelectedDepartment("all")} className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">×</button>
          </span>
        )}
        {selectedCity !== "all" && (
          <span className="bg-haiti-teal text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {filteredCities.find(c => c.slug === selectedCity)?.name}
            <button onClick={() => setSelectedCity("all")} className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">×</button>
          </span>
        )}
        {featuredOnly && (
          <span className="bg-haiti-amber text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            Featured Only
            <button onClick={() => setFeaturedOnly(false)} className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center">×</button>
          </span>
        )}
      </div>

      {/* Apply Filters Button */}
      <div className="flex justify-between items-center">
        <p className="text-sm sub">
          Showing {filteredRentals.length} of {rentals.length} properties
        </p>
        <button
          onClick={updateURL}
          className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg hover:bg-haiti-turquoise/80 transition-colors text-sm font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}