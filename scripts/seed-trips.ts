import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Placeholder pricing/itineraries — swap these in once you've personally
// scouted each trip. Keep the shape (day-by-day, includes/excludes,
// individual vs. group pricing) since the trip detail page and inquiry
// widget both depend on it.
const tripsData = [
  {
    slug: "cap-haitien-3-days",
    title: "Cap-Haïtien in 3 Days",
    tagline: "City, food, coastline, and a real base to explore from",
    summary:
      "A grounded introduction to the North: the historic center, the coastline just outside the city, and a hotel and driver you can count on for the whole trip.",
    category: "city",
    hero_url: "/cap-haitien.jpg",
    duration_days: 3,
    price_individual_cents: 54900,
    price_group_cents: 44900,
    deposit_cents: 15000,
    cities: ["cap-haitien"],
    includes: [
      "Airport pickup and drop-off in Cap-Haïtien",
      "2 nights at a vetted hotel",
      "Private driver for all in-city transport",
      "Guided walking tour of the historic center",
      "Daily breakfast",
    ],
    excludes: [
      "International flights",
      "Lunch and dinner (recommendations provided)",
      "Travel insurance",
      "Tips for guides and drivers",
    ],
    days: [
      {
        day_number: 1,
        title: "Arrival & Historic Center",
        description:
          "Airport pickup, hotel check-in, then a guided walk through downtown Cap-Haïtien — the cathedral, the waterfront, and the colonial architecture. Dinner recommendation provided.",
      },
      {
        day_number: 2,
        title: "Coastline & Local Life",
        description:
          "Morning at a nearby beach, then a stop at the local market and lunch at a family-run restaurant we've personally vetted.",
      },
      {
        day_number: 3,
        title: "Free Morning & Departure",
        description: "A free morning for last-minute shopping or rest, then transport to the airport for your departure.",
      },
    ],
  },
  {
    slug: "citadelle-milot",
    title: "Citadelle & Milot",
    tagline: "Sans-Souci Palace and the Citadelle Laferrière, guided",
    summary:
      "A history-focused trip to Milot: the ruins of King Henri Christophe's royal palace and the UNESCO World Heritage Citadelle Laferrière, with a licensed guide the whole way.",
    category: "history",
    hero_url: "/milot.png",
    duration_days: 2,
    price_individual_cents: 34900,
    price_group_cents: 27900,
    deposit_cents: 10000,
    cities: ["milot", "cap-haitien"],
    includes: [
      "Private transport from Cap-Haïtien to Milot",
      "Licensed guide for Sans-Souci Palace and the Citadelle",
      "Horse or 4x4 ride up to the Citadelle (your choice)",
      "Bottled water",
      "1 night hotel in Cap-Haïtien",
    ],
    excludes: [
      "International flights",
      "Meals",
      "Entrance fees paid on-site (we tell you exactly how much in advance)",
      "Tips",
    ],
    days: [
      {
        day_number: 1,
        title: "Sans-Souci Palace",
        description:
          "Drive to Milot and explore the ruins of Sans-Souci, King Henri Christophe's royal palace, with a guide who walks you through the history.",
      },
      {
        day_number: 2,
        title: "The Citadelle Laferrière",
        description:
          "Ride up to the Citadelle Laferrière — Haiti's UNESCO World Heritage fortress — for a guided tour, then return to Cap-Haïtien.",
      },
    ],
  },
  {
    slug: "labadee-north-coast",
    title: "Labadee & the North Coast",
    tagline: "A beach day with access and arrangements verified in advance",
    summary:
      "A straightforward beach day on the North Coast. We verify access and arrangements ourselves before listing this trip, so there are no surprises when you arrive.",
    category: "beach",
    hero_url: "/limonade.jpg",
    duration_days: 1,
    price_individual_cents: 19900,
    price_group_cents: 15900,
    deposit_cents: 7500,
    cities: ["limonade", "cap-haitien"],
    includes: [
      "Round-trip transport from Cap-Haïtien",
      "Verified beach access",
      "Lounge chair and umbrella",
      "Bottled water and fruit",
    ],
    excludes: ["International flights", "Lunch (beachside vendors available)", "Water sports add-ons", "Tips"],
    days: [
      {
        day_number: 1,
        title: "Labadee Beach Day",
        description:
          "Round-trip transport to the North Coast for a full day at the beach — access and arrangements confirmed by us in advance.",
      },
    ],
  },
];

async function main() {
  const department = await prisma.departments.findUnique({ where: { slug: "nord" } });
  if (!department) {
    throw new Error("Nord department not found — seed departments/cities first.");
  }

  for (const tripData of tripsData) {
    const { cities: citySlugs, days, ...tripFields } = tripData;

    let trip = await prisma.trips.findUnique({ where: { slug: tripData.slug } });
    if (!trip) {
      trip = await prisma.trips.create({
        data: {
          ...tripFields,
          department_id: department.id,
          is_published: true,
        },
      });
      console.log(`Created trip: ${trip.title}`);
    } else {
      console.log(`Trip already exists, skipping: ${trip.title}`);
    }

    for (const day of days) {
      const existingDay = await prisma.trip_days.findUnique({
        where: { trip_id_day_number: { trip_id: trip.id, day_number: day.day_number } },
      });
      if (!existingDay) {
        await prisma.trip_days.create({ data: { ...day, trip_id: trip.id } });
      }
    }

    for (const citySlug of citySlugs) {
      const city = await prisma.cities.findFirst({ where: { slug: citySlug, department_id: department.id } });
      if (!city) {
        console.warn(`  City not found, skipping link: ${citySlug}`);
        continue;
      }
      const existingLink = await prisma.trip_cities.findUnique({
        where: { trip_id_city_id: { trip_id: trip.id, city_id: city.id } },
      });
      if (!existingLink) {
        await prisma.trip_cities.create({ data: { trip_id: trip.id, city_id: city.id } });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
