import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateImages() {
  console.log("🔄 Updating images to use local photos...");

  // Update Nord department
  await prisma.departments.update({
    where: { slug: "nord" },
    data: { hero_url: "/nord.png" }
  });
  console.log("✅ Updated Nord department");

  // Get Nord department first
  const nordDept = await prisma.departments.findUnique({ where: { slug: "nord" } });
  
  if (nordDept) {
    // Update cities using compound unique key
    await prisma.cities.update({
      where: { 
        department_id_slug: {
          department_id: nordDept.id,
          slug: "cap-haitien"
        }
      },
      data: { hero_url: "/cap-haitien.jpg" }
    });
    console.log("✅ Updated Cap-Haïtien");

    await prisma.cities.update({
      where: { 
        department_id_slug: {
          department_id: nordDept.id,
          slug: "milot"
        }
      },
      data: { hero_url: "/milot.png" }
    });
    console.log("✅ Updated Milot");

    await prisma.cities.update({
      where: { 
        department_id_slug: {
          department_id: nordDept.id,
          slug: "limonade"
        }
      },
      data: { hero_url: "/limonade.jpg" }
    });
    console.log("✅ Updated Limonade");
  }

  // Update places
  const capCity = await prisma.cities.findFirst({ where: { slug: "cap-haitien" } });
  const milotCity = await prisma.cities.findFirst({ where: { slug: "milot" } });

  if (capCity) {
    await prisma.places.updateMany({
      where: { 
        city_id: capCity.id,
        slug: "habitation-breda-site"
      },
      data: { cover_url: "/cap-haitien.jpg" }
    });
    console.log("✅ Updated Habitation Bréda");
  }

  if (milotCity) {
    await prisma.places.updateMany({
      where: { 
        city_id: milotCity.id,
        slug: "sans-souci-palace"
      },
      data: { cover_url: "/milot.png" }
    });
    console.log("✅ Updated Sans-Souci Palace");
  }

  console.log("🎉 All images updated successfully!");
}

updateImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });