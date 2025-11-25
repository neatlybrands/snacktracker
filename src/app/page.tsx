import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SnackGallery from "@/components/SnackGallery";

export default async function HomePage() {
  const snacks = await prisma.snack.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-4 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">SnackTracker</h1>
          <p className="text-sm text-gray-500">
            Your visual log of snacks and drinks you&apos;ve tried.
          </p>
        </div>

        <Link
          href="/snacks/new"
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          Add Snack
        </Link>
      </header>

      <SnackGallery snacks={snacks} />
    </main>
  );
}
