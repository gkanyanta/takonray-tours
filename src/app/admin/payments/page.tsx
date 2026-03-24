import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentsTable } from "@/components/admin/payments-table";

interface Props {
  searchParams: Promise<{ status?: string; method?: string }>;
}

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const { status, method } = await searchParams;

  const where: any = {};
  if (status) where.status = status;
  if (method) where.method = method;

  const payments = await db.payment.findMany({
    where,
    include: {
      booking: {
        select: {
          bookingRef: true,
          customerName: true,
          customerEmail: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">Track payment transactions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <PaymentsTable
            payments={JSON.parse(JSON.stringify(payments))}
            currentStatus={status ?? ""}
            currentMethod={method ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
