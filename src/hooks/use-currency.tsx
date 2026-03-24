"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENCIES,
  convertCurrency,
  formatCurrency,
  formatPrice,
  type Currency,
} from "@/lib/pricing";

const STORAGE_KEY = "takonray-currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /** Convert a USD amount to the selected currency */
  convert: (amountUsd: number) => number;
  /** Format a raw amount in the selected currency */
  format: (amount: number) => string;
  /** Convert from USD and format in one step */
  formatFromUsd: (amountUsd: number) => string;
  currencies: readonly Currency[];
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (CURRENCIES as readonly string[]).includes(stored)) {
        setCurrencyState(stored as Currency);
      }
    } catch {
      // localStorage unavailable (SSR, private browsing, etc.)
    }
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const convert = useCallback(
    (amountUsd: number) => convertCurrency(amountUsd, currency),
    [currency]
  );

  const format = useCallback(
    (amount: number) => formatCurrency(amount, currency),
    [currency]
  );

  const formatFromUsd = useCallback(
    (amountUsd: number) => formatPrice(amountUsd, currency),
    [currency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convert,
        format,
        formatFromUsd,
        currencies: CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a <CurrencyProvider>");
  }
  return ctx;
}
