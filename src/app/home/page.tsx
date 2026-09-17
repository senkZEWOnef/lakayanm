"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Featured cities for "Discover Haiti"
const featuredCities = [
  {
    slug: "cap-haitien",
    name: "Cap-Haïtien",
    tagline: "The Royal Capital",
    description: "Former colonial capital known as 'Paris of the Antilles.' Home to the magnificent Citadelle Laferrière and rich revolutionary history.",
    image: "/cap-haitien.jpg",
    highlights: ["Citadelle Laferrière", "Sans-Souci Palace", "Colonial Architecture"],
  },
  {
    slug: "port-au-prince",
    name: "Port-au-Prince",
    tagline: "Heart of the Nation",
    description: "Haiti's vibrant capital where art, politics, and culture collide. The beating heart of Haitian creativity and innovation.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    highlights: ["Iron Market", "Musée du Panthéon", "Art Scene"],
  },
  {
    slug: "jacmel",
    name: "Jacmel",
    tagline: "The Artistic Soul",
    description: "Famous for its carnival papier-mâché arts, stunning French colonial architecture, and the mystical Bassin Bleu pools.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    highlights: ["Carnival Arts", "Bassin Bleu", "French Colonial"],
  },
  {
    slug: "gonaives",
    name: "Gonaïves",
    tagline: "Birthplace of Freedom",
    description: "Where Haitian independence was declared in 1804. This sacred city holds the keys to understanding Haiti's revolutionary spirit.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    highlights: ["Independence Square", "Freedom Museum", "Revolutionary History"],
  },
  {
    slug: "les-cayes",
    name: "Les Cayes",
    tagline: "Southern Gateway",
    description: "Southern port city and gateway to pristine Île-à-Vache. Experience authentic coastal life and traditional fishing culture.",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
    highlights: ["Île-à-Vache Ferry", "Gelée Beach", "Coastal Culture"],
  },
  {
    slug: "jeremie",
    name: "Jérémie",
    tagline: "City of Poets",
    description: "Where Haiti's literary giants were born. Explore 19th-century colonial homes and the rich intellectual heritage of Haiti.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    highlights: ["Writers' Legacy", "Colonial Homes", "Literary Heritage"],
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const scrollSlide = (index: number) => {
    setCurrentSlide(index);
    const slideshow = document.getElementById('social-slideshow');
    if (slideshow) {
      const slideWidth = slideshow.children[0].clientWidth;
      slideshow.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % 3;
        scrollSlide(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        {/* Darker overlay for better contrast */}
        <div className="absolute inset-0 bg-slate-900/85 dark:bg-slate-900/90"></div>
      </div>

      <div className="relative z-10 space-y-8 md:space-y-16">
        {/* Modern Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Dynamic Background Grid */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
            
            {/* Geometric Lines */}
            <div className="absolute inset-0">
              <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,50 L0,100 Z" fill="url(#gradient1)" />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span>Discover the Soul of Haiti</span>
            </div>
            
            {/* Main Title - Massive & Modern */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-tighter leading-none mb-6">
              <span className="bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                HAÏTI
              </span>
            </h1>
            
            {/* Subtitle with motion */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-2xl md:text-4xl font-light text-amber-200 mb-8">
              <span className="animate-fade-in-up delay-300">Culture</span>
              <span className="text-amber-500 animate-pulse">•</span>
              <span className="animate-fade-in-up delay-500">Places</span>
              <span className="text-amber-500 animate-pulse delay-700">•</span>
              <span className="animate-fade-in-up delay-700">Stories</span>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up delay-1000">
              Journey through <strong className="text-amber-400">6 remarkable cities</strong> where revolutionary history meets vibrant culture, 
              and every street corner tells a story of resilience, art, and triumph.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-1200">
              <Link
                href="/cities/cap-haitien"
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/25 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Exploring
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
              
              <button className="px-8 py-4 text-amber-400 border border-amber-400/50 rounded-full hover:bg-amber-400/10 transition-colors duration-300 font-medium">
                Watch Video
              </button>
            </div>
            
            {/* Floating Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up delay-1400">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">6</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Featured Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">220</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Years of History</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">∞</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Stories to Tell</div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full p-1">
              <div className="w-1 h-3 bg-amber-400 rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Featured Cities Section - Modern Design */}
        <section className="relative px-4 md:px-6 py-16 md:py-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.3) 1px, transparent 0)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Section Header */}
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full text-amber-300 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span>Explore 6 Remarkable Cities</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-center mb-6">
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Featured
                </span>
                <br />
                <span className="text-white">Cities</span>
              </h2>
              
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Each city holds a piece of Haïti's soul. Choose your starting point for an unforgettable journey.
              </p>
            </div>

            {/* Cities Grid - Modern Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Large Featured City - Cap-Haïtien */}
              <Link
                href="/cities/cap-haitien"
                className="lg:col-span-2 lg:row-span-2 group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0">
                  <Image
                    src="/cap-haitien.jpg"
                    alt="Cap-Haïtien"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                </div>
                
                <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between min-h-[400px] lg:min-h-[500px]">
                  {/* Badge */}
                  <div className="flex items-start justify-between">
                    <span className="px-4 py-2 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-sm font-medium rounded-full">
                      The Royal Capital
                    </span>
                    <span className="text-6xl lg:text-8xl opacity-20 font-black">01</span>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 group-hover:text-amber-200 transition-colors duration-300">
                      Cap-Haïtien
                    </h3>
                    <p className="text-slate-300 text-lg mb-6 max-w-lg leading-relaxed">
                      Former colonial capital known as 'Paris of the Antilles.' Home to the magnificent Citadelle Laferrière and rich revolutionary history.
                    </p>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-3">
                      {["Citadelle Laferrière", "Sans-Souci Palace", "Colonial Architecture"].map((highlight, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-sm text-amber-300 text-sm rounded-full border border-amber-400/30">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Hover arrow */}
                <div className="absolute bottom-8 right-8 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>

              {/* Medium Cities - Right Column */}
              <div className="space-y-8">
                {/* Jacmel */}
                <Link
                  href="/cities/jacmel"
                  className="group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02] block"
                >
                  <div className="absolute inset-0">
                    <Image
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                      alt="Jacmel"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[240px]">
                    <div className="flex items-start justify-between">
                      <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-xs font-medium rounded-full">
                        Artistic Soul
                      </span>
                      <span className="text-3xl opacity-20 font-black">02</span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-amber-200 transition-colors duration-300">
                        Jacmel
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Famous for carnival papier-mâché arts and mystical Bassin Bleu pools.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Port-au-Prince */}
                <Link
                  href="/cities/port-au-prince"
                  className="group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02] block"
                >
                  <div className="absolute inset-0">
                    <Image
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
                      alt="Port-au-Prince"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[240px]">
                    <div className="flex items-start justify-between">
                      <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-xs font-medium rounded-full">
                        Heart of Nation
                      </span>
                      <span className="text-3xl opacity-20 font-black">03</span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-amber-200 transition-colors duration-300">
                        Port-au-Prince
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Vibrant capital where art, politics, and culture collide.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Bottom Row - 3 Small Cities */}
              <Link
                href="/cities/gonaives"
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                    alt="Gonaïves"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-xs font-medium rounded-full">
                      Birthplace of Freedom
                    </span>
                    <span className="text-2xl opacity-20 font-black">04</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-200 transition-colors duration-300">
                      Gonaïves
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Where independence was declared in 1804.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/cities/les-cayes"
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1439066615861-d1af74d74000"
                    alt="Les Cayes"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-xs font-medium rounded-full">
                      Southern Gateway
                    </span>
                    <span className="text-2xl opacity-20 font-black">05</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-200 transition-colors duration-300">
                      Les Cayes
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Gateway to pristine Île-à-Vache.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/cities/jeremie"
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                    alt="Jérémie"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>
                
                <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-xs font-medium rounded-full">
                      City of Poets
                    </span>
                    <span className="text-2xl opacity-20 font-black">06</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-200 transition-colors duration-300">
                      Jérémie
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Where literary giants were born.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <p className="text-slate-400 mb-8 text-lg">
                Can't decide where to start? We recommend beginning with the royal capital.
              </p>
              <Link
                href="/cities/cap-haitien"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105"
              >
                <span>Start with Cap-Haïtien</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Social Media Posts Section */}
        <section className="relative px-4 md:px-6">
          {/* Golden decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-400/30"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-400/30"></div>
          
          <div className="text-center mb-8 md:mb-12 relative">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-amber-200 mb-4 md:mb-6">
              📱 <span className="text-amber-300">Follow Our Journey</span>
            </h2>
            
            {/* Golden accent line */}
            <div className="w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6 md:mb-8"></div>
            
            <p className="text-base md:text-lg text-amber-200 max-w-3xl mx-auto leading-relaxed">
              Stay connected with daily discoveries, cultural insights, and behind-the-scenes stories from Haïti.
            </p>
          </div>

          {/* Social Media Slideshow */}
          <div className="relative max-w-6xl mx-auto">
            {/* Slideshow Container */}
            <div className="overflow-hidden rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-amber-400/20">
              <div id="social-slideshow" className="flex transition-transform duration-500 ease-in-out">
                
                {/* Post 1 */}
                <div className="flex-none w-full md:w-1/3 p-6">
                  <div className="bg-slate-800/90 rounded-2xl p-6 border border-amber-400/30 hover:border-amber-400/50 transition-colors duration-300">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🇭🇹</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-100">@DiscoverHaiti</h3>
                        <p className="text-amber-300/70 text-sm">2 hours ago</p>
                      </div>
                      <div className="ml-auto text-blue-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <p className="text-amber-200 mb-4 leading-relaxed">
                      🏰 Did you know? The Citadelle Laferrière took 15 years to build and used the labor of 20,000 workers. This UNESCO World Heritage site stands as a symbol of Haitian independence and ingenuity! #Haiti #History
                    </p>
                    
                    {/* Post Image */}
                    <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                      <Image
                        src="/cap-haitien.jpg"
                        alt="Citadelle Laferrière"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-6 text-amber-300/70 text-sm">
                      <span className="flex items-center gap-1">
                        <span>❤️</span> 247
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🔁</span> 89
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> 34
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post 2 */}
                <div className="flex-none w-full md:w-1/3 p-6">
                  <div className="bg-slate-800/90 rounded-2xl p-6 border border-amber-400/30 hover:border-amber-400/50 transition-colors duration-300">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🇭🇹</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-100">@DiscoverHaiti</h3>
                        <p className="text-amber-300/70 text-sm">1 day ago</p>
                      </div>
                      <div className="ml-auto text-pink-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <p className="text-amber-200 mb-4 leading-relaxed">
                      🎨 Jacmel's carnival artisans are creating magic for the upcoming season! These papier-mâché masterpieces represent centuries of artistic tradition. The creativity in this city is absolutely breathtaking! ✨
                    </p>
                    
                    {/* Post Image */}
                    <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                      <Image
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                        alt="Jacmel Carnival Arts"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-6 text-amber-300/70 text-sm">
                      <span className="flex items-center gap-1">
                        <span>❤️</span> 412
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🔁</span> 156
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> 67
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post 3 */}
                <div className="flex-none w-full md:w-1/3 p-6">
                  <div className="bg-slate-800/90 rounded-2xl p-6 border border-amber-400/30 hover:border-amber-400/50 transition-colors duration-300">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🇭🇹</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-100">@DiscoverHaiti</h3>
                        <p className="text-amber-300/70 text-sm">3 days ago</p>
                      </div>
                      <div className="ml-auto text-green-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <p className="text-amber-200 mb-4 leading-relaxed">
                      🍽️ Taste Tuesday! This traditional Haitian griot with pikliz is pure comfort food. The crispy pork paired with spicy pickled vegetables creates the perfect balance of flavors. Recipe coming soon! #HaitianCuisine
                    </p>
                    
                    {/* Post Image */}
                    <div className="relative h-48 mb-4 overflow-hidden rounded-xl">
                      <Image
                        src="/food.jpg"
                        alt="Haitian Griot"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-6 text-amber-300/70 text-sm">
                      <span className="flex items-center gap-1">
                        <span>❤️</span> 328
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🔁</span> 92
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> 45
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              <button 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === 0 ? 'bg-amber-400' : 'bg-amber-400/30 hover:bg-amber-400/60'}`}
                onClick={() => scrollSlide(0)}
              ></button>
              <button 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === 1 ? 'bg-amber-400' : 'bg-amber-400/30 hover:bg-amber-400/60'}`}
                onClick={() => scrollSlide(1)}
              ></button>
              <button 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === 2 ? 'bg-amber-400' : 'bg-amber-400/30 hover:bg-amber-400/60'}`}
                onClick={() => scrollSlide(2)}
              ></button>
            </div>
            
            {/* Follow Us CTA */}
            <div className="text-center mt-8">
              <p className="text-amber-200 mb-6">Join our community and never miss a story!</p>
              <div className="flex justify-center gap-4">
                <a href="#" className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Follow on Twitter</span>
                </a>
                <a href="#" className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Follow on Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom golden accent lines */}
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-amber-400/30"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-amber-400/30"></div>
        </section>

        {/* Getting Started Section */}
        <section className="relative px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-amber-200 mb-4 md:mb-6">
              🚀 <span className="text-amber-300">Start Your Journey</span>
            </h2>
            
            {/* Golden accent line */}
            <div className="w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6 md:mb-8"></div>
            
            <p className="text-base md:text-lg text-amber-200 max-w-2xl mx-auto leading-relaxed mb-8">
              Ready to discover Haiti's hidden treasures? Choose a city above and begin exploring the culture, history, and stories that await you.
            </p>
            
            <Link
              href="/cities/cap-haitien"
              className="inline-block px-6 md:px-8 py-3 md:py-4 bg-amber-500/90 backdrop-blur-sm text-white text-base md:text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:bg-amber-500 border border-amber-400/50 rounded-2xl"
            >
              Explore Cap-Haïtien First
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}