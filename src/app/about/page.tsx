import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";

const faqs = [
  {
    question: "What is Lakaya'm?",
    answer:
      "Lakaya'm is how diaspora Haitians plan and book trips home. We research and personally scout every trip — tours, stays, transport, food, and events — so you know exactly what you're getting and what it costs before you commit. We're starting in the North (Cap-Haïtien, the Citadelle, Labadie, and beyond) and expanding from there.",
  },
  {
    question: "Why do I need an access code to book a trip?",
    answer:
      "Browsing packages is open to everyone — no code required. We're currently running a small, private testing batch for booking itself: a limited group gets early access and special rates in exchange for feedback and footage from their trip. A code is only needed when you're ready to actually book and pay.",
  },
  {
    question: "How do I get an access code?",
    answer:
      "Reach out to us directly and we'll get you set up. As we open booking to more people, codes will become easier to come by — for now it's a small group so we can get this right.",
  },
  {
    question: "How is pricing different from other sites?",
    answer:
      "Every package shows one price, upfront — individual rate and group rate — with what's included and what's not, before you ever send a request. No back-and-forth to find out what something actually costs.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Card and PayPal for USD, MonCash for Gourdes, and ATH Móvil for clients paying from Puerto Rico. Returning clients with a few completed trips under their belt can also pay by cash. You choose how you pay — and what currency — on your own payment page after booking.",
  },
  {
    question: "Do I pay the full amount upfront?",
    answer:
      "No — a deposit holds your spot. The remaining balance is due before the trip, and your payment page always shows exactly how much is left.",
  },
  {
    question: "What happens after I book?",
    answer:
      "You get a trip code — no account or login needed. Use it to open your own trip page anytime: the full day-by-day schedule (where, when, meals), and a direct line to message us if you need to make a change or have a question.",
  },
  {
    question: "Have you actually been to these places?",
    answer:
      "Yes. Every trip in our packages is one we've personally researched and visited — not assembled from listings. If a package includes a stop, someone from our team has already been there.",
  },
  {
    question: "Can I build a custom trip?",
    answer:
      "Yes — weddings, birthdays, fèt champèt, family reunions, or a route we haven't built yet. Message us with what you have in mind and we'll put together a quote.",
  },
];

export default function About() {
  return (
    <div className="space-y-10">
      <div className="card border-l-4 border-brand bg-gradient-to-r from-haiti-navy/5 to-haiti-teal/5 dark:from-haiti-navy/20 dark:to-haiti-teal/20">
        <h1 className="hero-title text-brand">Lakaya&apos;m</h1>
        <p className="sub mt-4 max-w-2xl text-lg">
          Come home. We&apos;ll help you experience more of it — trips to Haiti, planned and priced honestly,
          starting in the North.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">Why we built this</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        <p className="sub text-lg mb-4">
          Too many diaspora Haitians plan a trip home and end up piecing it together through group chats,
          secondhand recommendations, and prices that change depending on who&apos;s asking. Lakaya&apos;m
          exists to fix that: real trips, personally scouted by our team, with one honest price shown before
          you ever send a request.
        </p>
        <p className="sub">
          We&apos;re starting with the North — Cap-Haïtien, the Citadelle Laferrière, Labadie, and the towns
          around them — because that&apos;s where we know the ground best. From there, we&apos;re building
          out trips across the rest of the country.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">How it works</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { step: "1", title: "Browse freely", body: "Explore every package, day-by-day itinerary, and price — no code, no login." },
            { step: "2", title: "Get your code", body: "Booking is in a small private testing batch right now. Reach out and we'll get you set up." },
            { step: "3", title: "Book & pay a deposit", body: "Pick your trip, choose how you pay — USD or Gourdes — and secure your spot with a deposit." },
            { step: "4", title: "Track it with your trip code", body: "No account needed. Your code opens your schedule, and a direct line to us, anytime." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-haiti-turquoise/10 text-haiti-turquoise font-bold flex items-center justify-center text-sm">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-haiti-navy dark:text-haiti-turquoise">{s.title}</h3>
                <p className="sub text-sm mt-1">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gradient-to-r from-haiti-amber/5 to-brand/5 dark:from-haiti-amber/10 dark:to-brand/10 border-haiti-amber/20">
        <h3 className="font-semibold text-lg text-haiti-navy dark:text-haiti-turquoise mb-3">🇭🇹 Built by Haitians, for Haiti</h3>
        <p className="sub">
          Every trip, every recommendation, every detail comes from our own time on the ground — not a
          listing we found online. We&apos;re here to help you come home with confidence, and to support
          local businesses across Haiti while we do it.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-haiti-navy dark:text-haiti-turquoise">Frequently asked questions</h2>
          <div className="h-px bg-gradient-to-r from-brand to-haiti-teal flex-1"></div>
        </div>
        <FAQAccordion items={faqs} />
      </div>

      <div className="card-light text-center">
        <h3 className="font-bold text-lg mb-2">Ready to see what&apos;s available?</h3>
        <p className="sub mb-4">Every package is free to browse — no code required until you&apos;re ready to book.</p>
        <Link href="/trips" className="btn btn-brand inline-flex">
          Browse Trips
        </Link>
      </div>
    </div>
  );
}
