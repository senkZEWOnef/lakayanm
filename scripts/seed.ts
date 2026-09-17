import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Removed business plans for simplified "Discover Haiti" approach

  // Create departments for the 6 featured cities
  const departments = [
    {
      slug: "nord",
      name: "Nord — The Kingdom's Legacy",
      intro: "The cradle of Haitian independence and royal architecture. Former colonial capital known as 'Paris of the Antilles'.",
      hero_url: "/nord.png",
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
      slug: "artibonite",
      name: "Artibonite — Breadbasket of Haiti",
      intro: "Where independence was proclaimed. Haiti's rice basket along the fertile Artibonite River valley.",
      hero_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
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

  console.log("✅ All 6 departments created");

  // Create the 6 featured cities for "Discover Haiti"
  const citiesData = [
    // Cap-Haïtien - Historical capital
    {
      departmentSlug: "nord",
      cities: [
        {
          slug: "cap-haitien",
          name: "Cap-Haïtien",
          summary: "Former colonial capital known as 'Paris of the Antilles.' Home to the magnificent Citadelle Laferrière, rich colonial architecture, and the birthplace of Haitian independence.",
          lat: 19.7579,
          lng: -72.2040,
          hero_url: "/cap-haitien.jpg",
        },
      ],
    },
    // Port-au-Prince - Current capital
    {
      departmentSlug: "ouest",
      cities: [
        {
          slug: "port-au-prince",
          name: "Port-au-Prince",
          summary: "Haiti's vibrant capital where art, politics, and culture collide. Discover the Iron Market, Musée du Panthéon National, and the beating heart of Haitian creativity.",
          lat: 18.5944,
          lng: -72.3074,
          hero_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        },
      ],
    },
    // Jacmel - Art & carnival
    {
      departmentSlug: "sud-est",
      cities: [
        {
          slug: "jacmel",
          name: "Jacmel",
          summary: "The artistic soul of Haiti. Famous for its carnival papier-mâché arts, stunning French colonial architecture, and the mystical Bassin Bleu pools.",
          lat: 18.2333,
          lng: -72.5333,
          hero_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        },
      ],
    },
    // Gonaïves - Independence city
    {
      departmentSlug: "artibonite",
      cities: [
        {
          slug: "gonaives",
          name: "Gonaïves",
          summary: "The birthplace of Haitian independence. Where freedom was declared in 1804, this sacred city holds the keys to understanding Haiti's revolutionary spirit.",
          lat: 19.4500,
          lng: -72.6833,
          hero_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        },
      ],
    },
    // Les Cayes - Southern gateway
    {
      departmentSlug: "sud",
      cities: [
        {
          slug: "les-cayes",
          name: "Les Cayes",
          summary: "Southern port city and gateway to pristine Île-à-Vache. Experience authentic coastal life, beautiful Gelée Beach, and traditional fishing culture.",
          lat: 18.2000,
          lng: -73.7500,
          hero_url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
        },
      ],
    },
    // Jérémie - Literary heritage
    {
      departmentSlug: "grand-anse",
      cities: [
        {
          slug: "jeremie",
          name: "Jérémie",
          summary: "The 'City of Poets' where Haiti's literary giants were born. Explore 19th-century colonial homes, writers' squares, and the rich intellectual heritage of Haiti.",
          lat: 18.6500,
          lng: -74.1167,
          hero_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        },
      ],
    },
  ];

  // Create all cities
  for (const deptData of citiesData) {
    const department = createdDepartments.find(d => d.slug === deptData.departmentSlug);
    if (department) {
      for (const cityData of deptData.cities) {
        const city = await prisma.cities.findFirst({
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

  console.log("✅ All 6 cities created");

  // Get Cap-Haïtien for places and figures
  const cap = await prisma.cities.findFirst({
    where: { slug: "cap-haitien" }
  });

  if (!cap) {
    console.log("❌ Cap-Haïtien not found, skipping places and figures");
    return;
  }

  // Create cultural places in Cap-Haïtien
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
        description: "Authentic Haitian seaside restaurant featuring traditional cuisine, live music, and stunning ocean views. A cultural dining experience showcasing the flavors of northern Haiti.",
        cover_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        historical_significance: "Local gathering place preserving traditional Haitian culinary culture",
        is_published: true,
        is_featured: true,
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