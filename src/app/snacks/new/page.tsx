"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type BarcodeLookupResponse =
  | {
      found: true;
      name?: string;
      brand?: string;
      flavor?: string;
      size?: string;
      imageUrl?: string;
    }
  | {
      found: false;
    };

type FormState = {
  name: string;
  brand: string;
  flavor: string;
  rating: string;
  price: string;
  store: string;
  upcCode: string;
  imageUrl: string;
};

const initialState: FormState = {
  name: "",
  brand: "",
  flavor: "",
  rating: "",
  price: "",
  store: "",
  upcCode: "",
  imageUrl: "",
};

const ratingOptions = [
  { value: "", label: "Not rated" },
  { value: "1", label: "1 – Not good" },
  { value: "2", label: "2 – Average" },
  { value: "3", label: "3 – Good" },
];

export default function NewSnackPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialState);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);

  const requiredMissing = useMemo(() => {
    return !form.name.trim() || !form.brand.trim() || !form.flavor.trim();
  }, [form.brand, form.flavor, form.name]);

  const previewTitle = form.name || "Unnamed snack";
  const previewSubtitle = [form.brand, form.flavor].filter(Boolean).join(" · ");

  function updateField<Key extends keyof FormState>(key: Key, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const name = form.name.trim();
    const brand = form.brand.trim();
    const flavor = form.flavor.trim();
    const store = form.store.trim();
    const upcCode = form.upcCode.trim();
    const imageUrl = form.imageUrl.trim();

    if (!name || !brand || !flavor) {
      setFormError("Name, brand, and flavor are required.");
      return;
    }

    let rating: number | null = null;
    if (form.rating) {
      const parsed = Number(form.rating);
      if (![1, 2, 3].includes(parsed)) {
        setFormError("Rating must be between 1 and 3.");
        return;
      }
      rating = parsed;
    }

    let price: number | null = null;
    if (form.price.trim()) {
      const parsed = Number(form.price);
      if (Number.isNaN(parsed) || parsed < 0) {
        setFormError("Price must be a non-negative number.");
        return;
      }
      price = parsed;
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
          rating,
          price,
          store,
          upcCode,
          imageUrl,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create snack.");
      }

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      setFormError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBarcodeLookup() {
    setLookupMessage(null);

    const trimmed = form.upcCode.trim();
    if (!trimmed) {
      setLookupMessage("Enter a UPC first.");
      return;
    }

    setIsLookingUp(true);
    try {
      const res = await fetch("/api/barcode-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upc: trimmed }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Barcode lookup failed.");
      }

      const data = (await res.json()) as BarcodeLookupResponse;

      if (!data.found) {
        setLookupMessage("No product found for this UPC.");
        return;
      }

      setLookupMessage("Product found. Fields updated — adjust as needed.");
      setForm((prev) => ({
        ...prev,
        name: prev.name || data.name || "",
        brand: prev.brand || data.brand || "",
        flavor: prev.flavor || data.flavor || "",
        imageUrl: prev.imageUrl || data.imageUrl || "",
      }));
    } catch (error: unknown) {
      console.error(error);
      setLookupMessage(
        error instanceof Error ? error.message : "Error during lookup."
      );
    } finally {
      setIsLookingUp(false);
    }
  }

  return (
    <main className="min-h-screen p-4 max-w-5xl mx-auto">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Add a New Snack</h1>
          <p className="text-sm text-gray-600">
            Capture the key details, optionally pull product info from a UPC,
            and keep your snack gallery organized.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm text-blue-700 hover:underline"
        >
          ← Back to gallery
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="border rounded-lg bg-white p-4 shadow-sm space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {formError && (
              <p className="text-sm text-red-700 border border-red-200 bg-red-50 p-2 rounded">
                {formError}
              </p>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Required details</p>
                  <p className="text-xs text-gray-500">
                    Name, brand, and flavor must be provided before saving.
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {requiredMissing ? "Missing required fields" : "Looks good"}
                </span>
              </div>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Product name *</span>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g., Matcha Sparkling Drink"
                  required
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm font-medium">Brand / manufacturer *</span>
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    placeholder="e.g., Ito En"
                    required
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-sm font-medium">Flavor *</span>
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={form.flavor}
                    onChange={(e) => updateField("flavor", e.target.value)}
                    placeholder="e.g., Matcha Yuzu"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Rating (1–3)</span>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.rating}
                  onChange={(e) => updateField("rating", e.target.value)}
                >
                  {ratingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  1 = not good, 2 = average, 3 = great. You can change it later.
                </p>
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">Price (optional)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="e.g., 3.99"
                />
                <p className="text-xs text-gray-500">Enter the price you paid.</p>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Store (optional)</span>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={form.store}
                  onChange={(e) => updateField("store", e.target.value)}
                  placeholder="e.g., Mitsuwa"
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">UPC code (optional)</span>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    value={form.upcCode}
                    onChange={(e) => updateField("upcCode", e.target.value)}
                    placeholder="e.g., 4901777391234"
                  />
                  <button
                    type="button"
                    onClick={handleBarcodeLookup}
                    disabled={!form.upcCode.trim() || isLookingUp}
                    className="px-3 py-2 rounded border text-xs whitespace-nowrap disabled:opacity-60"
                  >
                    {isLookingUp ? "Looking up..." : "Lookup from UPC"}
                  </button>
                </div>
                {lookupMessage && (
                  <p className="text-xs text-gray-500">{lookupMessage}</p>
                )}
              </label>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-medium">Image URL (optional)</span>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="e.g., https://..."
              />
              <p className="text-xs text-gray-500">
                Paste an image link for now. Uploads can be added later.
              </p>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-black text-white text-sm disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save snack"}
              </button>
              <button
                type="button"
                onClick={() => setForm(initialState)}
                className="px-4 py-2 rounded border text-sm"
                disabled={isSubmitting}
              >
                Reset form
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-2 rounded border text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        <aside className="border rounded-lg bg-white p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Preview</h2>
            <span className="text-xs text-gray-500">Auto-updated</span>
          </div>

          <div className="rounded-md border bg-gray-50 overflow-hidden">
            <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt={form.name || "Snack image"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No image yet</span>
              )}
            </div>

            <div className="p-3 space-y-1">
              <p className="text-sm font-medium">{previewTitle}</p>
              {previewSubtitle && (
                <p className="text-xs text-gray-600">{previewSubtitle}</p>
              )}

              <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 pt-2">
                {form.rating && <span className="rounded bg-white px-2 py-1 border">Rating: {form.rating}</span>}
                {form.price && <span className="rounded bg-white px-2 py-1 border">${form.price}</span>}
                {form.store && <span className="rounded bg-white px-2 py-1 border">Store: {form.store}</span>}
                {form.upcCode && <span className="rounded bg-white px-2 py-1 border">UPC: {form.upcCode}</span>}
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p>
              • Save once required fields are filled. Rating, price, store, UPC,
              and image URL remain optional.
            </p>
            <p>• You can return here later to add more snacks.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
