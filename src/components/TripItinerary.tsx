import Image from "next/image";

interface Day {
  id: string;
  day_number: number;
  title: string;
  description: string;
  location: string | null;
  start_time: string | null;
  meal_info: string | null;
  photos: unknown;
}

export default function TripItinerary({ days, heading = "Day by Day" }: { days: Day[]; heading?: string }) {
  if (days.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">{heading}</h2>
        <div className="h-px bg-gradient-to-r from-amber-400 to-transparent flex-1"></div>
      </div>
      <div className="space-y-4">
        {days.map((day) => {
          const photos = Array.isArray(day.photos) ? (day.photos as string[]) : [];
          return (
            <div key={day.id} className="card flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-haiti-amber/10 text-haiti-amber rounded-full flex items-center justify-center font-bold">
                {day.day_number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-haiti-navy dark:text-haiti-turquoise mb-1">{day.title}</h3>
                <p className="text-sm sub leading-relaxed">{day.description}</p>
                {(day.location || day.start_time || day.meal_info) && (
                  <p className="text-xs sub mt-2">
                    {day.location && <span>📍 {day.location} </span>}
                    {day.start_time && <span>· 🕐 {day.start_time} </span>}
                    {day.meal_info && <span>· 🍽️ {day.meal_info}</span>}
                  </p>
                )}
                {photos.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {photos.map((url) => (
                      <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image src={url} alt={day.title} fill className="object-cover" sizes="80px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
