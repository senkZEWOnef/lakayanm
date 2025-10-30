"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// Department data with cities
const departmentsData = [
  {
    slug: 'artibonite',
    name: 'Artibonite',
    emoji: '🌾',
    cities: ['Gonaïves', 'Saint-Marc', 'Dessalines']
  },
  {
    slug: 'centre',
    name: 'Centre',
    emoji: '⛪',
    cities: ['Mirebalais', 'Hinche', 'Lascahobas']
  },
  {
    slug: 'grand-anse',
    name: 'Grand\'Anse',
    emoji: '🌿',
    cities: ['Jérémie', 'Anse-d\'Hainault', 'Moron']
  },
  {
    slug: 'nippes',
    name: 'Nippes',
    emoji: '🌊',
    cities: ['Miragoâne', 'Anse-à-Veau', 'Baradères']
  },
  {
    slug: 'nord',
    name: 'Nord',
    emoji: '🏰',
    cities: ['Cap-Haïtien', 'Limbé', 'Plaine-du-Nord']
  },
  {
    slug: 'nord-est',
    name: 'Nord-Est',
    emoji: '🏔️',
    cities: ['Ouanaminthe', 'Fort-Liberté', 'Trou-du-Nord']
  },
  {
    slug: 'nord-ouest',
    name: 'Nord-Ouest',
    emoji: '🗿',
    cities: ['Port-de-Paix', 'Saint-Louis-du-Nord', 'Jean-Rabel']
  },
  {
    slug: 'ouest',
    name: 'Ouest',
    emoji: '🏛️',
    cities: ['Port-au-Prince', 'Delmas', 'Carrefour']
  },
  {
    slug: 'sud',
    name: 'Sud',
    emoji: '🏖️',
    cities: ['Les Cayes', 'Aquin', 'Torbeck']
  },
  {
    slug: 'sud-est',
    name: 'Sud-Est',
    emoji: '🎨',
    cities: ['Jacmel', 'Bainet', 'Belle-Anse']
  }
];

// Flatten all cities with department info
const allCities = departmentsData.flatMap(dept => 
  dept.cities.map(city => ({
    name: city,
    department: dept.name,
    departmentSlug: dept.slug,
    departmentEmoji: dept.emoji,
    citySlug: city.toLowerCase().replace(/[']/g, '').replace(/[àâä]/g, 'a').replace(/[éèê]/g, 'e').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }))
);

type SortOption = 'alphabetical' | 'department';

export default function CitiesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort cities
  const filteredAndSortedCities = useMemo(() => {
    let filtered = allCities;

    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(city => city.departmentSlug === selectedDepartment);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'department') {
      filtered.sort((a, b) => {
        const deptCompare = a.department.localeCompare(b.department);
        return deptCompare !== 0 ? deptCompare : a.name.localeCompare(b.name);
      });
    }

    return filtered;
  }, [selectedDepartment, sortBy, searchQuery]);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/banner.png"
          alt="Haiti landscape"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Very subtle overlay for content readability */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80"></div>
      </div>

      <div className="relative z-10 space-y-8 md:space-y-20">
        {/* Header Section */}
        <section className="text-center py-12 md:py-24 relative">
          {/* Golden decorative frame - responsive */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-20 md:h-20 border-l-2 border-t-2 border-amber-400/40"></div>
          <div className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-20 md:h-20 border-r-2 border-t-2 border-amber-400/40"></div>
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-20 md:h-20 border-l-2 border-b-2 border-amber-400/40"></div>
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-20 md:h-20 border-r-2 border-b-2 border-amber-400/40"></div>
          
          {/* Inner golden accent lines - hidden on mobile */}
          <div className="absolute top-8 left-8 md:top-16 md:left-16 w-6 h-6 md:w-12 md:h-12 border-l border-t border-amber-400/20 hidden sm:block"></div>
          <div className="absolute top-8 right-8 md:top-16 md:right-16 w-6 h-6 md:w-12 md:h-12 border-r border-t border-amber-400/20 hidden sm:block"></div>
          <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 w-6 h-6 md:w-12 md:h-12 border-l border-b border-amber-400/20 hidden sm:block"></div>
          <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 w-6 h-6 md:w-12 md:h-12 border-r border-b border-amber-400/20 hidden sm:block"></div>
          
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-4 md:mb-6">
              Cities of Haiti
            </h1>
            
            {/* Golden accent line */}
            <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6 md:mb-10"></div>
            
            <p className="text-lg sm:text-xl md:text-2xl font-light text-amber-700 dark:text-amber-300 mb-4 md:mb-6 tracking-wide">
              DISCOVER 30 MAJOR CITIES
            </p>
            <p className="text-base md:text-xl text-slate-700 dark:text-slate-300 mb-8 md:mb-16 max-w-3xl mx-auto leading-relaxed px-4">
              Explore Haiti&apos;s vibrant urban centers across all 10 departments, each with its unique character and cultural treasures.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="relative">
          {/* Golden decorative corners for section */}
          <div className="absolute top-0 left-0 w-8 h-8 md:w-16 md:h-16 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-8 h-8 md:w-16 md:h-16 border-r-2 border-t-2 border-amber-400/30"></div>
          
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="relative bg-white/85 dark:bg-slate-800/85 backdrop-blur-lg border-2 border-amber-200/40 dark:border-amber-400/25 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl shadow-amber-400/5">
              {/* Golden corner accents */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-r-2 border-t-2 border-amber-400/50"></div>
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-l-2 border-b-2 border-amber-400/50"></div>
              
              {/* Central golden line decoration */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-400/20 to-transparent"></div>
              
              <div className="space-y-10">
                {/* Elegant Search Bar */}
                <div className="text-center">
                  <h2 className="text-2xl font-light text-slate-900 dark:text-slate-100 mb-6 tracking-wide">
                    Find Your Destination
                  </h2>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
                  
                  <div className="relative max-w-lg mx-auto group">
                    <input
                      type="text"
                      placeholder="Search cities or departments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-8 py-5 bg-white/95 dark:bg-slate-700/95 backdrop-blur-sm border-2 border-amber-200/60 dark:border-amber-400/40 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-amber-400 focus:outline-none transition-all duration-500 text-lg shadow-lg shadow-amber-400/5 group-hover:shadow-amber-400/10"
                    />
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-amber-400 hover:bg-amber-500 text-white rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Golden separator line */}
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-amber-400/30"></div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full mx-4 shadow-lg shadow-amber-400/30"></div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-400/30 to-amber-400/30"></div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                  {/* Department Filter */}
                  <div className="flex flex-col items-center gap-4">
                    <label className="text-slate-700 dark:text-slate-300 font-medium text-lg tracking-wide">Filter by Department</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-6 py-4 bg-white/95 dark:bg-slate-700/95 border-2 border-amber-200/60 dark:border-amber-400/40 rounded-xl text-slate-900 dark:text-slate-100 focus:border-amber-400 focus:outline-none transition-all duration-300 shadow-lg shadow-amber-400/5 hover:shadow-amber-400/10 min-w-[200px]"
                    >
                      <option value="all">All Departments</option>
                      {departmentsData.map(dept => (
                        <option key={dept.slug} value={dept.slug}>
                          {dept.emoji} {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vertical golden separator */}
                  <div className="hidden lg:block w-px h-20 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent"></div>

                  {/* Sort Options */}
                  <div className="flex flex-col items-center gap-4">
                    <label className="text-slate-700 dark:text-slate-300 font-medium text-lg tracking-wide">Sort Cities</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSortBy('alphabetical')}
                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg ${
                          sortBy === 'alphabetical'
                            ? 'bg-amber-400 text-white shadow-amber-400/30 scale-105'
                            : 'bg-white/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-amber-400/20 hover:scale-105 shadow-amber-400/5'
                        }`}
                      >
                        A→Z
                      </button>
                      <button
                        onClick={() => setSortBy('department')}
                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg ${
                          sortBy === 'department'
                            ? 'bg-amber-400 text-white shadow-amber-400/30 scale-105'
                            : 'bg-white/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 hover:bg-amber-400/20 hover:scale-105 shadow-amber-400/5'
                        }`}
                      >
                        Department
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Count with elegant styling */}
                <div className="text-center">
                  <div className="inline-flex items-center px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-400/30 rounded-xl">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 animate-pulse"></div>
                    <p className="text-amber-700 dark:text-amber-300 font-medium">
                      Showing {filteredAndSortedCities.length} of {allCities.length} cities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom golden accent lines */}
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>

        {/* Cities Grid Section */}
        <section className="relative pb-20">
          {/* Golden decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-400/30"></div>
          
          <div className="max-w-7xl mx-auto px-6">
            {filteredAndSortedCities.length === 0 ? (
              <div className="text-center py-20 relative">
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-3xl p-16 max-w-2xl mx-auto">
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/40"></div>
                  <div className="text-8xl mb-8">🔍</div>
                  <h3 className="text-3xl font-light text-slate-700 dark:text-slate-300 mb-4 tracking-wide">No cities found</h3>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Golden grid lines overlay */}
                <div className="absolute inset-0 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8 pointer-events-none">
                  <div className="border-r border-amber-400/8"></div>
                  <div className="border-r border-amber-400/8"></div>
                  <div className="border-r border-amber-400/8 hidden lg:block"></div>
                  <div className="hidden xl:block"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAndSortedCities.map((city) => (
                    <Link
                      key={`${city.departmentSlug}-${city.citySlug}`}
                      href={`/dept/${city.departmentSlug}/city/${city.citySlug}`}
                      className="relative group bg-white/85 dark:bg-slate-800/85 backdrop-blur-lg border-2 border-amber-200/40 dark:border-amber-400/25 rounded-3xl p-8 text-center hover:border-amber-400/70 hover:bg-white/95 dark:hover:bg-slate-800/95 transition-all duration-700 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-amber-400/15"
                    >
                      {/* Multiple golden corner accents */}
                      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/50 group-hover:border-amber-400/80 transition-colors duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-amber-400/30 group-hover:border-amber-400/60 transition-colors duration-500"></div>
                      
                      {/* Department Emoji with golden glow on hover */}
                      <div className="relative mb-3">
                        <div className="text-xl mb-2 transform group-hover:scale-105 transition-transform duration-500">
                          {city.departmentEmoji}
                        </div>
                        <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/10 rounded-full transition-colors duration-500 blur-xl"></div>
                      </div>
                      
                      {/* City Name with enhanced typography */}
                      <h3 className="font-semibold text-xl mb-4 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-500 tracking-wide">
                        {city.name}
                      </h3>
                      
                      {/* Department Badge with golden styling */}
                      <div className="inline-flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium border-2 border-amber-200/60 dark:border-amber-400/30 group-hover:border-amber-400/80 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-all duration-500">
                        {city.department}
                      </div>

                      {/* Enhanced golden bottom accent line */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 group-hover:w-4/5 transition-all duration-700 rounded-full"></div>
                      
                      {/* Subtle golden side accents */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-0 border-amber-400 group-hover:border-l-2 group-hover:h-16 transition-all duration-500"></div>
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-0 border-amber-400 group-hover:border-r-2 group-hover:h-16 transition-all duration-500"></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom golden accent lines */}
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>
      </div>
    </div>
  );
}