import Link from "next/link";
import PropertyListingForm from "@/components/PropertyListingForm";

export default async function ListPropertyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/rentals" className="text-brand hover:text-brand-dark text-sm">
            ← Back to Rentals
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-4">
          List Your Property
        </h1>
        <p className="text-lg sub max-w-3xl mx-auto">
          Join our platform and start earning from your property. Reach thousands of travelers 
          looking for authentic Haitian experiences.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="card bg-gradient-to-r from-haiti-turquoise/5 to-haiti-teal/5 dark:from-haiti-turquoise/10 dark:to-haiti-teal/10 border-haiti-turquoise/20">
        <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 text-center">
          Choose Your Plan
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Standard Plan */}
          <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Standard</h3>
              <div className="text-3xl font-bold text-haiti-coral mb-1">$29<span className="text-lg">/month</span></div>
              <p className="text-sm sub">+ 5% commission per booking</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Basic property listing</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Up to 10 photos</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Guest messaging</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Email support</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-haiti-turquoise rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-haiti-turquoise text-white px-4 py-1 rounded-full text-xs font-medium">
              Most Popular
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Premium</h3>
              <div className="text-3xl font-bold text-haiti-turquoise mb-1">$59<span className="text-lg">/month</span></div>
              <p className="text-sm sub">+ 3% commission per booking</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Everything in Standard</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Featured placement</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Unlimited photos</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Marketing tools</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Property Listing Form */}
      <PropertyListingForm />

      {/* Benefits Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-6 text-center">
          Why List With Us?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-lg mb-2 text-haiti-navy dark:text-haiti-turquoise">Global Reach</h3>
            <p className="text-sm sub">Connect with travelers from around the world looking for authentic Haitian experiences</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-2 text-haiti-navy dark:text-haiti-turquoise">Easy Earnings</h3>
            <p className="text-sm sub">Simple pricing, transparent fees, and fast payments directly to your account</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-2 text-haiti-navy dark:text-haiti-turquoise">Secure Platform</h3>
            <p className="text-sm sub">Protected bookings, verified guests, and 24/7 support for peace of mind</p>
          </div>
        </div>
      </div>
    </div>
  );
}