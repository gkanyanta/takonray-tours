export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TourForm } from "@/components/admin/tour-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTourPage({ params }: Props) {
  const { id } = await params;
  const [tour, categories] = await Promise.all([
    db.tour.findUnique({
      where: { id },
      include: { pricing: true, addOns: true, category: true },
    }),
    db.tourCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!tour) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Tour</h1>
        <p className="text-sm text-gray-500">
          Update &quot;{tour.name}&quot;
        </p>
      </div>
      <TourForm
        tour={JSON.parse(JSON.stringify(tour))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
