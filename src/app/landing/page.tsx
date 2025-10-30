"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/banner.png"
          alt="Haiti landscape"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        {/* Gradient overlay for even better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Title */}
          <div className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl [text-shadow:_0_0_40px_rgb(0_0_0_/_50%)] relative">
              <span className="relative z-10 bg-gradient-to-b from-white via-white to-gray-200 bg-clip-text text-transparent">
                Lakaya'm
              </span>
              <span className="absolute inset-0 text-white/20 blur-sm">Lakaya'm</span>
            </h1>
            <div className={`w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6 transition-all duration-1000 delay-300 ${mounted ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} shadow-lg`}></div>
            <p className={`text-xl md:text-2xl font-semibold text-white tracking-[0.2em] transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} drop-shadow-xl [text-shadow:_0_0_20px_rgb(0_0_0_/_70%)] uppercase`}>
              Discover Haiti
            </p>
          </div>

          {/* Subtitle */}
          <div className={`mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-lg md:text-xl leading-relaxed text-white font-medium drop-shadow-xl [text-shadow:_0_0_15px_rgb(0_0_0_/_60%)] tracking-wide">
              Experience the authentic soul of Haiti through its vibrant culture, 
              rich history, and hidden treasures waiting to be discovered.
            </p>
          </div>

          {/* Call to Action */}
          <div className={`space-y-8 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/home"
              className="group inline-block relative overflow-hidden px-8 py-4 bg-white/95 backdrop-blur-sm text-slate-900 text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:bg-white"
            >
              <span className="relative z-10">Begin Your Journey</span>
              <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            {/* Navigation Buttons */}
            <div className={`flex flex-wrap items-center justify-center gap-6 transition-all duration-1000 delay-1100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link
                href="/departments"
                className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium tracking-wide hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                <span className="relative z-10">Departments</span>
              </Link>

              <Link
                href="/cities"
                className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium tracking-wide hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                <span className="relative z-10">Cities</span>
              </Link>

              {/* Culture Dropdown */}
              <div className="group relative">
                <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium tracking-wide hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-2">
                  <span>Culture</span>
                  <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-sm border border-white/30 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Link href="/culture/history" className="block px-4 py-3 text-slate-900 hover:bg-slate-100 transition-colors duration-200 font-medium">
                    History
                  </Link>
                  <Link href="/culture/food" className="block px-4 py-3 text-slate-900 hover:bg-slate-100 transition-colors duration-200 font-medium">
                    Food
                  </Link>
                  <Link href="/culture/music" className="block px-4 py-3 text-slate-900 hover:bg-slate-100 transition-colors duration-200 font-medium">
                    Music
                  </Link>
                  <Link href="/culture/hotels" className="block px-4 py-3 text-slate-900 hover:bg-slate-100 transition-colors duration-200 font-medium">
                    Hotels
                  </Link>
                  <Link href="/culture/landmarks" className="block px-4 py-3 text-slate-900 hover:bg-slate-100 transition-colors duration-200 font-medium">
                    Landmarks
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                className="group relative px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium tracking-wide hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                <span className="relative z-10">About</span>
              </Link>
            </div>
            
            <div className={`flex items-center justify-center gap-8 text-sm text-white/70 font-medium transition-all duration-1000 delay-1200 ${mounted ? 'opacity-100' : 'opacity-0'} tracking-widest uppercase`}>
              <span className="hover:text-white hover:scale-105 transition-all duration-200 drop-shadow-lg [text-shadow:_0_0_10px_rgb(0_0_0_/_50%)]">9 Departments</span>
              <span className="w-px h-4 bg-white/50 shadow-sm"></span>
              <span className="hover:text-white hover:scale-105 transition-all duration-200 drop-shadow-lg [text-shadow:_0_0_10px_rgb(0_0_0_/_50%)]">27 Cities</span>
              <span className="w-px h-4 bg-white/50 shadow-sm"></span>
              <span className="hover:text-white hover:scale-105 transition-all duration-200 drop-shadow-lg [text-shadow:_0_0_10px_rgb(0_0_0_/_50%)]">Countless Stories</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center text-white/60">
            <span className="text-xs font-light mb-2 tracking-wide drop-shadow">Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent animate-pulse"></div>
          </div>
        </div>
      </section>
    </main>
  );
}