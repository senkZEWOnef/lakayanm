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
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Title */}
          <div className={`mb-6 md:mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white mb-3 md:mb-4 drop-shadow-2xl [text-shadow:_0_0_40px_rgb(0_0_0_/_50%)] relative">
              <span className="relative z-10 bg-gradient-to-b from-white via-white to-gray-200 bg-clip-text text-transparent">
                Lakaya&apos;m
              </span>
              <span className="absolute inset-0 text-white/20 blur-sm">Lakaya&apos;m</span>
            </h1>
            <div className={`w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4 md:mb-6 transition-all duration-1000 delay-300 ${mounted ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} shadow-lg`}></div>
            <p className={`text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-[0.1em] md:tracking-[0.2em] transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} drop-shadow-xl [text-shadow:_0_0_20px_rgb(0_0_0_/_70%)] uppercase`}>
              Discover Haiti
            </p>
          </div>

          {/* Subtitle */}
          <div className={`mb-8 md:mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium drop-shadow-xl [text-shadow:_0_0_15px_rgb(0_0_0_/_60%)] tracking-wide px-2">
              Experience the authentic soul of Haiti through its vibrant culture, 
              rich history, and hidden treasures waiting to be discovered.
            </p>
          </div>

          {/* Call to Action */}
          <div className={`space-y-8 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link
              href="/home"
              className="group inline-block relative overflow-hidden px-6 md:px-8 py-3 md:py-4 bg-amber-500/90 backdrop-blur-sm text-white text-base md:text-lg font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:bg-amber-500 border border-amber-400/50"
            >
              <span className="relative z-10">Begin Your Journey</span>
              <div className="absolute inset-0 bg-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            {/* Featured Cities */}
            <div className={`flex flex-wrap items-center justify-center gap-3 md:gap-4 transition-all duration-1000 delay-1100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link
                href="/cities/cap-haitien"
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-slate-800/60 backdrop-blur-sm border border-amber-400/40 text-white font-medium tracking-wide hover:bg-slate-800/80 hover:border-amber-400/60 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">Cap-Haïtien</span>
              </Link>

              <Link
                href="/cities/jacmel"
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-slate-800/60 backdrop-blur-sm border border-amber-400/40 text-white font-medium tracking-wide hover:bg-slate-800/80 hover:border-amber-400/60 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">Jacmel</span>
              </Link>

              <Link
                href="/cities/port-au-prince"
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-slate-800/60 backdrop-blur-sm border border-amber-400/40 text-white font-medium tracking-wide hover:bg-slate-800/80 hover:border-amber-400/60 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">Port-au-Prince</span>
              </Link>

              <Link
                href="/cities/gonaives"
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-slate-800/60 backdrop-blur-sm border border-amber-400/40 text-white font-medium tracking-wide hover:bg-slate-800/80 hover:border-amber-400/60 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">Gonaïves</span>
              </Link>

              <Link
                href="/cities/les-cayes"
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-slate-800/60 backdrop-blur-sm border border-amber-400/40 text-white font-medium tracking-wide hover:bg-slate-800/80 hover:border-amber-400/60 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">Les Cayes</span>
              </Link>

              <Link
                href="/cities/jeremie"
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-slate-800/60 backdrop-blur-sm border border-amber-400/40 text-white font-medium tracking-wide hover:bg-slate-800/80 hover:border-amber-400/60 transition-all duration-300 text-sm md:text-base"
              >
                <span className="relative z-10">Jérémie</span>
              </Link>
            </div>
            
            <div className={`flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-white/70 font-medium transition-all duration-1000 delay-1200 ${mounted ? 'opacity-100' : 'opacity-0'} tracking-wider md:tracking-widest uppercase px-4`}>
              <span className="hover:text-white hover:scale-105 transition-all duration-200 drop-shadow-lg [text-shadow:_0_0_10px_rgb(0_0_0_/_50%)]">6 Featured Cities</span>
              <span className="w-px h-3 md:h-4 bg-white/50 shadow-sm hidden sm:block"></span>
              <span className="hover:text-white hover:scale-105 transition-all duration-200 drop-shadow-lg [text-shadow:_0_0_10px_rgb(0_0_0_/_50%)]">Rich Culture</span>
              <span className="w-px h-3 md:h-4 bg-white/50 shadow-sm hidden sm:block"></span>
              <span className="hover:text-white hover:scale-105 transition-all duration-200 drop-shadow-lg [text-shadow:_0_0_10px_rgb(0_0_0_/_50%)]">Untold Stories</span>
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