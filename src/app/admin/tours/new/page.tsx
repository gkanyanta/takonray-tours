export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { TourForm } from "@/components/admin/tour-form";

export default async function NewTourPage() {
  const categories = await db.tourCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Tour</h1>
        <p className="text-sm text-gray-500">
          Add a new tour to your offerings
        </p>
      </div>
      <TourForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
