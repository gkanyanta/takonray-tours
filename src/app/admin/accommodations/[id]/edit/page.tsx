export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AccommodationForm } from "@/components/admin/accommodation-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAccommodationPage({ params }: Props) {
  const { id } = await params;
  const accommodation = await db.accommodation.findUnique({
    where: { id },
    include: {
      roomTypes: {
        include: { pricing: true },
      },
    },
  });

  if (!accommodation) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Accommodation
        </h1>
        <p className="text-sm text-gray-500">
          Update &quot;{accommodation.name}&quot;
        </p>
      </div>
      <AccommodationForm
        accommodation={JSON.parse(JSON.stringify(accommodation))}
      />
    </div>
  );
}
