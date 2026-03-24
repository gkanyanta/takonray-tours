export const SITE_NAME = "Takonray Tours";

export const SITE_DESCRIPTION =
  "Discover the best of Livingstone, Zambia with Takonray Tours. From Victoria Falls adventures to sunset cruises, we offer unforgettable experiences for every traveller.";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "Accommodation", href: "/accommodation" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SADC_COUNTRIES = [
  "Angola",
  "Botswana",
  "Comoros",
  "DRC",
  "Eswatini",
  "Lesotho",
  "Madagascar",
  "Malawi",
  "Mauritius",
  "Mozambique",
  "Namibia",
  "Seychelles",
  "South Africa",
  "Tanzania",
  "Zambia",
  "Zimbabwe",
] as const;

export const TOUR_DIFFICULTIES = [
  { value: "EASY", label: "Easy", color: "bg-green-100 text-green-800" },
  { value: "MODERATE", label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
  { value: "CHALLENGING", label: "Challenging", color: "bg-orange-100 text-orange-800" },
  { value: "EXTREME", label: "Extreme", color: "bg-red-100 text-red-800" },
] as const;

export const ACCOMMODATION_TYPES = [
  { value: "HOTEL", label: "Hotel" },
  { value: "LODGE", label: "Lodge" },
  { value: "GUESTHOUSE", label: "Guesthouse" },
  { value: "CAMPSITE", label: "Campsite" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "VILLA", label: "Villa" },
] as const;

export const BOOKING_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  DEPOSIT_PAID: { label: "Deposit Paid", color: "bg-indigo-100 text-indigo-800" },
  FULLY_PAID: { label: "Fully Paid", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Completed", color: "bg-gray-100 text-gray-800" },
  NO_SHOW: { label: "No Show", color: "bg-gray-100 text-gray-600" },
} as const;
