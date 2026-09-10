import { NextRequest, NextResponse } from "next/server";
import { listVehicleBrands, listVehicleModels, listVehicleYears } from "@/services/vehicle-catalog-service";

const numericCode = /^\d+$/;

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource") ?? "brands";
  const brand = request.nextUrl.searchParams.get("brand") ?? "";
  const model = request.nextUrl.searchParams.get("model") ?? "";

  try {
    if (resource === "brands") return NextResponse.json(await listVehicleBrands());
    if (resource === "models" && numericCode.test(brand)) return NextResponse.json(await listVehicleModels(brand));
    if (resource === "years" && numericCode.test(brand) && numericCode.test(model)) {
      return NextResponse.json(await listVehicleYears(brand, model));
    }
    return NextResponse.json({ error: "Parâmetros de consulta inválidos." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar os veículos agora." }, { status: 503 });
  }
}
