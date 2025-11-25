import type { Snack } from "@prisma/client";
import RatingStars from "./RatingStars";

type SnackCardProps = {
  snack: Snack;
};

export default function SnackCard({ snack }: SnackCardProps) {
  const { id, name, brand, flavor, rating, price, store, imageUrl } = snack;

  return (
    <article className="border rounded-lg p-3 flex flex-col justify-between bg-white shadow-sm">
      <div>
        {/* Image area */}
        <div className="mb-2 aspect-video w-full bg-gray-100 rounded overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            // for now just use native img, can switch to next/image later
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>

        {/* Text info */}
        <h2 className="font-medium text-sm mb-1 line-clamp-2">{name}</h2>
        <p className="text-xs text-gray-600 mb-1">
          {brand} – {flavor}
        </p>

        {store && (
          <p className="text-xs text-gray-500">
            Store: <span className="font-medium">{store}</span>
          </p>
        )}

        {typeof price === "number" && (
          <p className="text-xs text-gray-500">
            Price: <span className="font-medium">${price.toFixed(2)}</span>
          </p>
        )}
      </div>

      {/* Footer with rating controls */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <RatingStars snackId={id} initialRating={rating} />
      </div>
    </article>
  );
}
