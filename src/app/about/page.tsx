export default function About() {
  return (
    <div className="space-y-8">
      <div className="card border-l-4 border-brand bg-gradient-to-r from-haiti-navy/5 to-haiti-teal/5 dark:from-haiti-navy/20 dark:to-haiti-teal/20">
        <h1 className="hero-title text-brand">Lakaya&apos;m</h1>
        <p className="sub mt-4 max-w-2xl text-lg">
          Haiti in one app — departments, cities, food, beaches, stories. Free to explore, fair to local businesses.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">Our Mission</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        <p className="sub text-lg mb-4">
          Created with love from Cap-Haïtien, Lakaya&apos;m is your authentic guide to discovering Haiti&apos;s 
          rich culture, historic landmarks, local cuisine, and vibrant communities across all 9 departments.
        </p>
        <p className="sub">
          From the revolutionary history of the Citadelle to the bustling markets of Port-au-Prince, 
          we celebrate the stories, places, and people that make Haiti unique.
        </p>
      </div>

      <div className="card bg-gradient-to-r from-haiti-amber/5 to-brand/5 dark:from-haiti-amber/10 dark:to-brand/10 border-haiti-amber/20">
        <h3 className="font-semibold text-lg text-haiti-navy dark:text-haiti-turquoise mb-3">🇭🇹 Built by Haitians, for Haiti</h3>
        <p className="sub">
          Every story, every recommendation, every cultural insight comes from our deep love and 
          connection to this beautiful nation. We&apos;re here to share authentic experiences and 
          support local businesses across Haiti.
        </p>
      </div>
    </div>
  );
}