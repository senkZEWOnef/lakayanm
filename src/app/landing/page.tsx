import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-haiti-midnight">
      {/* Your Poster - Full Display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/poster.png"
          alt="Lakaya'm - Discover Haiti"
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Minimal CTA Button */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <Link
          href="/home"
          className="inline-flex items-center gap-3 px-8 py-4 bg-brand/90 hover:bg-brand text-white font-bold text-lg rounded-xl shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
        >
          <span>🇭🇹</span>
          <span>ENTER</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}