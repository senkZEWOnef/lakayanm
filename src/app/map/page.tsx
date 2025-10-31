import HaitiInteractiveMap from "@/components/HaitiInteractiveMap";

export const metadata = {
  title: "Interactive Map of Haiti - Lakaya'm",
  description: "Explore Haiti's 10 departments and 30 cities through our interactive map. Click on regions to discover their unique culture, history, and attractions.",
};

export default function MapPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-slate-800"></div>

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Haiti
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
            <p className="text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Discover Haiti&apos;s 10 departments and their vibrant cities through our interactive map. 
              Click on any region to explore its unique culture, history, and hidden treasures.
            </p>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="max-w-7xl mx-auto">
          <HaitiInteractiveMap />
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">How to Use</h2>
            <div className="grid md:grid-cols-3 gap-6 text-white/80">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Click Departments</h3>
                <p className="text-sm">Select any department on the map to see its major cities and explore the region</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Discover Cities</h3>
                <p className="text-sm">Click on city pins or names to visit individual city pages with detailed information</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Explore Culture</h3>
                <p className="text-sm">Learn about local attractions, history, food, and cultural landmarks in each area</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}