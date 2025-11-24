// src/app/page.tsx
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const snacks = await prisma.snack.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">SnackTracker</h1>
      {snacks.length === 0 ? (
        <p>No snacks yet. You’re ready to add your first one.</p>
      ) : (
        <ul className="space-y-2">
          {snacks.map((snack) => (
            <li key={snack.id}>
              {snack.name} – {snack.brand} ({snack.flavor}){" "}
              {snack.rating ? `⭐️ ${snack.rating}` : "(unrated)"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
