import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Insert plans
  const plans = await Promise.all([
    prisma.business_plans.upsert({
      where: { code: "starter" },
      update: {},
      create: {
        code: "starter",
        name: "Starter",
        price_month_cents: 1000,
        features: ["Listed in city", "1 cover photo"],
      },
    }),
    prisma.business_plans.upsert({
      where: { code: "growth" },
      update: {},
      create: {
        code: "growth", 
        name: "Growth",
        price_month_cents: 3000,
        features: ["Featured spot", "Menu & booking links", "Gallery up to 10"],
      },
    }),
    prisma.business_plans.upsert({
      where: { code: "premium" },
      update: {},
      create: {
        code: "premium",
        name: "Premium", 
        price_month_cents: 5000,
        features: ["Homepage feature", "Priority support", "Unlimited gallery"],
      },
    }),
  ]);

  console.log("✅ Business plans created");

  // Insert all 9 departments of Haiti with detailed descriptions
  const departments = [
    {
      slug: "nord",
      name: "Nord — The Kingdom's Legacy",
      intro: "The cradle of Haitian independence and royal architecture. Former colonial capital known as 'Paris of the Antilles'.",
      hero_url: "/nord.png",
    },
    {
      slug: "nord-est",
      name: "Nord-Est — The Frontier & the River",
      intro: "Marked by forts, lagoons, and border trade with Dajabón. Historic bay and frontier culture.",
      hero_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    },
    {
      slug: "nord-ouest",
      name: "Nord-Ouest — Desert Beauty & Resistance",
      intro: "Remote and rugged, birthplace of the first black revolutionaries. Where Columbus first landed in 1492.",
      hero_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    },
    {
      slug: "artibonite",
      name: "Artibonite — Breadbasket of Haiti",
      intro: "Where independence was proclaimed. Haiti's rice basket along the fertile Artibonite River valley.",
      hero_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    },
    {
      slug: "ouest",
      name: "Ouest — Heartbeat of the Nation",
      intro: "The political, cultural, and artistic core. Capital region with vibrant urban life and mountain retreats.",
      hero_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    },
    {
      slug: "sud-est",
      name: "Sud-Est — Art, Carnival & Mountains",
      intro: "Birthplace of Haitian art and carnival paper-mâché. Artistic seaside cities with rich cultural heritage.",
      hero_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      slug: "sud",
      name: "Sud — Nature's Sanctuary",
      intro: "Waterfalls, caves, and some of the best beaches in Haiti. Southern port and pristine island getaways.",
      hero_url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
    },
    {
      slug: "grand-anse",
      name: "Grand'Anse — Greenest Corner",
      intro: "Known as 'The City of Poets'. Literary heritage with palm-lined paradise and mountain trails.",
      hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    },
    {
      slug: "centre",
      name: "Centre — Rivers & Sacred Hills",
      intro: "Cradle of both revolution and pilgrimage. Sacred waterfalls and colonial remains in scenic hills.",
      hero_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
    },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.departments.upsert({
      where: { slug: dept.slug },
      update: {},
      create: {
        slug: dept.slug,
        name: dept.name,
        intro: dept.intro,
        hero_url: dept.hero_url,
        is_published: true,
      },
    });
    createdDepartments.push(department);
  }

  console.log("✅ All 9 departments created");

  // Create cities for all departments
  const citiesData = [
    // Nord
    {
      departmentSlug: "nord",
      cities: [
        {
          slug: "cap-haitien",
          name: "Cap-Haïtien",
          summary: "Former colonial capital ('Paris of the Antilles'). Citadelle Laferrière, Sans-Souci Palace, Cathedral Notre-Dame, Labadee Beach.",
          lat: 19.7579,
          lng: -72.2040,
          hero_url: "/cap-haitien.jpg",
        },
        {
          slug: "milot",
          name: "Milot",
          summary: "Royal heart of King Henry Christophe's reign. Sans-Souci Palace ruins, Ramiers site, mountain trails to the Citadelle.",
          lat: 19.6167,
          lng: -72.2167,
          hero_url: "/milot.png",
        },
        {
          slug: "limonade",
          name: "Bord-de-Mer-de-Limonade",
          summary: "Coastal charm, old sugar estates. Quiet beaches, colonial sugar mill ruins, fishing culture.",
          lat: 19.6667,
          lng: -72.1333,
          hero_url: "/limonade.jpg",
        },
      ],
    },
    // Nord-Est
    {
      departmentSlug: "nord-est",
      cities: [
        {
          slug: "fort-liberte",
          name: "Fort-Liberté",
          summary: "Historic bay and forts from the 1700s. Fort Dauphin, Fort Labouque, Baie de Fort-Liberté.",
          lat: 19.6667,
          lng: -71.8333,
          hero_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        },
        {
          slug: "ouanaminthe",
          name: "Ouanaminthe",
          summary: "Border commerce & culture mix. Bridge to Dajabón, market scenes, cultural exchange.",
          lat: 19.5500,
          lng: -71.7167,
          hero_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        },
        {
          slug: "ferrier",
          name: "Ferrier",
          summary: "Quiet countryside. Plantation ruins, river landscapes.",
          lat: 19.6333,
          lng: -71.7667,
          hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
      ],
    },
    // Nord-Ouest
    {
      departmentSlug: "nord-ouest",
      cities: [
        {
          slug: "port-de-paix",
          name: "Port-de-Paix",
          summary: "First landing of Columbus (1492). Île de la Tortue ferry, local port markets.",
          lat: 19.9333,
          lng: -72.8333,
          hero_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        },
        {
          slug: "mole-saint-nicolas",
          name: "Môle-Saint-Nicolas",
          summary: "Strategic bay of revolutionaries. Colonial fort ruins, clear waters, cliffs.",
          lat: 19.8000,
          lng: -73.3833,
          hero_url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
        },
        {
          slug: "saint-louis-du-nord",
          name: "Saint-Louis-du-Nord",
          summary: "Spiritual and coastal traditions. Voodoo pilgrimage, fishing harbor.",
          lat: 19.9167,
          lng: -72.7000,
          hero_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        },
      ],
    },
    // Artibonite
    {
      departmentSlug: "artibonite",
      cities: [
        {
          slug: "gonaives",
          name: "Gonaïves",
          summary: "'City of Independence'. Independence Square, Cathedral, Freedom Museum.",
          lat: 19.4500,
          lng: -72.6833,
          hero_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        },
        {
          slug: "saint-marc",
          name: "Saint-Marc",
          summary: "Port town with beaches and colonial vibe. Amani-y Beach, Fort Mézy ruins.",
          lat: 19.1167,
          lng: -72.7000,
          hero_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        },
        {
          slug: "dessalines",
          name: "Dessalines",
          summary: "Named after Emperor Jean-Jacques Dessalines. Fort Décidé, historical ruins, countryside trails.",
          lat: 19.2667,
          lng: -72.5167,
          hero_url: "https://images.unsplash.com/photo-1520975661595-6453be3f7070",
        },
      ],
    },
    // Ouest
    {
      departmentSlug: "ouest",
      cities: [
        {
          slug: "port-au-prince",
          name: "Port-au-Prince",
          summary: "Capital city, art & chaos intertwined. Musée du Panthéon National, Iron Market, Champs de Mars.",
          lat: 18.5944,
          lng: -72.3074,
          hero_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        },
        {
          slug: "petion-ville",
          name: "Pétion-Ville",
          summary: "Modern cafés & nightlife. Boutiques, restaurants, cultural centers.",
          lat: 18.5125,
          lng: -72.2853,
          hero_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        },
        {
          slug: "kenscoff",
          name: "Kenscoff",
          summary: "Cool mountain air & farms. Pine forests, eco-lodges, rustic retreats.",
          lat: 18.4500,
          lng: -72.2833,
          hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
      ],
    },
    // Sud-Est
    {
      departmentSlug: "sud-est",
      cities: [
        {
          slug: "jacmel",
          name: "Jacmel",
          summary: "Artistic seaside city. Carnival art studios, Bassin Bleu, old French architecture.",
          lat: 18.2333,
          lng: -72.5333,
          hero_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        },
        {
          slug: "marigot",
          name: "Marigot",
          summary: "Fishing village with quiet charm. Coastal hikes, local crafts.",
          lat: 18.2167,
          lng: -72.3167,
          hero_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        },
        {
          slug: "bainet",
          name: "Bainet",
          summary: "Folk culture and folklore. Rural festivals, scenic coastline.",
          lat: 18.1833,
          lng: -72.7500,
          hero_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        },
      ],
    },
    // Sud
    {
      departmentSlug: "sud",
      cities: [
        {
          slug: "les-cayes",
          name: "Les Cayes",
          summary: "Southern port & base for Île-à-Vache. Gelee Beach, Cathedral, ferry to Île-à-Vache.",
          lat: 18.2000,
          lng: -73.7500,
          hero_url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
        },
        {
          slug: "ile-a-vache",
          name: "Île-à-Vache",
          summary: "Pristine island getaway. Abaka Bay, Port Morgan, fishing life.",
          lat: 18.0833,
          lng: -73.6667,
          hero_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        },
        {
          slug: "camp-perrin",
          name: "Camp-Perrin",
          summary: "Waterfalls & greenery. Saut-Mathurine falls, eco-lodges.",
          lat: 18.3333,
          lng: -73.8500,
          hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
      ],
    },
    // Grand'Anse
    {
      departmentSlug: "grand-anse",
      cities: [
        {
          slug: "jeremie",
          name: "Jérémie",
          summary: "Literary heritage & coastlines. Poets' Square, beaches, 19th-century homes.",
          lat: 18.6500,
          lng: -74.1167,
          hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
        {
          slug: "abricots",
          name: "Abricots",
          summary: "Palm-lined paradise. Natural pools, rural charm.",
          lat: 18.6333,
          lng: -74.3000,
          hero_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        },
        {
          slug: "dame-marie",
          name: "Dame-Marie",
          summary: "Gateway to Moron mountains. Beaches, cacao farms, hiking trails.",
          lat: 18.5667,
          lng: -74.4167,
          hero_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        },
      ],
    },
    // Centre
    {
      departmentSlug: "centre",
      cities: [
        {
          slug: "hinche",
          name: "Hinche",
          summary: "Waterfalls & colonial remains. Bassin Zim, old church ruins.",
          lat: 19.1500,
          lng: -71.9833,
          hero_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
        },
        {
          slug: "mirebalais",
          name: "Mirebalais",
          summary: "Health hub & scenic hills. Hospital (Partners in Health), river views.",
          lat: 18.8333,
          lng: -72.1000,
          hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
        {
          slug: "saut-d-eau",
          name: "Saut-d'Eau",
          summary: "Sacred waterfall & pilgrimage site. Annual Festival of Our Lady of Mount Carmel.",
          lat: 19.0167,
          lng: -72.2000,
          hero_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        },
      ],
    },
  ];

  // Create all cities
  for (const deptData of citiesData) {
    const department = createdDepartments.find(d => d.slug === deptData.departmentSlug);
    if (department) {
      for (const cityData of deptData.cities) {
        let city = await prisma.cities.findFirst({
          where: { department_id: department.id, slug: cityData.slug }
        });
        
        if (!city) {
          await prisma.cities.create({
            data: {
              department_id: department.id,
              slug: cityData.slug,
              name: cityData.name,
              summary: cityData.summary,
              lat: cityData.lat,
              lng: cityData.lng,
              hero_url: cityData.hero_url,
              is_published: true,
            },
          });
        }
      }
    }
  }

  console.log("✅ All cities created");

  // Get Cap-Haïtien for existing places and figures
  const cap = await prisma.cities.findFirst({
    where: { slug: "cap-haitien" }
  });

  if (!cap) {
    console.log("❌ Cap-Haïtien not found, skipping places and figures");
    return;
  }

  // Insert places
  let lakay = await prisma.places.findFirst({
    where: { city_id: cap.id, slug: "lakay-restaurant" }
  });
  
  if (!lakay) {
    lakay = await prisma.places.create({
      data: {
        city_id: cap.id,
        kind: "restaurant",
        name: "Lakay Restaurant",
        slug: "lakay-restaurant",
        description: "Seaside Haitian cuisine & live music.",
        price_range: "$",
        cover_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        is_published: true,
      },
    });
  }

  let citadelle = await prisma.places.findFirst({
    where: { city_id: cap.id, slug: "citadelle-laferriere" }
  });
  
  if (!citadelle) {
    citadelle = await prisma.places.create({
      data: {
        city_id: cap.id,
        kind: "landmark",
        name: "Citadelle Laferrière",
        slug: "citadelle-laferriere",
        description: "Iconic mountaintop fortress built under King Henry Christophe; UNESCO World Heritage site.",
        cover_url: "https://images.unsplash.com/photo-1520975661595-6453be3f7070",
        is_published: true,
      },
    });
  }

  // Add Habitation Bréda historical site
  let habitationBreda = await prisma.places.findFirst({
    where: { city_id: cap.id, slug: "habitation-breda-site" }
  });
  
  if (!habitationBreda) {
    habitationBreda = await prisma.places.create({
      data: {
        city_id: cap.id,
        kind: "landmark",
        name: "Habitation Bréda Historical Site",
        slug: "habitation-breda-site",
        description: "Birthplace of Toussaint Louverture (1743). Original plantation no longer exists, but site features monument, Lycée Toussaint Louverture, and commemorative markers. Essential pilgrimage for understanding Haiti's revolutionary history.",
        address: "Haut-du-Cap, Cap-Haïtien",
        cover_url: "/cap-haitien.jpg",
        is_published: true,
        is_featured: true,
      },
    });
  }

  console.log("✅ Places created");

  // Insert historical figures
  let toussaint = await prisma.figures.findFirst({
    where: { city_id: cap.id, slug: "toussaint-louverture" }
  });
  
  if (!toussaint) {
    toussaint = await prisma.figures.create({
      data: {
        city_id: cap.id,
        name: "Toussaint Louverture",
        slug: "toussaint-louverture",
        full_name: "François-Dominique Toussaint Louverture",
        category: "Revolutionary Leader",
        bio: "Born at Habitation Bréda du Haut-du-Cap near Cap-Français. The mastermind of the Haitian Revolution who rose from slavery to become Saint-Domingue's leader. Known as 'Louverture' for his ability to find openings in enemy lines.",
        birth_year: 1743,
        death_year: 1803,
        birth_place: "Habitation Bréda du Haut-du-Cap, near Cap-Français (Cap-Haïtien)",
        death_place: "Fort de Joux, France",
        legacy: "Father of Haitian independence, first successful slave revolution leader, military genius who defeated European powers",
        famous_works: "Constitution of Saint-Domingue (1801), Military campaigns that freed Haiti",
        lived_addresses: JSON.stringify([
          "Habitation Bréda du Haut-du-Cap (childhood and early life)",
          "Plantation at Petit-Cormier (as free man)"
        ]),
        monuments: JSON.stringify([
          "Monument at former Habitation Bréda site",
          "Lycée Toussaint Louverture at Cap-Haïtien", 
          "Fort de Joux memorial in France"
        ]),
        contemporaries: "Jean-Jacques Dessalines, Henry Christophe, André Rigaud",
        movements: "Haitian Revolution, Abolitionist movement",
        quotes: JSON.stringify([
          "En me renversant, on n'a abattu à Saint-Domingue que le tronc de l'arbre de la liberté, mais il repoussera car ses racines sont profondes et nombreuses"
        ]),
        portrait_url: "https://upload.wikimedia.org/wikipedia/commons/3/32/G%C3%A9n%C3%A9ral_Toussaint_Louverture.jpg",
        is_published: true,
      },
    });
  }

  // Get Milot for King Henry Christophe
  const milot = await prisma.cities.findFirst({
    where: { slug: "milot" }
  });

  if (milot) {
    let henry = await prisma.figures.findFirst({
      where: { city_id: milot.id, slug: "henry-christophe" }
    });
    
    if (!henry) {
      henry = await prisma.figures.create({
        data: {
          city_id: milot.id,
          name: "Henry Christophe",
          slug: "henry-christophe",
          full_name: "Henri Christophe, King Henry I of Haiti",
          category: "Revolutionary Leader & King",
          bio: "Born in Grenada, rose from slavery to become King Henry I of Haiti (1811-1820). Built the royal capital at Milot with Sans-Souci Palace as his Versailles and Citadelle Laferrière as his fortress. The only crowned monarch of the New World to emerge from the slave revolution.",
          birth_year: 1767,
          death_year: 1820,
          birth_place: "British Grenada",
          death_place: "Cap-Henri (Cap-Haïtien), Kingdom of Haiti",
          legacy: "Created the Kingdom of Haiti, built architectural wonders that survive today, established Haiti's first noble class",
          famous_works: "Sans-Souci Palace, Citadelle Laferrière, Code Henry (legal system), Royal and Military Order of Saint Henry",
          lived_addresses: JSON.stringify([
            "Sans-Souci Palace, Milot (royal residence)",
            "Cap-Henry (renamed Cap-Français as his northern capital)"
          ]),
          monuments: JSON.stringify([
            "Sans-Souci Palace ruins in Milot",
            "Citadelle Laferrière on mountain near Milot", 
            "Royal Chapel of Milot",
            "Equestrian statue in Port-au-Prince"
          ]),
          contemporaries: "Toussaint Louverture, Jean-Jacques Dessalines, Alexandre Pétion",
          movements: "Haitian Revolution, Kingdom of Haiti monarchy",
          quotes: JSON.stringify([
            "Je renais de mes cendres (I rise from my ashes)",
            "Henry, by the grace of God and constitutional law of the state, King of Haiti, Destroyer of tyranny, Regenerator and Benefactor of the Haitian nation"
          ]),
          portrait_url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Henri_Christophe.jpg",
          is_published: true,
        },
      });
    }

    // Add Sans-Souci Palace to Milot
    let sansSouci = await prisma.places.findFirst({
      where: { city_id: milot.id, slug: "sans-souci-palace" }
    });
    
    if (!sansSouci) {
      sansSouci = await prisma.places.create({
        data: {
          city_id: milot.id,
          kind: "landmark",
          name: "Sans-Souci Palace",
          slug: "sans-souci-palace",
          description: "King Henry Christophe's royal palace, the 'Versailles of Haiti.' Built 1810-1813 as the centerpiece of his kingdom. UNESCO World Heritage Site showcasing the grandeur of the first Black king in the New World.",
          address: "Milot, Nord Department",
          cover_url: "/milot.png",
          is_published: true,
          is_featured: true,
        },
      });
    }

    // Add Royal Chapel of Milot
    let royalChapel = await prisma.places.findFirst({
      where: { city_id: milot.id, slug: "royal-chapel-milot" }
    });
    
    if (!royalChapel) {
      royalChapel = await prisma.places.create({
        data: {
          city_id: milot.id,
          kind: "landmark",
          name: "Royal Chapel of Milot",
          slug: "royal-chapel-milot",
          description: "Where King Henry I was crowned by Archbishop Jean-Baptiste-Joseph Brelle in 1811. Sacred site of Haiti's only royal coronation, marking the birth of the Kingdom of Haiti.",
          address: "Milot, Nord Department",
          cover_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
          is_published: true,
          is_featured: true,
        },
      });
    }
  }

  console.log("✅ Historical figures created");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });