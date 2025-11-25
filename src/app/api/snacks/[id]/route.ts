import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ IMPORTANT: must await this
    const body = await req.json();
    const rating = Number(body.rating);

    if (!id || Number.isNaN(rating) || rating < 1 || rating > 3) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const snack = await prisma.snack.update({
      where: { id },
      data: { rating },
    });

    return NextResponse.json(snack);
  } catch (err) {
    console.error("Error updating snack:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
