"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Search, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Accommodation {
  id: string;
  name: string;
  type: string;
  rating: number | null;
  active: boolean;
  featured: boolean;
  roomTypes: { id: string }[];
  _count: { bookings: number; reviews: number };
}

const TYPES = ["HOTEL", "LODGE", "GUESTHOUSE", "CAMPSITE", "HOSTEL", "VILLA"];

export function AccommodationsTable({
  accommodations,
  currentSearch,
  currentType,
}: {
  accommodations: Accommodation[];
  currentSearch: string;
  currentType: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (currentType) params.set("type", currentType);
    router.push(`/admin/accommodations?${params.toString()}`);
  };

  const handleTypeFilter = (value: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (value && value !== "all") params.set("type", value);
    router.push(`/admin/accommodations?${params.toString()}`);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/accommodations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this accommodation?"))
      return;
    await fetch(`/api/admin/accommodations/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search accommodations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select value={currentType || "all"} onValueChange={handleTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accommodations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                No accommodations found
              </TableCell>
            </TableRow>
          ) : (
            accommodations.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell className="font-medium">{acc.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{acc.type}</Badge>
                </TableCell>
                <TableCell>
                  {acc.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{acc.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>{acc.roomTypes.length}</TableCell>
                <TableCell>{acc._count.bookings}</TableCell>
                <TableCell>
                  <Switch
                    checked={acc.active}
                    onCheckedChange={(checked) =>
                      toggleActive(acc.id, checked)
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Link href={`/admin/accommodations/${acc.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(acc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
