"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CalendarDays, Users } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (guests) params.set("guests", guests);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-left text-xs font-medium text-brand-charcoal">
            <CalendarDays className="mb-0.5 mr-1 inline size-3" />
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-brand-teal/20 bg-white"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="w-full sm:w-28">
          <label className="mb-1 block text-left text-xs font-medium text-brand-charcoal">
            <Users className="mb-0.5 mr-1 inline size-3" />
            Guests
          </label>
          <Input
            type="number"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min="1"
            max="20"
            className="border-brand-teal/20 bg-white"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="h-9 bg-brand-teal px-6 text-white hover:bg-brand-teal-600 sm:h-8"
        >
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
