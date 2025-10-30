"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Department {
  id: string;
  slug: string;
  name: string;
  intro: string | null;
  hero_url: string | null;
}

interface DepartmentsSectionProps {
  departments: Department[];
}

export function DepartmentsSection({ departments }: DepartmentsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Custom department ordering as specified by user
  const departmentOrder = ['nord', 'sud', 'sud-est', 'nord-est', 'nord-ouest', 'centre', 'artibonite', 'nippes', 'grand-anse', 'ouest'];
  
  // Sort departments by custom order
  const sortedDepartments = departments.sort((a, b) => {
    const indexA = departmentOrder.indexOf(a.slug);
    const indexB = departmentOrder.indexOf(b.slug);
    return indexA - indexB;
  });
  
  // Show first 3 departments or all departments based on state
  const departmentsToShow = showAll ? sortedDepartments : sortedDepartments.slice(0, 3);

  return (
    <section className="relative">
      {/* Golden decorative corners for section */}
      <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
      
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl font-light tracking-tight text-slate-900 dark:text-slate-100 mb-6">
          Explore Haiti&apos;s 10 Departments
        </h2>
        
        {/* Golden accent line */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
        
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Discover unique experiences across all regions of Haiti. From northern fortresses to southern beaches,
          each department offers its own cultural treasures and local flavors waiting to be explored.
        </p>
      </div>

      <div className="space-y-8">
        {departments.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Golden grid accent lines */}
            <div className="absolute inset-0 grid md:grid-cols-3 gap-8 pointer-events-none">
              <div className="border-r border-amber-400/10"></div>
              <div className="border-r border-amber-400/10"></div>
              <div></div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center">
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40"></div>
                  <div className="w-16 h-16 bg-amber-200 dark:bg-amber-800 rounded-xl mx-auto mb-4"></div>
                  <div className="text-xl mb-3">⭐</div>
                  <div className="h-6 bg-amber-200 dark:bg-amber-800 rounded mb-2"></div>
                  <div className="h-4 bg-amber-100 dark:bg-amber-900 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 relative transition-all duration-700 ease-in-out">
              {/* Golden grid accent lines */}
              <div className="absolute inset-0 grid md:grid-cols-3 gap-8 pointer-events-none">
                <div className="border-r border-amber-400/10"></div>
                <div className="border-r border-amber-400/10"></div>
                <div></div>
              </div>
              
              {departmentsToShow.map((dept, index) => (
                <Link
                  key={dept.id}
                  href={`/dept/${dept.slug}`}
                  className={`relative group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-400/20 rounded-2xl p-6 text-center hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-400/10 ${
                    index >= 3 ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''
                  }`}
                >
                  {/* Golden corner accent */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
                  
                  {dept.hero_url && (
                    <div className="relative mb-6 overflow-hidden rounded-xl">
                      <Image
                        src={dept.hero_url}
                        alt={dept.name}
                        width={400}
                        height={160}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Golden overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  
                  <div className="text-xl mb-3 transform group-hover:scale-105 transition-transform duration-300">
                    {dept.slug === 'nord' && '🏰'}
                    {dept.slug === 'ouest' && '🏛️'}
                    {dept.slug === 'sud-est' && '🎨'}
                    {dept.slug === 'artibonite' && '🌾'}
                    {dept.slug === 'centre' && '⛪'}
                    {dept.slug === 'sud' && '🏖️'}
                    {dept.slug === 'grand-anse' && '🌿'}
                    {dept.slug === 'nord-est' && '🏔️'}
                    {dept.slug === 'nord-ouest' && '🗿'}
                    {dept.slug === 'nippes' && '🌊'}
                  </div>
                  
                  <h3 className="font-semibold text-xl mb-3 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
                    {dept.name}
                  </h3>
                  
                  {dept.intro && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {dept.intro}
                    </p>
                  )}

                  {/* Golden bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
                </Link>
              ))}
            </div>

            {/* Show More/Show Less Button */}
            {departments.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group relative inline-flex items-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-amber-200/50 dark:border-amber-400/25 rounded-2xl text-slate-900 dark:text-slate-100 hover:border-amber-400/60 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/10 animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  {/* Golden corner accent */}
                  <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-amber-400/40 group-hover:border-amber-400/60 transition-colors duration-300"></div>
                  
                  <span className="font-medium tracking-wide group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
                    {showAll ? 'Show Less' : `Show All ${departments.length} Departments`}
                  </span>
                  
                  <svg 
                    className={`w-5 h-5 ml-3 transition-transform duration-500 ${showAll ? 'rotate-180' : ''} group-hover:text-amber-500`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>

                  {/* Golden bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-3/4 transition-all duration-500"></div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bottom golden accent lines */}
      <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
    </section>
  );
}