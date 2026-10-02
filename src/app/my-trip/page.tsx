import Image from "next/image";
import TripCodeEntry from "@/components/TripCodeEntry";

export default function MyTripEntryPage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <Image src="/banner.png" alt="Haiti landscape" fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="card text-center">
            <h1 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">My Trip</h1>
            <p className="sub text-sm mb-6">
              Enter the confirmation code we gave you after booking to see your itinerary, check what&apos;s paid, or
              send us a message.
            </p>
            <TripCodeEntry />
          </div>
        </div>
      </div>
    </div>
  );
}
