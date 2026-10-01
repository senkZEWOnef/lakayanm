"use client";

import Image from "next/image";

interface Photo {
  id: string;
  path: string;
  alt: string | null;
}

interface RentalGalleryProps {
  rentalId: string;
  rentalName: string;
  initialPhotos: Photo[];
  userSession?: unknown;
}

// Display-only gallery for now — no upload endpoint exists for rental (hotel-kind)
// places yet, unlike landmarks/restaurants. Wire this up to a
// `/api/rentals/[id]/photos` route (mirroring the landmarks one) when photo
// uploads for rentals are prioritized.
export default function RentalGallery({ rentalName, initialPhotos }: RentalGalleryProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">Photo Gallery</h2>
      </div>

      {initialPhotos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {initialPhotos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer">
              <Image
                src={photo.path}
                alt={photo.alt || `Photo of ${rentalName}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Photos Yet</h3>
          <p className="sub text-sm">Photos of {rentalName} are coming soon.</p>
        </div>
      )}
    </div>
  );
}
