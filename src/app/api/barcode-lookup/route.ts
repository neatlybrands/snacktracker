import { NextResponse } from "next/server";

type BarcodeLookupRequest = {
  upc: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BarcodeLookupRequest | null;
    const upc = body?.upc?.trim();

    if (!upc) {
      return new NextResponse("Missing UPC", { status: 400 });
    }

    // 🔧 MVP: stubbed lookup so the flow works immediately
    // Later: replace this block with a real UPC API call.
    //
    // Example approach (pseudo):
    // const res = await fetch(`https://api.example.com/lookup?upc=${upc}`, { headers: { 'X-API-Key': process.env.UPC_API_KEY! } });
    // const json = await res.json();
    // map json -> { found, name, brand, flavor, size, imageUrl }

    // Simple stubbed responses for testing the flow:
    if (upc === "4901777391234") {
      // Example matcha drink
      return NextResponse.json({
        found: true,
        name: "Matcha Sparkling Drink",
        brand: "Ito En",
        flavor: "Matcha Yuzu",
        size: "350ml",
        imageUrl: "https://via.placeholder.com/400x225?text=Matcha+Sparkling",
      });
    }

    if (upc === "9999999999999") {
      // Another fake example
      return NextResponse.json({
        found: true,
        name: "Strawberry Milk Soda",
        brand: "Calpico",
        flavor: "Strawberry",
        size: "500ml",
        imageUrl: "https://via.placeholder.com/400x225?text=Strawberry+Soda",
      });
    }

    // Default: not found
    return NextResponse.json({
      found: false,
    });
  } catch (error) {
    console.error("Error in barcode lookup:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
