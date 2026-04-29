import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { tenantFlowContent } from "@/features/unit-registration/lib/tenant-flow-content";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { PrimaryButton } from "@/shared/ui/forms/primary-button";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function SelectTenantScreen() {
  const { theme } = useAppTheme();
  const { isLoading, selectTenant, selectedTenant, tenants } = useTenant();
  const [activeTenantId, setActiveTenantId] = useState<string>("");

  useEffect(() => {
    if (!activeTenantId && tenants.length > 0) {
      setActiveTenantId(tenants[0].id);
    }
  }, [activeTenantId, tenants]);

  useEffect(() => {
    if (selectedTenant) {
      router.replace("/(tabs)");
    }
  }, [selectedTenant]);

  if (isLoading) {
    return (
      <Screen headerMode="none">
        <ScreenState kind="loading" message="Loading tenant profiles..." />
      </Screen>
    );
  }

  if (tenants.length === 0) {
    return (
      <Screen headerMode="none">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingTop: theme.spacing[4],
            paddingBottom: 48
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: theme.spacing[6] }}>
            <SurfaceCard style={{ gap: theme.spacing[4], borderRadius: 28 }}>
              <View style={{ gap: theme.spacing[2] }}>
                <ThemedText variant="label" size="sm" color="tertiary">
                  {tenantFlowContent.selectTenant.eyebrow}
                </ThemedText>
                <ThemedText variant="heading" size="xl" color="brand">
                  {tenantFlowContent.selectTenant.emptyTitle}
                </ThemedText>
                <ThemedText color="secondary">
                  {tenantFlowContent.selectTenant.emptyDescription}
                </ThemedText>
              </View>

              <PrimaryButton
                label={tenantFlowContent.selectTenant.secondaryAction}
                onPress={() => router.push("/register-tenant")}
              />
            </SurfaceCard>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  function handleContinue() {
    if (!activeTenantId) {
      return;
    }

    selectTenant(activeTenantId);
  }

  return (
    <Screen headerMode="none">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: theme.spacing[4], paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {tenantFlowContent.selectTenant.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {tenantFlowContent.selectTenant.title}
            </ThemedText>
            <ThemedText color="secondary">
              {tenantFlowContent.selectTenant.description}
            </ThemedText>
          </View>

          <View style={{ gap: theme.spacing[4] }}>
            {tenants.map((tenant) => {
              const isSelected = tenant.id === activeTenantId;

              return (
                <Pressable
                  key={tenant.id}
                  onPress={() => setActiveTenantId(tenant.id)}
                >
                  <SurfaceCard
                    style={{
                      gap: theme.spacing[4],
                      borderRadius: 28,
                      borderColor: isSelected
                        ? theme.semantic.foreground.brand
                        : theme.semantic.border.subtle,
                      borderWidth: isSelected ? 2 : 1
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: theme.spacing[4]
                      }}
                    >
                      <View style={{ flex: 1, gap: theme.spacing[2] }}>
                        <ThemedText variant="heading" size="lg" color="brand">
                          {tenant.tenantName}
                        </ThemedText>
                        <ThemedText color="secondary">
                          {tenant.propertyName}
                        </ThemedText>
                      </View>

                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: isSelected
                            ? theme.semantic.foreground.brand
                            : theme.semantic.background.muted,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Ionicons
                          name={isSelected ? "checkmark" : "ellipse-outline"}
                          size={16}
                          color={
                            isSelected
                              ? theme.semantic.foreground.inverse
                              : theme.semantic.foreground.tertiary
                          }
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: theme.spacing[3]
                      }}
                    >
                      <TenantMetaPill icon="business-outline" label={tenant.propertyName} />
                      <TenantMetaPill icon="home-outline" label={tenant.unitNumber} />
                      <TenantMetaPill icon="person-outline" label={tenant.residentLabel} />
                    </View>
                  </SurfaceCard>
                </Pressable>
              );
            })}
          </View>

          <View style={{ gap: theme.spacing[3] }}>
            <PrimaryButton
              label={tenantFlowContent.selectTenant.primaryAction}
              onPress={handleContinue}
            />

            <Pressable
              hitSlop={8}
              onPress={() => router.push("/register-tenant")}
              style={{ alignItems: "center", paddingVertical: theme.spacing[2] }}
            >
              <ThemedText
                variant="label"
                size="md"
                color="brand"
                style={{ letterSpacing: 0.4 }}
              >
                {tenantFlowContent.selectTenant.secondaryAction}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function TenantMetaPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing[2],
        borderRadius: theme.radius.pill,
        backgroundColor: theme.semantic.background.muted,
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2]
      }}
    >
      <Ionicons
        name={icon}
        size={14}
        color={theme.semantic.foreground.tertiary}
      />
      <ThemedText style={{ fontSize: 12 }}>{label}</ThemedText>
    </View>
  );
}
