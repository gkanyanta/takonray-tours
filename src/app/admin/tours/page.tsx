import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToursTable } from "@/components/admin/tours-table";

interface Props {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function AdminToursPage({ searchParams }: Props) {
  const { search, category } = await searchParams;

  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (category) {
    where.categoryId = category;
  }

  const [tours, categories] = await Promise.all([
    db.tour.findMany({
      where,
      include: {
        category: true,
        pricing: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.tourCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm text-gray-500">
            Manage your tour offerings
          </p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/admin/tours/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tour
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ToursTable
            tours={JSON.parse(JSON.stringify(tours))}
            categories={JSON.parse(JSON.stringify(categories))}
            currentSearch={search ?? ""}
            currentCategory={category ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
