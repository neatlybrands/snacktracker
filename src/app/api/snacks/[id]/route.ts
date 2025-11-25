import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: { id: string };
};

// GET single snack (for detail page)
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const snack = await prisma.snack.findUnique({
      where: { id: params.id },
    });

    if (!snack) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(snack);
  } catch (error) {
    console.error("Error fetching snack:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PATCH to update fields (for now, rating)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { rating } = body ?? {};

    let data: { rating?: number | null } = {};

    if (rating === null) {
      data.rating = null;
    } else if (rating !== undefined) {
      const r = Number(rating);
      if (![1, 2, 3].includes(r)) {
        return new NextResponse("Rating must be 1, 2, or 3", { status: 400 });
      }
      data.rating = r;
    }

    const snack = await prisma.snack.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(snack);
  } catch (error) {
    console.error("Error updating snack:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
