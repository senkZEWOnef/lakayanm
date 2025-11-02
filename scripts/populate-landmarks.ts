import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const landmarksData = [
  {
    citySlug: 'cap-haitien',
    landmarks: [
      {
        name: 'Citadelle Laferrière',
        slug: 'citadelle-laferriere',
        description: 'A massive mountaintop fortress built by Henri Christophe in the early 19th century to defend Haiti from potential French invasion.',
        address: 'Milot, Nord Department, Haiti',
        lat: 19.5733,
        lng: -72.2421,
        gps_coordinates: '19.5733, -72.2421',
        directions_text: 'From Cap-Haïtien: Take Route Nationale 3 south for 20km to Milot. Follow signs to Citadelle. Park at base and take guided transport up the mountain.',
        transport_info: {
          car: 'Drive to Milot village, park at designated area',
          taxi: 'Taxi from Cap-Haïtien to Milot (30-40 minutes)',
          bus: 'Local buses (tap-tap) run from Cap-Haïtien to Milot',
          walking: 'Steep 1-hour hike from Milot village to fortress'
        },
        parking_info: 'Free parking available in Milot village. Secure parking area near starting point.',
        best_visiting_time: 'Early morning (8-10 AM) to avoid heat and crowds. Closed Mondays.',
        entrance_fee: '200 HTG for adults, 100 HTG for students. Guided tour +50 HTG.',
        guided_tours: true,
        accessibility: 'Not wheelchair accessible due to steep terrain and historical architecture.',
        historical_significance: 'UNESCO World Heritage Site. Built 1805-1820 as symbol of Haitian independence and resistance.',
        unesco_site: true,
        is_published: true,
        kind: 'landmark'
      }
    ]
  },
  {
    citySlug: 'port-au-prince',
    landmarks: [
      {
        name: 'Palais National (Historic Site)',
        slug: 'palais-national-historic',
        description: 'Former presidential palace, now a historic site representing Haiti\'s political history.',
        address: 'Champ de Mars, Port-au-Prince, Haiti',
        lat: 18.5392,
        lng: -72.3370,
        gps_coordinates: '18.5392, -72.3370',
        directions_text: 'Located in downtown Port-au-Prince at Champ de Mars square. Accessible by main roads from all directions.',
        transport_info: {
          car: 'Multiple parking areas around Champ de Mars',
          taxi: 'All taxi drivers know Champ de Mars location',
          bus: 'Public buses stop at Champ de Mars',
          walking: 'Central location, walkable from most downtown hotels'
        },
        parking_info: 'Street parking available. Use paid parking lots for security.',
        best_visiting_time: 'Daytime hours (9 AM - 4 PM) for safety and better lighting.',
        entrance_fee: 'Free to view exterior. Guided tours when available: 150 HTG.',
        guided_tours: false,
        accessibility: 'Ground level viewing accessible. Interior access limited.',
        historical_significance: 'Symbol of Haitian sovereignty. Destroyed in 2010 earthquake, now preserved as historic monument.',
        unesco_site: false,
        is_published: true,
        kind: 'landmark'
      },
      {
        name: 'Musée du Panthéon National Haïtien',
        slug: 'musee-pantheon-national',
        description: 'National museum showcasing Haiti\'s history, culture, and independence heroes.',
        address: 'Place des Héros de l\'Indépendance, Port-au-Prince, Haiti',
        lat: 18.5434,
        lng: -72.3386,
        gps_coordinates: '18.5434, -72.3386',
        directions_text: 'Near Champ de Mars, adjacent to Place des Héros de l\'Indépendance. Well-marked cultural district.',
        transport_info: {
          car: 'Parking available at cultural center',
          taxi: 'Ask for "Musée Panthéon" or "Place des Héros"',
          bus: 'Champ de Mars bus stop, 5-minute walk',
          walking: 'Central cultural district location'
        },
        parking_info: 'Secure parking at cultural center. Small fee required.',
        best_visiting_time: 'Tuesday-Saturday 9 AM - 4 PM. Closed Sundays and Mondays.',
        entrance_fee: '250 HTG adults, 125 HTG students/seniors. Group discounts available.',
        guided_tours: true,
        accessibility: 'Wheelchair accessible main floors. Elevator available.',
        historical_significance: 'Houses artifacts from Haitian independence, including personal items of Toussaint Louverture and Jean-Jacques Dessalines.',
        unesco_site: false,
        is_published: true,
        kind: 'landmark'
      }
    ]
  },
  {
    citySlug: 'jacmel',
    landmarks: [
      {
        name: 'Jacmel Historic District',
        slug: 'jacmel-historic-district',
        description: 'Colonial architecture and Victorian-era buildings showcasing Haiti\'s cultural heritage.',
        address: 'Downtown Jacmel, Sud-Est Department, Haiti',
        lat: 18.2347,
        lng: -72.5347,
        gps_coordinates: '18.2347, -72.5347',
        directions_text: 'From Port-au-Prince: Take Route Nationale 2 south, then Route Départementale 401 to Jacmel (1.5-2 hours).',
        transport_info: {
          car: 'Scenic coastal drive from Port-au-Prince',
          taxi: 'Long-distance taxi or arranged transport',
          bus: 'Regular bus service from Port-au-Prince',
          walking: 'Historic district is walkable once in Jacmel'
        },
        parking_info: 'Street parking in historic area. Some hotels offer parking.',
        best_visiting_time: 'Year-round. Avoid hurricane season (June-November). Carnival season (February) very crowded.',
        entrance_fee: 'Free to explore streets. Individual buildings may charge entrance.',
        guided_tours: true,
        accessibility: 'Cobblestone streets challenging for wheelchairs. Some buildings accessible.',
        historical_significance: 'Best-preserved colonial architecture in Haiti. Historic port city with Victorian ironwork buildings.',
        unesco_site: false,
        is_published: true,
        kind: 'landmark'
      }
    ]
  }
];

async function main() {
  console.log('🏛️ Populating landmarks with GPS navigation data...');

  let totalCreated = 0;

  for (const cityData of landmarksData) {
    // Find the city first
    const city = await prisma.cities.findFirst({
      where: { slug: cityData.citySlug }
    });

    if (!city) {
      console.log(`❌ City "${cityData.citySlug}" not found, skipping...`);
      continue;
    }

    console.log(`📍 Adding landmarks for ${city.name}...`);

    for (const landmarkData of cityData.landmarks) {
      try {
        const landmark = await prisma.places.create({
          data: {
            ...landmarkData,
            city_id: city.id
          }
        });

        console.log(`   ✅ Created: ${landmark.name}`);
        totalCreated++;
      } catch (error) {
        console.log(`   ❌ Failed to create ${landmarkData.name}:`, error);
      }
    }
  }

  console.log(`\n🎉 Successfully created ${totalCreated} landmarks with GPS navigation data`);
  
  // Show summary
  const landmarkCount = await prisma.places.count({
    where: { kind: 'landmark' }
  });
  
  console.log(`📊 Total landmarks in database: ${landmarkCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });