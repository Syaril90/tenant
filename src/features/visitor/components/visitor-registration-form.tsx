import { useState } from "react";
import { View } from "react-native";

import type { VisitorFormContent } from "@/features/visitor/types/visitor";
import { CalendarSheet } from "@/shared/ui/forms/calendar-sheet";
import { PickerField } from "@/shared/ui/forms/picker-field";
import { PrimaryButton } from "@/shared/ui/forms/primary-button";
import { TextInputField } from "@/shared/ui/forms/text-input-field";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type VisitorRegistrationFormProps = {
  form: VisitorFormContent;
  loading?: boolean;
  onSubmit: (values: {
    name: string;
    purpose: string;
    dateLabel: string;
    vehicleLabel: string;
  }) => void;
};

export function VisitorRegistrationForm({
  form,
  loading = false,
  onSubmit
}: VisitorRegistrationFormProps) {
  const { theme } = useAppTheme();
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [vehicleLabel, setVehicleLabel] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const isSubmitDisabled = !name.trim() || !purpose.trim() || !dateLabel.trim() || loading;

  function handleSubmit() {
    if (!name.trim() || !purpose.trim() || !dateLabel.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      purpose: purpose.trim(),
      dateLabel: dateLabel.trim(),
      vehicleLabel: vehicleLabel.trim()
    });

    setName("");
    setPurpose("");
    setDateLabel("");
    setVehicleLabel("");
  }

  return (
    <SurfaceCard style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="heading" size="lg">
        {form.title}
      </ThemedText>

      <TextInputField
        label={form.fields.nameLabel}
        placeholder={form.fields.namePlaceholder}
        value={name}
        onChangeText={setName}
        required
      />
      <TextInputField
        label={form.fields.purposeLabel}
        placeholder={form.fields.purposePlaceholder}
        value={purpose}
        onChangeText={setPurpose}
        required
      />
      <PickerField
        label={form.fields.dateLabel}
        placeholder={form.fields.datePlaceholder}
        value={dateLabel}
        onPress={() => setDatePickerVisible(true)}
        iconName="calendar-outline"
      />
      <TextInputField
        label={form.fields.vehicleLabel}
        placeholder={form.fields.vehiclePlaceholder}
        value={vehicleLabel}
        onChangeText={setVehicleLabel}
        helperText="Optional"
      />

      <PrimaryButton
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
        label={loading ? "Registering..." : form.submitLabel}
      />

      <CalendarSheet
        visible={datePickerVisible}
        title={form.fields.datePickerTitle}
        value={dateLabel}
        onClose={() => setDatePickerVisible(false)}
        onSelect={(nextValue) => {
          setDateLabel(nextValue);
          setDatePickerVisible(false);
        }}
      />
    </SurfaceCard>
  );
}
