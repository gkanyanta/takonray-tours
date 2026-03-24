"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Trash2,
  GripVertical,
  Pencil,
  Plus,
  Loader2,
} from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  category: string | null;
  order: number;
}

const CATEGORIES = [
  "Victoria Falls",
  "Safari",
  "Accommodation",
  "Activities",
  "Culture",
  "Food",
  "Other",
];

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setEditCaption(image.caption ?? "");
    setEditCategory(image.category ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingImage) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/gallery/${editingImage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: editCaption,
          category: editCategory,
        }),
      });
      setEditingImage(null);
      router.refresh();
    } catch {
      alert("Failed to update image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">
              Drag and drop images or click to upload
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG up to 5MB each. Cloudinary integration ready.
            </p>
            <Button variant="outline" className="mt-3">
              <Plus className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            No images in the gallery yet
          </div>
        ) : (
          images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border bg-white"
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.caption ?? "Gallery image"}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(image)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <div className="cursor-grab" title="Drag to reorder">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Caption */}
              <div className="p-2">
                <p className="truncate text-xs font-medium">
                  {image.caption || "No caption"}
                </p>
                {image.category && (
                  <p className="text-xs text-gray-400">{image.category}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingImage}
        onOpenChange={(open) => !open && setEditingImage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingImage && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={editingImage.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Image caption"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingImage(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
