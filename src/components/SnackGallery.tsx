import Image from "next/image";
import type { Snack } from "@prisma/client";

type SnackGalleryProps = {
  snacks: Snack[];
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function SnackGallery({ snacks }: SnackGalleryProps) {
  if (snacks.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-8 text-center text-gray-600 bg-white/50">
        <p className="text-sm font-medium">No snacks yet.</p>
        <p className="text-sm">Use the Add Snack button to create your first entry.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {snacks.map((snack) => (
          <article
            key={snack.id}
            className="rounded-lg border bg-white shadow-sm overflow-hidden flex flex-col"
          >
            {snack.imageUrl ? (
              <div className="relative h-40">
                <Image
                  src={snack.imageUrl}
                  alt={`${snack.name} photo`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-40 bg-gray-100 text-gray-400 text-sm flex items-center justify-center">
                No photo
              </div>
            )}

            <div className="p-3 space-y-2 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{snack.brand}</p>
                  <h2 className="text-sm font-semibold leading-tight">{snack.name}</h2>
                  <p className="text-xs text-gray-600">{snack.flavor}</p>
                </div>

                {typeof snack.rating === "number" && (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                    ⭐ {snack.rating}/3
                  </span>
                )}
              </div>

              {snack.store && (
                <p className="text-xs text-gray-600">Bought at {snack.store}</p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  {typeof snack.price === "number" ? `$${snack.price.toFixed(2)}` : "Price n/a"}
                </span>
                <span>{formatDate(snack.createdAt)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
