import type { Snack } from "@prisma/client";
import SnackCard from "./SnackCard";

type SnackGalleryProps = {
  snacks: Snack[];
};

export default function SnackGallery({ snacks }: SnackGalleryProps) {
  if (!snacks.length) {
    return (
      <p className="text-sm text-gray-600">
        No snacks yet. Click “Add Snack” to create your first entry.
      </p>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {snacks.map((snack) => (
          <SnackCard key={snack.id} snack={snack} />
        ))}
      </div>
    </section>
  );
}
