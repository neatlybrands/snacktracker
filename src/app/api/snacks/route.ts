// src/app/api/snacks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const snacks = await prisma.snack.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(snacks);
  } catch (error) {
    console.error("Error fetching snacks:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, brand, flavor, rating, price, store, upcCode, imageUrl } =
      body ?? {};

    // Basic validation for required fields
    if (!name || !brand || !flavor) {
      return new NextResponse(
        "Missing required fields: name, brand, flavor",
        { status: 400 }
      );
    }

    // Optional rating validation
    let parsedRating: number | null = null;
    if (rating !== undefined && rating !== null && rating !== "") {
      const r = Number(rating);
      if (![1, 2, 3].includes(r)) {
        return new NextResponse("Rating must be 1, 2, or 3", { status: 400 });
      }
      parsedRating = r;
    }

    const parsedPrice =
      price !== undefined && price !== null && price !== ""
        ? Number(price)
        : null;

    const snack = await prisma.snack.create({
      data: {
        name,
        brand,
        flavor,
        rating: parsedRating,
        price: parsedPrice ?? undefined,
        store: store || undefined,
        upcCode: upcCode || undefined,
        imageUrl: imageUrl || undefined,
      },
    });

    return NextResponse.json(snack, { status: 201 });
  } catch (error) {
    console.error("Error creating snack:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
