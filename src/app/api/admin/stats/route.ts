import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalRevenue,
      lastMonthRevenue,
      totalBookings,
      lastMonthBookings,
      activeTours,
      newUsersThisMonth,
      lastMonthUsers,
      recentBookings,
    ] = await Promise.all([
      db.payment
        .aggregate({
          where: { status: "COMPLETED", createdAt: { gte: startOfMonth } },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount ?? 0),
      db.payment
        .aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: startOfLastMonth, lt: startOfMonth },
          },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount ?? 0),
      db.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.booking.count({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
      db.tour.count({ where: { active: true } }),
      db.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.user.count({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        },
      }),
      db.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { tour: true, accommodation: true },
      }),
    ]);

    return NextResponse.json({
      totalRevenue,
      lastMonthRevenue,
      totalBookings,
      lastMonthBookings,
      activeTours,
      newUsersThisMonth,
      lastMonthUsers,
      recentBookings,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
