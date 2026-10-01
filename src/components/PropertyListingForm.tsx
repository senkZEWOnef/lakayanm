"use client";

import { useState } from "react";

interface PropertyListingFormProps {
  slug: string;
  citySlug: string;
}

// No backend exists for property submissions yet — this collects the
// details and shows a confirmation locally. Wire it to a real API route
// (e.g. an admin-reviewed `property_submissions` table, mirroring
// `trip_inquiries`) once you're ready to onboard hosts for real.
export default function PropertyListingForm({}: PropertyListingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !propertyName || !email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Thanks, {ownerName}!</h3>
        <p className="sub max-w-md mx-auto">
          We&apos;ve got the details for {propertyName}. Our team will reach out to {email} to finish setting up your listing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Tell Us About Your Property</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Property Name</label>
          <input
            type="text"
            required
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tell us about the property</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Location, number of rooms, what makes it special..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-haiti-turquoise text-white py-3 rounded-lg font-medium hover:bg-haiti-turquoise/80 transition-colors"
      >
        Submit Listing Request
      </button>
    </form>
  );
}
