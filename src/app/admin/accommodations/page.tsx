import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AccommodationsTable } from "@/components/admin/accommodations-table";

interface Props {
  searchParams: Promise<{ search?: string; type?: string }>;
}

export default async function AdminAccommodationsPage({ searchParams }: Props) {
  const { search, type } = await searchParams;

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (type) {
    where.type = type;
  }

  const accommodations = await db.accommodation.findMany({
    where,
    include: {
      roomTypes: true,
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accommodations</h1>
          <p className="text-sm text-gray-500">
            Manage accommodation listings
          </p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/admin/accommodations/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Accommodation
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <AccommodationsTable
            accommodations={JSON.parse(JSON.stringify(accommodations))}
            currentSearch={search ?? ""}
            currentType={type ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
