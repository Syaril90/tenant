import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { tenantFlowContent } from "@/features/unit-registration/lib/tenant-flow-content";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { pickAttachments, type SharedAttachment } from "@/shared/lib/document-picker";
import { FormNote } from "@/shared/ui/forms/form-note";
import { PrimaryButton } from "@/shared/ui/forms/primary-button";
import { TextInputField } from "@/shared/ui/forms/text-input-field";
import { Screen } from "@/shared/ui/layout/screen";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type RegisterStep = 0 | 1 | 2;
type DocumentUploads = Record<string, SharedAttachment | null>;

const MOCK_RESIDENT_DIRECTORY: Record<
  string,
  {
    tenantName: string;
    propertyName: string;
    unitNumber: string;
    residentLabel: string;
  }
> = {
  "RES-A1208-2026": {
    tenantName: "Serene Heights",
    propertyName: "Tower A",
    unitNumber: "A-12-08",
    residentLabel: "Primary occupant"
  },
  "RES-B0911-2026": {
    tenantName: "Serene Heights",
    propertyName: "Tower B",
    unitNumber: "B-09-11",
    residentLabel: "Family account"
  }
};

export function RegisterTenantScreen() {
  const { theme } = useAppTheme();
  const { registerTenant, selectedTenant, tenants } = useTenant();
  const [currentStep, setCurrentStep] = useState<RegisterStep>(0);
  const [residentCode, setResidentCode] = useState("");
  const [residentCodeError, setResidentCodeError] = useState<string | undefined>();
  const [tenantName, setTenantName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [residentLabel, setResidentLabel] = useState("");
  const [documentUploads, setDocumentUploads] = useState<DocumentUploads>({});

  const content = tenantFlowContent.registerTenant;
  const isUnitDetailsDisabled = useMemo(
    () =>
      !tenantName.trim() ||
      !propertyName.trim() ||
      !unitNumber.trim() ||
      !residentLabel.trim(),
    [propertyName, residentLabel, tenantName, unitNumber]
  );
  const isSubmitDisabled =
    isUnitDetailsDisabled ||
    content.documents.requiredList.some((document) => !documentUploads[document.id]);

  useEffect(() => {
    if (selectedTenant) {
      router.replace("/(tabs)");
    }
  }, [selectedTenant]);

  function hydrateResidentProfile(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const profile = MOCK_RESIDENT_DIRECTORY[normalizedCode];

    if (!profile) {
      setResidentCodeError(
        "Resident code not recognised. Please check the code or scan the QR again."
      );
      return false;
    }

    setResidentCode(normalizedCode);
    setResidentCodeError(undefined);
    setTenantName(profile.tenantName);
    setPropertyName(profile.propertyName);
    setUnitNumber(profile.unitNumber);
    setResidentLabel(profile.residentLabel);
    setCurrentStep(1);

    return true;
  }

  function handleVerifyResidentCode() {
    if (!residentCode.trim()) {
      setResidentCodeError("Resident code is required.");
      return;
    }

    hydrateResidentProfile(residentCode);
  }

  function handleMockScanQr() {
    hydrateResidentProfile("RES-A1208-2026");
  }

  async function handleUploadDocument(documentId: string) {
    const nextAttachments = await pickAttachments();
    const nextAttachment = nextAttachments[0];

    if (!nextAttachment) {
      return;
    }

    setDocumentUploads((current) => ({
      ...current,
      [documentId]: nextAttachment
    }));
  }

  function handleSubmit() {
    if (isSubmitDisabled) {
      return;
    }

    registerTenant({
      tenantName,
      propertyName,
      unitNumber,
      residentLabel
    });
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
              {content.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {content.title}
            </ThemedText>
            <ThemedText color="secondary">{content.description}</ThemedText>
          </View>

          <View style={{ gap: theme.spacing[3] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              Registration Steps
            </ThemedText>
            <View style={{ flexDirection: "row", gap: theme.spacing[2] }}>
              {content.steps.map((step, index) => {
                const isActive = index === currentStep;
                const isComplete = index < currentStep;

                return (
                  <View
                    key={step.id}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing[2],
                      minWidth: 0,
                      paddingHorizontal: theme.spacing[3],
                      paddingVertical: theme.spacing[3],
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: isActive || isComplete
                        ? theme.semantic.foreground.brand
                        : theme.semantic.border.subtle,
                      backgroundColor: isActive
                        ? theme.semantic.background.accent
                        : theme.semantic.background.surface
                    }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isComplete || isActive
                          ? theme.semantic.foreground.brand
                          : theme.semantic.background.muted
                      }}
                    >
                      <ThemedText
                        variant="label"
                        size="sm"
                        color={isComplete || isActive ? "inverse" : "tertiary"}
                        style={{ fontSize: 10, lineHeight: 12 }}
                      >
                        {String(index + 1)}
                      </ThemedText>
                    </View>

                    <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
                      <ThemedText
                        variant="label"
                        size="sm"
                        color="tertiary"
                        style={{ fontSize: 9, lineHeight: 12 }}
                        numberOfLines={1}
                      >
                        {step.label}
                      </ThemedText>
                      <ThemedText
                        variant="heading"
                        size="md"
                        color="brand"
                        style={{ fontSize: 13, lineHeight: 16 }}
                        numberOfLines={1}
                      >
                        {step.title}
                      </ThemedText>
                    </View>

                    {isComplete ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.semantic.foreground.brand}
                      />
                    ) : null}
                  </View>
                );
              })}
            </View>
          </View>

          <SurfaceCard style={{ gap: theme.spacing[5], borderRadius: 28 }}>
            <View style={{ gap: theme.spacing[2] }}>
              <ThemedText variant="heading" size="lg" color="brand">
                {content.steps[currentStep].title}
              </ThemedText>
              <ThemedText color="secondary">
                {content.steps[currentStep].description}
              </ThemedText>
            </View>

            {currentStep === 0 ? (
              <>
                <TextInputField
                  label={content.residentCode.label}
                  placeholder={content.residentCode.placeholder}
                  value={residentCode}
                  onChangeText={(value) => {
                    setResidentCode(value.toUpperCase());
                    if (residentCodeError) {
                      setResidentCodeError(undefined);
                    }
                  }}
                  leadingIcon="qr-code-outline"
                  helperText={content.residentCode.helperText}
                  errorMessage={residentCodeError}
                  required
                />

                <View style={{ gap: theme.spacing[3] }}>
                  <PrimaryButton
                    label={content.residentCode.continueAction}
                    onPress={handleVerifyResidentCode}
                    disabled={!residentCode.trim()}
                  />
                  <Pressable
                    onPress={handleMockScanQr}
                    style={{
                      minHeight: 52,
                      borderRadius: theme.radius.md,
                      borderWidth: 1,
                      borderColor: theme.semantic.foreground.brand,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: theme.spacing[5]
                    }}
                  >
                    <ThemedText variant="label" size="md" color="brand">
                      {content.residentCode.scanAction}
                    </ThemedText>
                  </Pressable>
                </View>
              </>
            ) : null}

            {currentStep === 1 ? (
              <>
                <FormNote
                  title="Verified resident code"
                  message={residentCode}
                  iconName="shield-checkmark-outline"
                  card
                />

                <TextInputField
                  label={content.fields.tenantName.label}
                  placeholder={content.fields.tenantName.placeholder}
                  value={tenantName}
                  onChangeText={setTenantName}
                  leadingIcon="business-outline"
                  required
                />

                <TextInputField
                  label={content.fields.propertyName.label}
                  placeholder={content.fields.propertyName.placeholder}
                  value={propertyName}
                  onChangeText={setPropertyName}
                  leadingIcon="layers-outline"
                  required
                />

                <TextInputField
                  label={content.fields.unitNumber.label}
                  placeholder={content.fields.unitNumber.placeholder}
                  value={unitNumber}
                  onChangeText={setUnitNumber}
                  leadingIcon="home-outline"
                  required
                />

                <TextInputField
                  label={content.fields.residentLabel.label}
                  placeholder={content.fields.residentLabel.placeholder}
                  value={residentLabel}
                  onChangeText={setResidentLabel}
                  leadingIcon="person-outline"
                  required
                />
              </>
            ) : null}

            {currentStep === 2 ? (
              <>
                <View style={{ gap: theme.spacing[3] }}>
                  <ThemedText variant="label" size="sm" color="tertiary">
                    {content.documents.label}
                  </ThemedText>

                  {content.documents.requiredList.map((document) => {
                    const uploadedFile = documentUploads[document.id];

                    return (
                      <View
                        key={document.id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: theme.spacing[3],
                          borderRadius: theme.radius.md,
                          borderWidth: 1,
                          borderColor: theme.semantic.border.subtle,
                          backgroundColor: theme.semantic.background.muted,
                          paddingHorizontal: theme.spacing[4],
                          paddingVertical: theme.spacing[3]
                        }}
                      >
                        <View
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.semantic.background.surface
                          }}
                        >
                          <Ionicons
                            name={uploadedFile ? "document-text-outline" : "cloud-upload-outline"}
                            size={16}
                            color={theme.semantic.foreground.brand}
                          />
                        </View>

                        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                          <ThemedText variant="heading" size="md" color="brand" numberOfLines={1}>
                            {document.label}
                          </ThemedText>
                          <ThemedText
                            color={uploadedFile ? "secondary" : "tertiary"}
                            style={{ fontSize: 12, lineHeight: 16 }}
                            numberOfLines={1}
                          >
                            {uploadedFile?.name ?? document.description}
                          </ThemedText>
                        </View>

                        <Pressable
                          onPress={() => handleUploadDocument(document.id)}
                          style={{
                            minHeight: 36,
                            borderRadius: theme.radius.pill,
                            backgroundColor: theme.semantic.background.surface,
                            borderWidth: 1,
                            borderColor: theme.semantic.foreground.brand,
                            paddingHorizontal: theme.spacing[4],
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <ThemedText variant="label" size="md" color="brand">
                            {uploadedFile ? "Replace" : content.documents.buttonLabel}
                          </ThemedText>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>

                <FormNote
                  title={content.documents.helperTitle}
                  message={content.documents.helperDescription}
                  iconName="document-text-outline"
                  card
                />
              </>
            ) : null}
          </SurfaceCard>

          <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[3], borderRadius: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3] }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: theme.semantic.background.accent,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color={theme.semantic.foreground.brand}
                />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText variant="heading" size="md" color="brand">
                  {content.summaryTitle}
                </ThemedText>
                <ThemedText color="secondary">{content.summaryDescription}</ThemedText>
              </View>
            </View>
          </SurfaceCard>

          <View style={{ gap: theme.spacing[3] }}>
            {currentStep < 2 ? (
              <PrimaryButton
                label={
                  currentStep === 1 ? "Continue to documents" : content.residentCode.continueAction
                }
                onPress={() => {
                  if (currentStep === 0) {
                    handleVerifyResidentCode();
                    return;
                  }

                  if (!isUnitDetailsDisabled) {
                    setCurrentStep(2);
                  }
                }}
                disabled={currentStep === 0 ? !residentCode.trim() : isUnitDetailsDisabled}
              />
            ) : (
              <PrimaryButton
                label={content.submitLabel}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
              />
            )}

            {currentStep > 0 ? (
              <Pressable
                hitSlop={8}
                onPress={() => setCurrentStep((current) => Math.max(0, current - 1) as RegisterStep)}
                style={{ alignItems: "center", paddingVertical: theme.spacing[2] }}
              >
                <ThemedText
                  variant="label"
                  size="md"
                  color="brand"
                  style={{ letterSpacing: 0.4 }}
                >
                  Previous step
                </ThemedText>
              </Pressable>
            ) : null}

            {tenants.length > 0 ? (
              <Pressable
                hitSlop={8}
                onPress={() => router.replace("/select-tenant")}
                style={{ alignItems: "center", paddingVertical: theme.spacing[2] }}
              >
                <ThemedText
                  variant="label"
                  size="md"
                  color="brand"
                  style={{ letterSpacing: 0.4 }}
                >
                  {content.backAction}
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
