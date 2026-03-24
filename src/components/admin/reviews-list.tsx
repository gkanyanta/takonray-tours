"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, Trash2, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  tour: { id: string; name: string } | null;
  accommodation: { id: string; name: string } | null;
}

export function ReviewsList({
  reviews,
  currentStatus,
}: {
  reviews: Review[];
  currentStatus: string;
}) {
  const router = useRouter();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams();
    if (value && value !== "all") params.set("status", value);
    router.push(`/admin/reviews?${params.toString()}`);
  };

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    router.refresh();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: false }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center gap-3 border-b p-4">
        <Select value={currentStatus || "all"} onValueChange={handleFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Reviews" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No reviews found
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-4 p-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-medium">
                    {review.user.name ?? review.user.email}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      review.approved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {review.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {review.tour?.name ??
                    review.accommodation?.name ??
                    "Unknown"}{" "}
                  &middot;{" "}
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>

              <div className="flex items-center gap-1">
                {!review.approved && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-800"
                    onClick={() => handleApprove(review.id)}
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {review.approved && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-yellow-600 hover:text-yellow-800"
                    onClick={() => handleReject(review.id)}
                    title="Unapprove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(review.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
