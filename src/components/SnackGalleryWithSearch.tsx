"use client";

import { useMemo, useState } from "react";
import type { Snack } from "@prisma/client";
import SnackGallery from "./SnackGallery";

type SnackGalleryWithSearchProps = {
  snacks: Snack[];
};

export default function SnackGalleryWithSearch({
  snacks,
}: SnackGalleryWithSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return snacks;

    const q = query.toLowerCase();

    return snacks.filter((snack) => {
      const fields = [
        snack.name,
        snack.brand,
        snack.flavor,
        snack.store ?? "",
      ];

      return fields.some((value) =>
        value.toLowerCase().includes(q)
      );
    });
  }, [query, snacks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, brand, flavor, or store..."
          className="w-full border rounded px-3 py-2 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-xs text-gray-500 underline"
          >
            Clear
          </button>
        )}
      </div>

      <SnackGallery snacks={filtered} />
    </div>
  );
}
