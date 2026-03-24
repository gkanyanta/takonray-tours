import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewsList } from "@/components/admin/reviews-list";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const where: any = {};
  if (status === "pending") where.approved = false;
  if (status === "approved") where.approved = true;

  const reviews = await db.review.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true, name: true } },
      accommodation: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500">Moderate customer reviews</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <ReviewsList
            reviews={JSON.parse(JSON.stringify(reviews))}
            currentStatus={status ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
