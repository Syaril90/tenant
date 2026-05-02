import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/providers/auth-provider";
import { getResidentAccountsByEmail } from "@/features/unit-registration/api/get-resident-accounts";
import { tenantFlowContent } from "@/features/unit-registration/lib/tenant-flow-content";
import {
  getSelectedTenantStorageKey,
  getTenantProfilesStorageKey
} from "@/features/unit-registration/lib/tenant-storage";
import type { TenantProfile } from "@/features/unit-registration/types/tenant-flow";

type RegisterTenantInput = Omit<TenantProfile, "id">;

type TenantContextValue = {
  isLoading: boolean;
  tenants: TenantProfile[];
  selectedTenant: TenantProfile | null;
  selectTenant: (tenantId: string) => void;
  registerTenant: (input: RegisterTenantInput) => TenantProfile;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<TenantProfile[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function hydrateTenantProfiles() {
      if (!user?.uid) {
        if (isActive) {
          setTenants([]);
          setSelectedTenantId(null);
          setIsLoading(false);
        }

        return;
      }

      setIsLoading(true);
      setSelectedTenantId(null);

      try {
        const [storedProfiles, storedSelectedTenantId] = await Promise.all([
          AsyncStorage.getItem(getTenantProfilesStorageKey(user.uid)),
          AsyncStorage.getItem(getSelectedTenantStorageKey(user.uid))
        ]);
        const localTenants = storedProfiles
          ? (JSON.parse(storedProfiles) as TenantProfile[])
          : [];
        const apiTenants = user.email ? await getResidentAccountsByEmail(user.email) : [];
        const nextTenants = mergeTenantProfiles(
          apiTenants,
          localTenants.length > 0 ? localTenants : apiTenants.length === 0 ? tenantFlowContent.seedTenants : []
        );

        if (isActive) {
          setTenants(nextTenants);
          setSelectedTenantId(
            storedSelectedTenantId &&
              nextTenants.some((tenant) => tenant.id === storedSelectedTenantId)
              ? storedSelectedTenantId
              : null
          );
        }
      } catch {
        if (isActive) {
          setTenants(tenantFlowContent.seedTenants);
          setSelectedTenantId(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    hydrateTenantProfiles();

    return () => {
      isActive = false;
    };
  }, [user?.uid]);

  async function persistTenants(nextTenants: TenantProfile[]) {
    if (!user?.uid) {
      return;
    }

    await AsyncStorage.setItem(getTenantProfilesStorageKey(user.uid), JSON.stringify(nextTenants));
  }

  async function persistSelectedTenant(tenantId: string | null) {
    if (!user?.uid) {
      return;
    }

    const key = getSelectedTenantStorageKey(user.uid);

    if (tenantId) {
      await AsyncStorage.setItem(key, tenantId);
      return;
    }

    await AsyncStorage.removeItem(key);
  }

  function selectTenant(tenantId: string) {
    setSelectedTenantId(tenantId);
    persistSelectedTenant(tenantId).catch(() => {});
  }

  function registerTenant(input: RegisterTenantInput) {
    const nextTenant: TenantProfile = {
      id: `tenant-${Date.now()}`,
      tenantName: input.tenantName.trim(),
      propertyName: input.propertyName.trim(),
      unitNumber: input.unitNumber.trim(),
      residentLabel: input.residentLabel.trim()
    };

    setTenants((current) => {
      const nextTenants = [...current, nextTenant];

      persistTenants(nextTenants).catch(() => {});

      return nextTenants;
    });
    setSelectedTenantId(nextTenant.id);
    persistSelectedTenant(nextTenant.id).catch(() => {});

    return nextTenant;
  }

  const selectedTenant =
    tenants.find((tenant) => tenant.id === selectedTenantId) ?? null;

  return (
    <TenantContext.Provider
      value={{
        isLoading,
        tenants,
        selectedTenant,
        selectTenant,
        registerTenant
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }

  return context;
}

function mergeTenantProfiles(primary: TenantProfile[], secondary: TenantProfile[]) {
  const merged = new Map<string, TenantProfile>();

  for (const tenant of [...primary, ...secondary]) {
    merged.set(tenant.id, tenant);
  }

  return Array.from(merged.values());
}
