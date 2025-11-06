import Link from "next/link";
import PropertyListingForm from "@/components/PropertyListingForm";

export default async function ListPropertyPage({ params }: { params: Promise<{ slug: string; city: string }> }) {
  const { slug, city: citySlug } = await params;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Link href={`/dept/${slug}/city/${citySlug}/rentals`} className="text-brand hover:text-brand-dark text-sm mb-4 inline-block">
          ← Back to Rentals
        </Link>
        <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
          List Your Property
        </h1>
        <p className="sub max-w-2xl mx-auto">
          Join thousands of hosts earning extra income by sharing their space with travelers. 
          Start listing your property and connect with guests looking for unique experiences.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Earn Extra Income</h3>
          <p className="text-sm sub">Average hosts earn $500-2000 per month sharing their space</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Host Protection</h3>
          <p className="text-sm sub">Comprehensive insurance coverage and 24/7 support for hosts</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Share Culture</h3>
          <p className="text-sm sub">Help travelers experience authentic Haitian hospitality</p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-haiti-turquoise/20">
              <h3 className="text-xl font-bold mb-2">Standard Listing</h3>
              <div className="text-3xl font-bold text-haiti-turquoise mb-4">$29<span className="text-lg">/month</span></div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Up to 10 photos</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Basic listing features</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Guest messaging</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 5% commission per booking</li>
              </ul>
            </div>
            <div className="bg-haiti-turquoise text-white rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-haiti-coral text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Listing</h3>
              <div className="text-3xl font-bold mb-4">$59<span className="text-lg">/month</span></div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Unlimited photos</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Featured placement</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Advanced analytics</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> 3% commission per booking</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Priority support</li>
              </ul>
            </div>
          </div>
          <p className="text-sm sub mt-6">
            All plans include booking management, guest screening, and payment processing
          </p>
        </div>
      </div>

      {/* Property Listing Form */}
      <PropertyListingForm slug={slug} citySlug={citySlug} />

      {/* FAQ Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">How quickly can I start hosting?</h3>
            <p className="text-sm sub mb-4">
              Most listings are reviewed and approved within 24-48 hours. You can start receiving bookings immediately after approval.
            </p>
            
            <h3 className="font-bold mb-2">What if I need to cancel a booking?</h3>
            <p className="text-sm sub mb-4">
              We understand emergencies happen. Our flexible cancellation policy protects both hosts and guests while maintaining fair standards.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">How do I get paid?</h3>
            <p className="text-sm sub mb-4">
              Payments are processed securely and transferred to your bank account within 24 hours of guest check-in.
            </p>
            
            <h3 className="font-bold mb-2">What support do I get as a host?</h3>
            <p className="text-sm sub mb-4">
              24/7 customer support, host insurance coverage, and a dedicated success manager to help optimize your listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}