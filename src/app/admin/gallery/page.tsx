import { prisma } from "@/lib/db";
import GalleryUploadForm from "@/components/GalleryUploadForm";
import AdminGalleryList from "@/components/AdminGalleryList";

export default async function AdminGalleryPage() {
  const items = await prisma.gallery_items.findMany({ orderBy: { created_at: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Gallery</h1>
        <p className="sub mt-1">{items.length} item{items.length === 1 ? "" : "s"}</p>
      </div>

      <GalleryUploadForm />

      <AdminGalleryList items={items} />
    </div>
  );
}

export const dynamic = "force-dynamic";
