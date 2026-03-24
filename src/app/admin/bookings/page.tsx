import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { BookingsTable } from "@/components/admin/bookings-table";

interface Props {
  searchParams: Promise<{
    status?: string;
    type?: string;
    search?: string;
  }>;
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const { status, type, search } = await searchParams;

  const where: any = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (search) {
    where.OR = [
      { bookingRef: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerEmail: { contains: search, mode: "insensitive" } },
    ];
  }

  const bookings = await db.booking.findMany({
    where,
    include: {
      tour: { select: { name: true } },
      accommodation: { select: { name: true } },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-500">Manage customer bookings</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <BookingsTable
            bookings={JSON.parse(JSON.stringify(bookings))}
            currentStatus={status ?? ""}
            currentType={type ?? ""}
            currentSearch={search ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
