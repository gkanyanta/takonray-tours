import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const users = await db.user.findMany({
    include: {
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500">
          Manage user accounts and roles
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <UsersTable users={JSON.parse(JSON.stringify(users))} />
        </CardContent>
      </Card>
    </div>
  );
}
