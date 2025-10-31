import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const departmentCities = [
  {
    departmentSlug: 'artibonite',
    cities: [
      { name: 'Gonaïves', slug: 'gonaiives' },
      { name: 'Saint-Marc', slug: 'saint-marc' },
      { name: 'Dessalines', slug: 'dessalines' }
    ]
  },
  {
    departmentSlug: 'centre',
    cities: [
      { name: 'Hinche', slug: 'hinche' },
      { name: 'Mirebalais', slug: 'mirebalais' },
      { name: 'Lascahobas', slug: 'lascahobas' }
    ]
  },
  {
    departmentSlug: 'grand-anse',
    cities: [
      { name: 'Jérémie', slug: 'jeremie' },
      { name: 'Anse-d\'Hainault', slug: 'anse-dhainault' },
      { name: 'Moron', slug: 'moron' }
    ]
  },
  {
    departmentSlug: 'nippes',
    cities: [
      { name: 'Miragoâne', slug: 'miragoane' },
      { name: 'Anse-à-Veau', slug: 'anse-a-veau' },
      { name: 'Baradères', slug: 'baraderes' }
    ]
  },
  {
    departmentSlug: 'nord',
    cities: [
      { name: 'Cap-Haïtien', slug: 'cap-haitien' },
      { name: 'Limbé', slug: 'limbe' },
      { name: 'Plaine-du-Nord', slug: 'plaine-du-nord' }
    ]
  },
  {
    departmentSlug: 'nord-est',
    cities: [
      { name: 'Fort-Liberté', slug: 'fort-liberte' },
      { name: 'Ouanaminthe', slug: 'ouanaminthe' },
      { name: 'Trou-du-Nord', slug: 'trou-du-nord' }
    ]
  },
  {
    departmentSlug: 'nord-ouest',
    cities: [
      { name: 'Port-de-Paix', slug: 'port-de-paix' },
      { name: 'Saint-Louis-du-Nord', slug: 'saint-louis-du-nord' },
      { name: 'Jean-Rabel', slug: 'jean-rabel' }
    ]
  },
  {
    departmentSlug: 'ouest',
    cities: [
      { name: 'Port-au-Prince', slug: 'port-au-prince' },
      { name: 'Delmas', slug: 'delmas' },
      { name: 'Carrefour', slug: 'carrefour' }
    ]
  },
  {
    departmentSlug: 'sud',
    cities: [
      { name: 'Les Cayes', slug: 'les-cayes' },
      { name: 'Aquin', slug: 'aquin' },
      { name: 'Torbeck', slug: 'torbeck' }
    ]
  },
  {
    departmentSlug: 'sud-est',
    cities: [
      { name: 'Jacmel', slug: 'jacmel' },
      { name: 'Bainet', slug: 'bainet' },
      { name: 'Belle-Anse', slug: 'belle-anse' }
    ]
  }
];

async function main() {
  console.log('🗑️ Clearing all data that depends on cities...');
  
  // Delete all related data first
  const deletedPlaces = await prisma.places.deleteMany({});
  console.log(`✅ Deleted ${deletedPlaces.count} existing places`);

  const deletedFigures = await prisma.figures.deleteMany({});
  console.log(`✅ Deleted ${deletedFigures.count} existing figures`);

  console.log('🗑️ Clearing all existing cities...');
  
  // Now delete all existing cities
  const deletedCount = await prisma.cities.deleteMany({});
  console.log(`✅ Deleted ${deletedCount.count} existing cities`);

  console.log('🏙️ Creating the 30 specified cities...');

  let totalCreated = 0;

  for (const deptData of departmentCities) {
    // Find the department
    const department = await prisma.departments.findUnique({
      where: { slug: deptData.departmentSlug }
    });

    if (!department) {
      console.log(`❌ Department "${deptData.departmentSlug}" not found`);
      continue;
    }

    console.log(`📍 Adding cities for ${department.name}...`);

    // Create cities for this department
    for (const cityData of deptData.cities) {
      const city = await prisma.cities.create({
        data: {
          name: cityData.name,
          slug: cityData.slug,
          department_id: department.id,
          is_published: true,
          summary: `Discover ${cityData.name}, one of the major cities in ${department.name}.`,
          lat: 0, // Will be updated later with actual coordinates
          lng: 0  // Will be updated later with actual coordinates
        }
      });

      console.log(`   ✅ Created: ${city.name} (${city.slug})`);
      totalCreated++;
    }
  }

  console.log(`\n🎉 Successfully replaced all cities with ${totalCreated} new cities`);
  console.log('📊 Final count by department:');
  
  // Show final count
  for (const deptData of departmentCities) {
    const department = await prisma.departments.findUnique({
      where: { slug: deptData.departmentSlug },
      include: { _count: { select: { cities: true } } }
    });
    
    if (department) {
      console.log(`   ${department.name}: ${department._count.cities} cities`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });