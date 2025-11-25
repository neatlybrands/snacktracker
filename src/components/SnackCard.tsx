import Link from "next/link";
import { Store, Star } from "lucide-react";
import type { Snack } from "@prisma/client";
import RatingStars from "./RatingStars";

type SnackCardProps = {
  snack: Snack;
};

export default function SnackCard({ snack }: SnackCardProps) {
  return (
    <article className="relative bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <Link href={`/snacks/${snack.id}`}>
        <div className="aspect-square bg-gray-100 relative">
          <img
            src={snack.imageUrl ?? "/placeholder-snack.jpg"}
            alt={snack.name}
            className="w-full h-full object-cover"
          />

          {/* gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* bottom text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
            <p className="truncate text-sm">{snack.name}</p>
            <p className="text-white/80 text-[11px] truncate">
              {snack.brand} {snack.flavor ? `• ${snack.flavor}` : ""}
            </p>
            {typeof snack.price === "number" && (
              <div className="text-green-400 text-sm mt-1">
                ${snack.price.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </Link>

      {snack.store && (
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md flex items-center gap-1">
          <Store className="w-3 h-3" />
          <span className="text-[11px] truncate max-w-[80px]">{snack.store}</span>
        </div>
      )}

      {snack.rating && snack.rating > 0 && (
        <div className="absolute top-2 right-2 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={
                "w-3.5 h-3.5 " +
                (value <= snack.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/40")
              }
            />
          ))}
        </div>
      )}

      <div className="px-2 py-2">
        <RatingStars snackId={snack.id} initialRating={snack.rating} />
      </div>
    </article>
  );
}
