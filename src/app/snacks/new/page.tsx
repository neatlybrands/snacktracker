// src/app/snacks/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSnackPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [flavor, setFlavor] = useState("");
  const [rating, setRating] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [store, setStore] = useState("");
  const [upcCode, setUpcCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !brand || !flavor) {
      setError("Name, brand, and flavor are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/snacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          brand,
          flavor,
          rating: rating || null,
          price: price || null,
          store,
          upcCode,
          imageUrl,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create snack");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add a New Snack</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name *
          </label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Matcha Sparkling Drink"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Brand / Manufacturer *
          </label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Ito En"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Flavor *</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            placeholder="e.g., Matcha Yuzu"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Rating (1–3)
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Not rated</option>
              <option value="1">1 – Not good</option>
              <option value="2">2 – Average</option>
              <option value="3">3 – Good</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price (optional)
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 3.99"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Store (optional)
          </label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            placeholder="e.g., Mitsuwa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            UPC Code (optional)
          </label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={upcCode}
            onChange={(e) => setUpcCode(e.target.value)}
            placeholder="e.g., 4901777391234"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (optional for now)
          </label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="e.g., https://..."
          />
          <p className="text-xs text-gray-500 mt-1">
            For MVP, you can paste a URL. We’ll wire actual uploads later.
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Snack"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded border text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
