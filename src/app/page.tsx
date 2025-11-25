import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const snacks = await prisma.snack.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">SnackTracker</h1>
        <Link
          href="/snacks/new"
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          Add Snack
        </Link>
      </header>

      {snacks.length === 0 ? (
        <p>No snacks yet. Click “Add Snack” to create your first entry.</p>
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {snacks.map((snack) => (
              <article
                key={snack.id}
                className="border rounded-lg p-3 flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-medium text-sm mb-1">{snack.name}</h2>
                  <p className="text-xs text-gray-600 mb-1">
                    {snack.brand} – {snack.flavor}
                  </p>
                  {snack.store && (
                    <p className="text-xs text-gray-500">
                      Store: {snack.store}
                    </p>
                  )}
                  {typeof snack.price === "number" && (
                    <p className="text-xs text-gray-500">
                      Price: ${snack.price.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {snack.rating ? `⭐ ${snack.rating}/3` : "Not rated"}
                  </div>
                  {/* detail page will come later */}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
