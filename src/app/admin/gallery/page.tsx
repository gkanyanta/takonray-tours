import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const images = await db.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <p className="text-sm text-gray-500">
          Manage your image gallery
        </p>
      </div>

      <GalleryManager images={JSON.parse(JSON.stringify(images))} />
    </div>
  );
}
