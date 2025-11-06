"use client";

import { useState } from "react";
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
  userSession?: any;
}

export default function RentalGallery({ rentalId, rentalName, initialPhotos, userSession }: RentalGalleryProps) {
  const session = userSession;
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", `Photo of ${rentalName}`);

      const response = await fetch(`/api/rentals/${rentalId}/photos`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPhotos(prev => [
          {
            id: result.photo.id,
            path: result.photo.url,
            alt: result.photo.alt
          },
          ...prev
        ]);
        setShowUploadModal(false);
      } else {
        alert("Failed to upload photo. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">Photo Gallery</h2>
          {session && (
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-haiti-turquoise text-white px-4 py-2 rounded-lg hover:bg-haiti-turquoise/80 transition-colors text-sm font-medium"
            >
              + Add Photos
            </button>
          )}
        </div>
        
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.path}
                  alt={photo.alt || `Photo of ${rentalName}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                    🔍
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">No Photos Yet</h3>
            <p className="sub text-sm mb-4">Be the first to share photos of this property!</p>
            {session ? (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium"
              >
                Upload First Photo
              </button>
            ) : (
              <p className="text-xs sub">Sign in to add photos</p>
            )}
          </div>
        )}
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
            >
              ✕
            </button>
            <Image
              src={selectedPhoto.path}
              alt={selectedPhoto.alt || `Photo of ${rentalName}`}
              width={800}
              height={600}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
              Add Photo to {rentalName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Share photos to help future guests see what to expect
                </p>
              </div>
              
              {isUploading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-haiti-turquoise"></div>
                  <p className="text-sm sub mt-2">Uploading photo...</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}