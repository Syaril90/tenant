import { getAPIBaseURL } from "@/shared/lib/api-config";
import type { TenantProfile } from "@/features/unit-registration/types/tenant-flow";

type ResidentAccountAPIItem = {
  accountCode: string;
  residentCode: string;
  residentName: string;
  email: string;
  buildingCode: string;
  buildingName: string;
  areaCode: string;
  areaName: string;
  unitCode: string;
  unitName: string;
  residentRole: string;
};

type ResidentAccountAPIResponse = {
  items: ResidentAccountAPIItem[];
};

export async function getResidentAccountsByEmail(email: string): Promise<TenantProfile[]> {
  const baseURL = getAPIBaseURL();
  const response = await fetch(
    `${baseURL}/api/v1/property/resident-accounts?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error(`Resident account request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ResidentAccountAPIResponse;

  return payload.items.map((item) => ({
    id: item.accountCode,
    tenantName: item.residentName,
    propertyName: item.buildingName,
    unitNumber: item.unitCode,
    residentLabel: item.residentRole
  }));
}
