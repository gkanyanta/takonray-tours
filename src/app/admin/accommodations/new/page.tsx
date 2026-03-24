import { AccommodationForm } from "@/components/admin/accommodation-form";

export default function NewAccommodationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Accommodation
        </h1>
        <p className="text-sm text-gray-500">
          Add a new accommodation listing
        </p>
      </div>
      <AccommodationForm />
    </div>
  );
}
