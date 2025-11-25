"use client";

import { useState, useTransition } from "react";

type RatingStarsProps = {
  snackId: string;
  initialRating: number | null;
};

export default function RatingStars({ snackId, initialRating }: RatingStarsProps) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function updateRating(newRating: number | null) {
    setError(null);
    setRating(newRating); // optimistic

    startTransition(async () => {
      try {
        const res = await fetch(`/api/snacks/${snackId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: newRating }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to update rating");
        }

        const updated = await res.json();
        setRating(updated.rating ?? null);
      } catch (err: unknown) {
        console.error(err);
        setError("Error saving rating");
        // rollback by refetching value from server could be added later
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1 text-xs">
        {[1, 2, 3].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              updateRating(value === rating ? null : value)
            }
            className={`h-6 w-6 rounded-full border text-[11px] flex items-center justify-center ${
              rating && value <= rating
                ? "bg-yellow-300 border-yellow-400"
                : "bg-white border-gray-300"
            } ${isPending ? "opacity-60" : ""}`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-gray-500">
        {rating ? `Rated ${rating}/3` : "Tap to rate"}
        {isPending && " · Saving..."}
        {error && <span className="text-red-500"> · {error}</span>}
      </div>
    </div>
  );
}
