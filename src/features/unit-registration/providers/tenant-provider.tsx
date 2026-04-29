import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/features/auth/providers/auth-provider";
import { tenantFlowContent } from "@/features/unit-registration/lib/tenant-flow-content";
import type { TenantProfile } from "@/features/unit-registration/types/tenant-flow";

const TENANT_STORAGE_KEY = "tenant_profiles";

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
        const storedProfiles = await AsyncStorage.getItem(
          `${TENANT_STORAGE_KEY}:${user.uid}`
        );
        const nextTenants = storedProfiles
          ? (JSON.parse(storedProfiles) as TenantProfile[])
          : tenantFlowContent.seedTenants;

        if (isActive) {
          setTenants(nextTenants);
        }
      } catch {
        if (isActive) {
          setTenants(tenantFlowContent.seedTenants);
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

    await AsyncStorage.setItem(
      `${TENANT_STORAGE_KEY}:${user.uid}`,
      JSON.stringify(nextTenants)
    );
  }

  function selectTenant(tenantId: string) {
    setSelectedTenantId(tenantId);
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
