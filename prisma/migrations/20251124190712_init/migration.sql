-- CreateTable
CREATE TABLE "Snack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "flavor" TEXT NOT NULL,
    "rating" INTEGER,
    "price" REAL,
    "store" TEXT,
    "upc_code" TEXT,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
