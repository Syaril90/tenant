import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { BillingInvoice } from "@/features/bills/types/billing";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type BillingInvoiceListProps = {
  label: string;
  invoices: BillingInvoice[];
  selectedInvoiceIds: string[];
  onToggleInvoice: (invoiceId: string) => void;
};

export function BillingInvoiceList({
  label,
  invoices,
  selectedInvoiceIds,
  onToggleInvoice
}: BillingInvoiceListProps) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="md" color="tertiary">
        {label}
      </ThemedText>

      <View style={{ gap: theme.spacing[3] }}>
        {invoices.map((invoice) => {
          const selected = selectedInvoiceIds.includes(invoice.id);

          return (
            <Pressable key={invoice.id} onPress={() => onToggleInvoice(invoice.id)}>
              <SurfaceCard
                style={{
                  paddingVertical: theme.spacing[4],
                  borderWidth: 1,
                  borderColor: selected
                    ? theme.semantic.foreground.brand
                    : theme.semantic.border.soft
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing[3], flex: 1 }}>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1.5,
                        borderColor: selected
                          ? theme.semantic.foreground.brand
                          : theme.semantic.border.subtle,
                        backgroundColor: selected
                          ? theme.semantic.foreground.brand
                          : "transparent",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {selected ? (
                        <Ionicons name="checkmark" size={14} color={theme.semantic.foreground.inverse} />
                      ) : null}
                    </View>

                    <View style={{ gap: 2, flex: 1 }}>
                      <ThemedText variant="heading" size="md">
                        {invoice.title}
                      </ThemedText>
                      <ThemedText color="tertiary">{invoice.periodLabel}</ThemedText>
                    </View>
                  </View>

                  <ThemedText>{invoice.displayAmount}</ThemedText>
                </View>
              </SurfaceCard>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
