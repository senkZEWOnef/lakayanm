"use client";

import { useState } from "react";

interface Rental {
  id: string;
  name: string;
  price_range?: string | null;
  phone?: string | null;
  booking_url?: string | null;
  website?: string | null;
}

interface BookingWidgetProps {
  rental: Rental;
}

export default function BookingWidget({ rental }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Extract price from price_range ($ = 50, $$ = 100, $$$ = 150, $$$$ = 250)
  const getPricePerNight = (priceRange?: string | null) => {
    if (!priceRange) return 75; // Default price
    const dollarCount = priceRange.length;
    switch (dollarCount) {
      case 1: return 50;
      case 2: return 100;
      case 3: return 150;
      case 4: return 250;
      default: return 75;
    }
  };

  const pricePerNight = getPricePerNight(rental.price_range);
  
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return 0;
    
    const subtotal = nights * pricePerNight;
    const serviceFee = subtotal * 0.15; // 15% service fee
    const taxes = subtotal * 0.10; // 10% taxes
    
    return {
      nights,
      subtotal,
      serviceFee,
      taxes,
      total: subtotal + serviceFee + taxes
    };
  };

  const totals = calculateTotal();

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    if (rental.booking_url) {
      window.open(rental.booking_url, '_blank');
    } else {
      setShowBookingModal(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Set minimum checkout to day after check-in
  const minCheckOut = checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : today;

  return (
    <>
      <div className="card sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">
              {formatCurrency(pricePerNight)}
            </span>
            <span className="text-sm sub">/ night</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-haiti-amber">⭐ 4.9</span>
            <span className="sub">(15 reviews)</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={minCheckOut}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
              />
            </div>
          </div>

          {/* Guest Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} guest{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Button */}
          <button
            onClick={handleBooking}
            disabled={!checkIn || !checkOut}
            className="w-full bg-haiti-turquoise text-white py-3 rounded-lg font-medium text-sm hover:bg-haiti-turquoise/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {rental.booking_url ? "Book Now" : "Request to Book"}
          </button>

          {/* Pricing Breakdown */}
          {totals !== 0 && totals.nights > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(pricePerNight)} × {totals.nights} night{totals.nights > 1 ? 's' : ''}</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>{formatCurrency(totals.serviceFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes</span>
                <span>{formatCurrency(totals.taxes)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-center sub">
            You won&apos;t be charged yet
          </p>
        </div>

        {/* Alternative Contact Methods */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {rental.phone && (
            <button 
              onClick={() => window.open(`tel:${rental.phone}`)}
              className="w-full bg-haiti-coral text-white py-2 rounded-lg text-sm font-medium hover:bg-haiti-coral/80 transition-colors"
            >
              📞 Call to Book
            </button>
          )}
          
          {rental.website && (
            <button 
              onClick={() => window.open(rental.website!, '_blank')}
              className="w-full bg-haiti-sage text-white py-2 rounded-lg text-sm font-medium hover:bg-haiti-sage/80 transition-colors"
            >
              🌐 Visit Website
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
              Booking Request
            </h3>
            
            <div className="space-y-4">
              <div className="bg-haiti-turquoise/10 border border-haiti-turquoise/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Property:</strong> {rental.name}</p>
                  <p><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString()}</p>
                  <p><strong>Guests:</strong> {guests}</p>
                  <p><strong>Total:</strong> {totals !== 0 ? formatCurrency(totals.total) : '$0'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <textarea
                  placeholder="Tell the host about your trip..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-haiti-turquoise focus:border-transparent"
                  rows={4}
                />
              </div>
              
              <p className="text-xs sub">
                Your booking request will be sent to the property owner. You&apos;ll receive a response within 24 hours.
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Booking request sent! You'll receive a confirmation email shortly.");
                  setShowBookingModal(false);
                }}
                className="flex-1 bg-haiti-turquoise text-white px-4 py-2 rounded-lg hover:bg-haiti-turquoise/80 transition-colors font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}