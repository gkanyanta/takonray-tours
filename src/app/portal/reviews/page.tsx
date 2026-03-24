"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  StarIcon,
  PenSquare,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
} from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  tour: { id: string; name: string; slug: string } | null;
  accommodation: { id: string; name: string; slug: string } | null;
}

interface CompletedBooking {
  id: string;
  type: "TOUR" | "ACCOMMODATION";
  tourId: string | null;
  accommodationId: string | null;
  tour: { id: string; name: string } | null;
  accommodation: { id: string; name: string } | null;
}

function StarRating({
  rating,
  onChange,
  interactive = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <StarIcon
            className={`h-5 w-5 ${
              star <= (hovered || rating)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedBookings, setCompletedBookings] = useState<CompletedBooking[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [selectedBooking, setSelectedBooking] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/reviews");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setReviews(data.reviews);
    } catch {
      console.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompletedBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/bookings?status=COMPLETED&limit=100");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCompletedBookings(data.bookings || []);
    } catch {
      console.error("Error fetching completed bookings");
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchCompletedBookings();
  }, [fetchReviews, fetchCompletedBookings]);

  const handleSubmitReview = async () => {
    setSubmitError("");

    if (!selectedBooking) {
      setSubmitError("Please select a booking to review.");
      return;
    }
    if (newRating === 0) {
      setSubmitError("Please select a rating.");
      return;
    }
    if (newComment.trim().length < 10) {
      setSubmitError("Comment must be at least 10 characters.");
      return;
    }

    const booking = completedBookings.find((b) => b.id === selectedBooking);
    if (!booking) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: booking.tourId || undefined,
          accommodationId: booking.accommodationId || undefined,
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || "Failed to submit review");
        return;
      }

      // Reset form
      setSelectedBooking("");
      setNewRating(0);
      setNewComment("");
      setDialogOpen(false);
      fetchReviews();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out bookings that already have reviews
  const reviewedIds = new Set(
    reviews.map((r) => r.tour?.id || r.accommodation?.id).filter(Boolean)
  );
  const reviewableBookings = completedBookings.filter((b) => {
    const targetId = b.tourId || b.accommodationId;
    return targetId && !reviewedIds.has(targetId);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="mt-1 text-gray-500">
            Share your experiences and help other travelers.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-teal-700 hover:bg-teal-800"
              disabled={reviewableBookings.length === 0 && !loading}
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Select Booking</Label>
                <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose a completed booking..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewableBookings.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.type === "TOUR"
                          ? b.tour?.name
                          : b.accommodation?.name}{" "}
                        ({b.type.toLowerCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rating</Label>
                <div className="mt-1.5">
                  <StarRating
                    rating={newRating}
                    onChange={setNewRating}
                    interactive
                  />
                </div>
              </div>

              <div>
                <Label>Your Review</Label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters
                </p>
              </div>

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}

              <Button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full bg-teal-700 hover:bg-teal-800"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No reviews yet
              </h3>
              <p className="text-gray-500 mb-6">
                After completing a trip, come back here to share your experience.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const name = review.tour?.name || review.accommodation?.name || "Unknown";
            const isTour = !!review.tour;

            return (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isTour ? (
                          <MapPin className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        ) : (
                          <Building2 className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold text-gray-900 truncate">
                          {name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        review.approved
                          ? "bg-green-100 text-green-800 flex-shrink-0"
                          : "bg-yellow-100 text-yellow-800 flex-shrink-0"
                      }
                    >
                      {review.approved ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
