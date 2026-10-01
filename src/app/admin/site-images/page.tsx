import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import HomeHeroEditor from "@/components/HomeHeroEditor";
import FilterableImageList from "@/components/FilterableImageList";

const DEFAULT_HOME_HEROES: Record<string, string> = {
  home_hero_1: "/cap-haitien.jpg",
  home_hero_2: "/limonade.jpg",
  home_hero_3: "/market.jpg",
  home_hero_4: "/lakay.jpg",
  home_hero_5: "/milot.png",
};

export default async function SiteImagesPage() {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const [siteImages, departments, cities] = await Promise.all([
    prisma.site_images.findMany(),
    prisma.departments.findMany({ orderBy: { name: "asc" } }),
    prisma.cities.findMany({ orderBy: { name: "asc" } }),
  ]);

  const current: Record<string, string> = { ...DEFAULT_HOME_HEROES };
  for (const img of siteImages) current[img.key] = img.url;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Site Images</h1>
        <p className="sub mt-1">Swap out placeholder photos across the site.</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Homepage Hero</h2>
        <p className="text-xs sub mb-2">The crossfading photos behind the homepage hero text.</p>
        <HomeHeroEditor current={current} />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">Department Hero Images</h2>
        <FilterableImageList items={departments} endpointBase="/api/admin/departments" />
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-haiti-navy dark:text-haiti-turquoise mb-2">City Hero Images</h2>
        <FilterableImageList items={cities} endpointBase="/api/admin/cities" />
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
