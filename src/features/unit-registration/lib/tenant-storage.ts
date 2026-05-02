const TENANT_STORAGE_KEY = "tenant_profiles";
const SELECTED_TENANT_STORAGE_KEY = "selected_tenant_id";

export function getTenantProfilesStorageKey(userId: string) {
  return `${TENANT_STORAGE_KEY}:${userId}`;
}

export function getSelectedTenantStorageKey(userId: string) {
  return `${SELECTED_TENANT_STORAGE_KEY}:${userId}`;
}
