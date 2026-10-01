interface TripsComingSoonProps {
  redirectTo?: string;
  error?: string;
}

export default function TripsComingSoon({ redirectTo = "/trips", error }: TripsComingSoonProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 bg-slate-900" />
      <div className="relative z-10 max-w-lg w-full text-center bg-slate-800/80 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 md:p-10">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Packages — Coming Soon</h1>
        <p className="text-white/80 leading-relaxed mb-6">
          We&apos;re personally scouting every trip in the North before opening packages to everyone — filming,
          checking logistics, and training local guides. A small group of testers gets early access with a special
          rate in exchange for footage and feedback.
        </p>
        <p className="text-white/60 text-sm mb-6">Have an access code? Enter it below.</p>

        <form action="/api/trips/access" method="POST" className="flex flex-col sm:flex-row gap-3">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input
            type="text"
            name="code"
            placeholder="Access code"
            required
            className="flex-1 p-3 rounded-lg border border-amber-400/30 bg-slate-900/60 text-white placeholder:text-white/40 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-500/80 transition-colors"
          >
            Unlock
          </button>
        </form>

        {error === "invalid" && <p className="text-red-400 text-sm mt-3">That code isn&apos;t valid or has expired.</p>}
        {error === "missing" && <p className="text-red-400 text-sm mt-3">Please enter a code.</p>}

        <p className="text-white/40 text-xs mt-8">
          Want in on the tryout batch? Reach out and we&apos;ll send you a code.
        </p>
      </div>
    </div>
  );
}
