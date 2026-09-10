const FIPE_BASE_URL = "https://parallelum.com.br/fipe/api/v1/carros";

export type VehicleOption = { codigo: string | number; nome: string };

async function fetchFipe<T>(path: string): Promise<T> {
  const response = await fetch(`${FIPE_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!response.ok) throw new Error(`FIPE request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export async function listVehicleBrands(): Promise<VehicleOption[]> {
  return fetchFipe<VehicleOption[]>("/marcas");
}

export async function listVehicleModels(brandCode: string): Promise<VehicleOption[]> {
  const data = await fetchFipe<{ modelos: VehicleOption[] }>(`/marcas/${brandCode}/modelos`);
  return data.modelos;
}

export async function listVehicleYears(brandCode: string, modelCode: string): Promise<VehicleOption[]> {
  return fetchFipe<VehicleOption[]>(`/marcas/${brandCode}/modelos/${modelCode}/anos`);
}
