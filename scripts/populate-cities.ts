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
      { name: 'Mirebalais', slug: 'mirebalais' },
      { name: 'Hinche', slug: 'hinche' },
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
      { name: 'Ouanaminthe', slug: 'ouanaminthe' },
      { name: 'Fort-Liberté', slug: 'fort-liberte' },
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

async function populateCities() {
  console.log('Starting to populate cities...');

  for (const departmentData of departmentCities) {
    try {
      // Find the department by slug
      const department = await prisma.departments.findUnique({
        where: { slug: departmentData.departmentSlug }
      });

      if (!department) {
        console.error(`Department not found: ${departmentData.departmentSlug}`);
        continue;
      }

      console.log(`Processing department: ${department.name}`);

      // Add cities for this department
      for (const cityData of departmentData.cities) {
        try {
          // Check if city already exists
          const existingCity = await prisma.cities.findUnique({
            where: {
              department_id_slug: {
                department_id: department.id,
                slug: cityData.slug
              }
            }
          });

          if (existingCity) {
            console.log(`City already exists: ${cityData.name}`);
            continue;
          }

          // Create the city
          const city = await prisma.cities.create({
            data: {
              department_id: department.id,
              slug: cityData.slug,
              name: cityData.name,
              summary: `Discover the beauty and culture of ${cityData.name}, one of ${department.name}'s most vibrant cities.`,
              is_published: true
            }
          });

          console.log(`Created city: ${city.name} in ${department.name}`);
        } catch (cityError) {
          console.error(`Error creating city ${cityData.name}:`, cityError);
        }
      }
    } catch (departmentError) {
      console.error(`Error processing department ${departmentData.departmentSlug}:`, departmentError);
    }
  }

  console.log('Finished populating cities.');
}

populateCities()
  .catch((e) => {
    console.error('Error in populateCities:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });