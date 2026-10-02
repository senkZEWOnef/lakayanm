"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_HERO_PHOTOS = ["/cap-haitien.jpg", "/limonade.jpg", "/market.jpg", "/lakay.jpg", "/milot.png"];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroPhoto, setHeroPhoto] = useState(0);
  const [heroPhotos, setHeroPhotos] = useState<string[]>(DEFAULT_HERO_PHOTOS);

  useEffect(() => {
    fetch("/api/site-images")
      .then((res) => res.json())
      .then((data) => {
        const images = data.images || {};
        const photos = DEFAULT_HERO_PHOTOS.map((fallback, i) => images[`home_hero_${i + 1}`] || fallback);
        setHeroPhotos(photos);
      })
      .catch(() => {
        // Keep the hardcoded defaults if this fails — never block the hero on it.
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroPhoto((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroPhotos.length]);

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65"></div>
      </div>

      <div className="relative z-10 space-y-6 md:space-y-10">
        {/* Hero — full-bleed photo, minimal text */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Crossfading photo background */}
          <div className="absolute inset-0">
            {heroPhotos.map((src, i) => (
              <div key={src} className={`absolute inset-0 transition-opacity duration-[2000ms] ${i === heroPhoto ? "opacity-100" : "opacity-0"}`}>
                <Image src={src} alt="Haiti" fill priority={i === 0} className="object-cover" sizes="100vw" />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
          </div>

          <div className="relative z-10 text-center px-4 md:px-6 max-w-2xl mx-auto">
            <p className="text-xs md:text-sm font-medium tracking-[0.3em] text-white/70 uppercase mb-4">Lakaya&apos;m</p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-6 drop-shadow-lg">
              See Haiti.
              <br />
              Then come home to it.
            </h1>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 rounded-full font-medium hover:bg-white/90 transition-colors duration-300"
            >
              🎥 Explore the Gallery
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full p-1">
              <div className="w-1 h-3 bg-white/60 rounded-full mx-auto animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Packages Section — merged with what used to be Featured Cities */}
        <section className="relative px-4 md:px-6 py-10 md:py-14">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.3) 1px, transparent 0)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/50 text-sm font-medium mb-4">
                <span>🔒</span>
                <span>Packages — Private Testing</span>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-center mb-3">
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Choose
                </span>{" "}
                <span className="text-white">Your Experience</span>
              </h2>

              <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Not just a city — a full itinerary. History, the coast, a celebration, or something entirely your
                own. We&apos;re personally scouting each one before opening it up — got a code?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  badge: "3 Days",
                  title: "North Discovery",
                  tagline: "Labadee's coast, the Citadelle Laferrière, and Cap-Haïtien — the classic introduction to the North.",
                  image: "/milot.png",
                },
                {
                  badge: "Regional",
                  title: "The South Side",
                  tagline: "Jacmel's art, hidden waterfalls, and the slower rhythm of southern Haiti.",
                  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                },
                {
                  badge: "Heritage",
                  title: "Historic Monuments",
                  tagline: "Independence sites and revolutionary landmarks — the places where Haiti's story was written.",
                  image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
                },
                {
                  badge: "Weddings",
                  title: "Say I Do in Haiti",
                  tagline: "Beachfront ceremonies and colonial courtyards — married somewhere unforgettable.",
                  image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
                },
                {
                  badge: "Celebrations",
                  title: "Birthday in Haiti",
                  tagline: "Milestone birthdays planned around real Haitian food, music, and company.",
                  image: "/food.jpg",
                },
                {
                  badge: "Culture",
                  title: "Fèt Champèt",
                  tagline: "A day in one specific countryside town — the celebration, the food, the community.",
                  image: "/local.jpg",
                },
              ].map((pkg) => (
                <Link
                  key={pkg.title}
                  href="/trips"
                  className="group relative bg-slate-900/50 backdrop-blur-sm border border-amber-400/20 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-700 hover:transform hover:scale-[1.02] block"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                  </div>

                  <div className="relative z-10 p-5 h-full flex flex-col justify-between min-h-[220px]">
                    <span className="self-start px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 text-xs font-medium rounded-full">
                      {pkg.badge}
                    </span>

                    <div>
                      <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-200 transition-colors duration-300">
                        {pkg.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{pkg.tagline}</p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Build Your Own — distinct treatment, not a photo card */}
              <Link
                href="/trips"
                className="group relative border-2 border-dashed border-amber-400/30 rounded-3xl overflow-hidden hover:border-amber-400/60 transition-all duration-700 hover:transform hover:scale-[1.02] block p-5 min-h-[220px] flex flex-col justify-between"
              >
                <span className="self-start px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs font-medium rounded-full">
                  Custom
                </span>
                <div>
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-amber-200 transition-colors duration-300">
                    Build Your Own
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Something specific in mind? For an additional planning fee, we&apos;ll build a package around it.
                  </p>
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Link href="/trips" className="btn-sunset hover:scale-105">
                <span>See All Packages</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* From the Gallery Section */}
        <section className="relative px-4 md:px-6 py-10 md:py-14">
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-haiti-turquoise/20 backdrop-blur-sm border border-haiti-turquoise/30 rounded-full text-haiti-turquoise text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-haiti-turquoise rounded-full animate-pulse"></span>
                <span>Built By The Community</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-3">
                <span className="text-white">From the</span>{" "}
                <span className="bg-gradient-to-r from-haiti-turquoise via-cyan-300 to-haiti-teal bg-clip-text text-transparent">
                  Gallery
                </span>
              </h2>

              <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Photos and videos of Haiti — ours and other creators&apos; — growing every week. This is what we&apos;re
                building first, before a single package goes public.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {["/cap-haitien.jpg", "/market.jpg", "/limonade.jpg", "/food.jpg", "/restaurant.jpg", "/local.jpg", "/milot.png", "/lakay.jpg"].map(
                (src) => (
                  <Link key={src} href="/gallery" className="group relative aspect-square rounded-2xl overflow-hidden">
                    <Image src={src} alt="Haiti" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </Link>
                )
              )}
            </div>

            <div className="text-center">
              <Link
                href="/gallery"
                className="btn-brand hover:scale-105"
              >
                <span>See the Full Gallery</span>
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
          
          <div className="text-center mb-5 md:mb-6 relative">
            <h2 className="text-xl md:text-2xl font-light tracking-tight text-amber-200 mb-2">
              📱 <span className="text-amber-300">Follow Our Journey</span>
            </h2>

            {/* Golden accent line */}
            <div className="w-16 md:w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-3"></div>

            <p className="text-sm md:text-base text-amber-200 max-w-3xl mx-auto leading-relaxed">
              Stay connected with daily discoveries, cultural insights, and behind-the-scenes stories from Haïti.
            </p>
          </div>

          {/* Social Media Slideshow */}
          <div className="relative max-w-6xl mx-auto">
            {/* Slideshow Container */}
            <div className="overflow-hidden rounded-3xl bg-slate-800/50 backdrop-blur-sm border border-amber-400/20">
              <div id="social-slideshow" className="flex transition-transform duration-500 ease-in-out">
                
                {/* Post 1 */}
                <div className="flex-none w-full md:w-1/3 p-3 md:p-4">
                  <div className="bg-slate-800/90 rounded-2xl p-4 border border-amber-400/30 hover:border-amber-400/50 transition-colors duration-300">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
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
                    <p className="text-amber-200 text-sm mb-3 leading-relaxed line-clamp-2">
                      🏰 Did you know? The Citadelle Laferrière took 15 years to build and used the labor of 20,000 workers. This UNESCO World Heritage site stands as a symbol of Haitian independence and ingenuity! #Haiti #History
                    </p>
                    
                    {/* Post Image */}
                    <div className="relative h-28 mb-3 overflow-hidden rounded-xl">
                      <Image
                        src="/cap-haitien.jpg"
                        alt="Citadelle Laferrière"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-4 text-amber-300/70 text-xs">
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
                <div className="flex-none w-full md:w-1/3 p-3 md:p-4">
                  <div className="bg-slate-800/90 rounded-2xl p-4 border border-amber-400/30 hover:border-amber-400/50 transition-colors duration-300">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
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
                    <p className="text-amber-200 text-sm mb-3 leading-relaxed line-clamp-2">
                      🎨 Jacmel&apos;s carnival artisans are creating magic for the upcoming season! These papier-mâché masterpieces represent centuries of artistic tradition. The creativity in this city is absolutely breathtaking! ✨
                    </p>
                    
                    {/* Post Image */}
                    <div className="relative h-28 mb-3 overflow-hidden rounded-xl">
                      <Image
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                        alt="Jacmel Carnival Arts"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-4 text-amber-300/70 text-xs">
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
                <div className="flex-none w-full md:w-1/3 p-3 md:p-4">
                  <div className="bg-slate-800/90 rounded-2xl p-4 border border-amber-400/30 hover:border-amber-400/50 transition-colors duration-300">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
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
                    <p className="text-amber-200 text-sm mb-3 leading-relaxed line-clamp-2">
                      🍽️ Taste Tuesday! This traditional Haitian griot with pikliz is pure comfort food. The crispy pork paired with spicy pickled vegetables creates the perfect balance of flavors. Recipe coming soon! #HaitianCuisine
                    </p>
                    
                    {/* Post Image */}
                    <div className="relative h-28 mb-3 overflow-hidden rounded-xl">
                      <Image
                        src="/food.jpg"
                        alt="Haitian Griot"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Post Stats */}
                    <div className="flex items-center gap-4 text-amber-300/70 text-xs">
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
            <div className="flex justify-center gap-2 mt-4">
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
            <div className="text-center mt-5">
              <p className="text-amber-200 text-sm mb-3">Join our community and never miss a story!</p>
              <div className="flex justify-center gap-3">
                <a href="#" className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300 text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Follow on Twitter</span>
                </a>
                <a href="#" className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-300 text-sm">
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
      </div>
    </div>
  );
}