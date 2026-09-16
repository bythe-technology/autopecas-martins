import { NextRequest, NextResponse } from "next/server";
import { getPublicCatalogPage } from "@/lib/catalog-db";

const PAGE_SIZE = 24;

function safeText(value: string | null, maxLength = 80) {
  return value?.trim().slice(0, maxLength) || undefined;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const rawOffset = Number(params.get("offset") ?? 0);
  const offset = Number.isSafeInteger(rawOffset) ? Math.min(Math.max(rawOffset, 0), 10_000) : 0;
  const year = params.get("ano");
  const page = await getPublicCatalogPage({
    limit: PAGE_SIZE,
    offset,
    make: safeText(params.get("marca"), 50),
    model: safeText(params.get("modelo"), 50),
    year: year && /^\d{4}$/.test(year) ? year : undefined,
    query: safeText(params.get("busca")),
    vehicleQuery: safeText(params.get("veiculo")),
    category: safeText(params.get("categoria"), 50),
  });

  return NextResponse.json(page, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
