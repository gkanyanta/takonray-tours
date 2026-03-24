import { PricingTier, Season } from "@prisma/client";

// Exchange rates (would be fetched from API in production)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  ZMW: 27.5,
  EUR: 0.92,
  GBP: 0.79,
};

export const CURRENCIES = ["USD", "ZMW", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export function convertCurrency(amountUsd: number, currency: Currency): number {
  return Math.round(amountUsd * EXCHANGE_RATES[currency] * 100) / 100;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<string, string> = {
    USD: "$",
    ZMW: "ZMW ",
    EUR: "\u20ac",
    GBP: "\u00a3",
  };
  return `${symbols[currency]}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPrice(amountUsd: number, currency: Currency): string {
  return formatCurrency(convertCurrency(amountUsd, currency), currency);
}

// Determine season from date
export function getSeason(date: Date): Season {
  const month = date.getMonth() + 1; // 1-based
  if (month >= 6 && month <= 10) return "PEAK";
  if (month === 4 || month === 5 || month === 11) return "HIGH";
  return "LOW";
}

// Detect pricing tier from nationality
export function getPricingTier(nationality?: string | null): PricingTier {
  if (!nationality) return "INTERNATIONAL";

  const sadcCountries = [
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
    "Zimbabwe",
  ];

  const upper = nationality.toUpperCase();
  if (upper === "ZAMBIA" || upper === "ZAMBIAN") return "LOCAL";
  if (sadcCountries.some((c) => c.toUpperCase() === upper)) return "SADC";
  return "INTERNATIONAL";
}

// Calculate total booking price
export function calculateBookingPrice(params: {
  basePrice: number;
  guests: number;
  addOns: { price: number; quantity: number }[];
  nights?: number;
}): { baseTotal: number; addOnsTotal: number; total: number } {
  const multiplier = params.nights || 1;
  const baseTotal = params.basePrice * params.guests * multiplier;
  const addOnsTotal = params.addOns.reduce(
    (sum, addon) => sum + addon.price * addon.quantity,
    0
  );
  return {
    baseTotal,
    addOnsTotal,
    total: baseTotal + addOnsTotal,
  };
}

// Deposit amount (30% of total)
export function getDepositAmount(total: number): number {
  return Math.round(total * 0.3 * 100) / 100;
}
