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
import { Pencil, Trash2, Search, Star, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Tour {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  featured: boolean;
  duration: string;
  category: { id: string; name: string };
  pricing: { tier: string; season: string; price: number }[];
  _count: { bookings: number };
}

interface Category {
  id: string;
  name: string;
}

export function ToursTable({
  tours,
  categories,
  currentSearch,
  currentCategory,
}: {
  tours: Tour[];
  categories: Category[];
  currentSearch: string;
  currentCategory: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (currentCategory) params.set("category", currentCategory);
    router.push(`/admin/tours?${params.toString()}`);
  };

  const handleCategoryFilter = (value: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (value && value !== "all") params.set("category", value);
    router.push(`/admin/tours?${params.toString()}`);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/tours/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    router.refresh();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/admin/tours/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this tour?")) return;
    await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const getMinPrice = (pricing: Tour["pricing"]) => {
    if (pricing.length === 0) return "N/A";
    const min = Math.min(...pricing.map((p) => p.price));
    return `$${min.toFixed(0)}`;
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select
          value={currentCategory || "all"}
          onValueChange={handleCategoryFilter}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} variant="outline">
          Search
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tour</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tours.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                No tours found
              </TableCell>
            </TableRow>
          ) : (
            tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell className="font-medium">{tour.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{tour.category.name}</Badge>
                </TableCell>
                <TableCell>{tour.duration}</TableCell>
                <TableCell>{getMinPrice(tour.pricing)}</TableCell>
                <TableCell>{tour._count.bookings}</TableCell>
                <TableCell>
                  <Switch
                    checked={tour.active}
                    onCheckedChange={(checked) =>
                      toggleActive(tour.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={tour.featured}
                    onCheckedChange={(checked) =>
                      toggleFeatured(tour.id, checked)
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
                      <Link href={`/admin/tours/${tour.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(tour.id)}
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
