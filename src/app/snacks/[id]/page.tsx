import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RatingStars from "@/components/RatingStars";

type SnackParams = {
  id: string;
};

export default async function SnackDetailPage({
  params,
}: {
  params: Promise<SnackParams>;
}) {
  // 👇 Next 16: params is a Promise, so we await it
  const { id } = await params;

  const snack = await prisma.snack.findUnique({
    where: { id },
  });

  if (!snack) {
    notFound();
  }

  return (
    <main className="min-h-screen p-4 max-w-xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Snack Detail</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to gallery
        </Link>
      </header>

      <section className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="mb-3 aspect-video w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
          {snack.imageUrl ? (
            <img
              src={snack.imageUrl}
              alt={snack.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>

        <h2 className="text-lg font-medium mb-1">{snack.name}</h2>
        <p className="text-sm text-gray-600 mb-1">
          {snack.brand} – {snack.flavor}
        </p>

        {snack.store && (
          <p className="text-sm text-gray-500">
            Store: <span className="font-medium">{snack.store}</span>
          </p>
        )}
        {typeof snack.price === "number" && (
          <p className="text-sm text-gray-500">
            Price: <span className="font-medium">${snack.price.toFixed(2)}</span>
          </p>
        )}
        {snack.upcCode && (
          <p className="text-sm text-gray-500">
            UPC: <span className="font-mono text-xs">{snack.upcCode}</span>
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <RatingStars snackId={snack.id} initialRating={snack.rating} />
        </div>
      </section>
    </main>
  );
}
