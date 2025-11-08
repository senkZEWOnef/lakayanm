"use client";

import { useState } from "react";

export default function PropertyListingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: "",
    phone: "",
    email: "",
    website: "",
    amenities: [] as string[],
    houseRules: "",
    plan: "standard"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Property listing data:", formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Failed to submit property listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenityOptions = [
    "WiFi", "Air Conditioning", "Kitchen", "Parking", "Swimming Pool", 
    "Ocean View", "Balcony", "Washer/Dryer", "TV", "Heating",
    "Workspace", "Gym", "Hot Tub", "Fireplace", "Garden"
  ];

  if (submitted) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
          Thank You for Your Submission!
        </h2>
        <p className="sub max-w-2xl mx-auto mb-6">
          Your property listing has been submitted for review. Our team will review your submission 
          within 24-48 hours and contact you at {formData.email} with next steps.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-haiti-turquoise">
            📧 Check your email for a confirmation with your listing details
          </p>
          <p className="text-sm text-haiti-teal">
            📞 We&apos;ll call you at {formData.phone} if we need additional information
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                name: "",
                description: "",
                address: "",
                propertyType: "apartment",
                bedrooms: 1,
                bathrooms: 1,
                maxGuests: 2,
                pricePerNight: "",
                phone: "",
                email: "",
                website: "",
                amenities: [],
                houseRules: "",
                plan: "standard"
              });
            }}
            className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium"
          >
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">
          Property Information
        </h2>
        <div className="flex items-center gap-2 text-sm sub">
          <span>Step {step} of 4</span>
          <div className="flex gap-1 ml-2">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full ${i <= step ? 'bg-haiti-turquoise' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Property Details</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Property Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Beautiful Ocean View Villa"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="guesthouse">Guesthouse</option>
                <option value="hotel-room">Hotel Room</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Guests</label>
                <select
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price/Night (USD)</label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  placeholder="50"
                  min="10"
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location & Description */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Location & Description</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Rue Principale, Cap-Haïtien"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property, its unique features, and what makes it special..."
                rows={6}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
              <p className="text-xs sub mt-1">
                Tip: Mention nearby attractions, amenities, and what guests can expect during their stay
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Amenities & Rules */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Amenities & House Rules</h3>
            
            <div>
              <label className="block text-sm font-medium mb-3">Available Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-haiti-turquoise focus:ring-haiti-turquoise border-gray-300 rounded"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">House Rules</label>
              <textarea
                name="houseRules"
                value={formData.houseRules}
                onChange={handleInputChange}
                placeholder="e.g., No smoking, No pets, Quiet hours after 10 PM, Check-in after 3 PM..."
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 4: Contact & Plan */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information & Plan Selection</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+509 1234 5678"
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website (Optional)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://your-property-website.com"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Select Your Plan</label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${formData.plan === 'standard' ? 'border-haiti-turquoise bg-haiti-turquoise/5' : 'border-gray-200 dark:border-gray-600'}`}>
                  <input
                    type="radio"
                    name="plan"
                    value="standard"
                    checked={formData.plan === 'standard'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h4 className="font-bold text-lg mb-2">Standard - $29/month</h4>
                    <p className="text-sm sub">5% commission • Up to 10 photos</p>
                  </div>
                </label>
                <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${formData.plan === 'premium' ? 'border-haiti-turquoise bg-haiti-turquoise/5' : 'border-gray-200 dark:border-gray-600'}`}>
                  <input
                    type="radio"
                    name="plan"
                    value="premium"
                    checked={formData.plan === 'premium'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <h4 className="font-bold text-lg mb-2">Premium - $59/month</h4>
                    <p className="text-sm sub">3% commission • Unlimited photos</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-haiti-turquoise text-white px-6 py-3 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Property Listing"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}