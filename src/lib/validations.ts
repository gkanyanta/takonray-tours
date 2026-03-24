import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().min(9, "Please enter a valid phone number").optional(),
  nationality: z.string().min(2, "Please select your nationality").optional(),
});

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

export const bookingSchema = z.object({
  tourId: z.string().optional(),
  accommodationId: z.string().optional(),
  date: z.string().min(1, "Please select a date"),
  endDate: z.string().optional(),
  guests: z.number().int().min(1, "At least 1 guest required").max(50, "Maximum 50 guests"),
  specialRequests: z.string().max(1000).optional(),
  addOns: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
  contactName: z.string().min(2, "Name is required"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(9, "Please enter a valid phone number"),
  nationality: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(2000, "Review cannot exceed 2000 characters"),
});

// ---------------------------------------------------------------------------
// Admin - Tours
// ---------------------------------------------------------------------------

export const tourSchema = z.object({
  name: z.string().min(3, "Tour name must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().max(200).optional(),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "EXTREME"]),
  duration: z.string().min(1, "Duration is required"),
  maxGroupSize: z.number().int().min(1).max(100),
  minAge: z.number().int().min(0).max(100).optional(),
  meetingPoint: z.string().optional(),
  includes: z.array(z.string()).optional(),
  excludes: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  published: z.boolean().optional(),
  prices: z
    .array(
      z.object({
        tier: z.enum(["LOCAL", "SADC", "INTERNATIONAL"]),
        season: z.enum(["PEAK", "HIGH", "LOW"]),
        amount: z.number().positive("Price must be positive"),
      })
    )
    .optional(),
});

// ---------------------------------------------------------------------------
// Admin - Accommodations
// ---------------------------------------------------------------------------

export const accommodationSchema = z.object({
  name: z.string().min(3, "Accommodation name must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().max(200).optional(),
  type: z.enum(["HOTEL", "LODGE", "GUESTHOUSE", "CAMPSITE", "HOSTEL", "VILLA"]),
  address: z.string().min(5, "Address is required"),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  rooms: z
    .array(
      z.object({
        name: z.string().min(1),
        capacity: z.number().int().min(1),
        pricePerNight: z.number().positive(),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
  published: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(9, "Please enter a valid phone number").optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type TourInput = z.infer<typeof tourSchema>;
export type AccommodationInput = z.infer<typeof accommodationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
