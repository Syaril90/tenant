import { useEffect } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/core/config/query";
import { confirmBillplzPayment } from "@/features/bills/api/confirm-billplz-payment";
import type { PaymentRouteParams } from "@/features/bills/types/payment-success";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";

export function PaymentReturnScreen() {
  const { theme } = useAppTheme();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<
    PaymentRouteParams & {
      "billplz[id]"?: string;
      "billplz[paid]"?: string;
      "billplz[paid_at]"?: string;
      "billplz[x_signature]"?: string;
      "billplz[transaction_id]"?: string;
      "billplz[transaction_status]"?: string;
      methodId?: string;
    }
  >();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const billId = readQueryValue(params["billplz[id]"]);
      const paid = readQueryValue(params["billplz[paid]"]);
      const paidAt = readQueryValue(params["billplz[paid_at]"]);
      const xSignature = readQueryValue(params["billplz[x_signature]"]);
      const transactionId = readQueryValue(params["billplz[transaction_id]"]);
      const transactionStatus = readQueryValue(params["billplz[transaction_status]"]);
      const unitCode = readQueryValue(params.unitCode);
      const methodLabel = readQueryValue(params.methodLabel) ?? readQueryValue(params.methodId) ?? "-";

      if (!billId) {
        router.replace({
          pathname: "/payment-failed",
          params: {
            amount: readQueryValue(params.amount) ?? "-",
            paymentId: "-",
            paidAt: "-",
            status: "Failed",
            methodLabel,
            unitCode: unitCode ?? ""
          }
        });
        return;
      }

      try {
        const confirmation = await confirmBillplzPayment({
          billId,
          paid,
          paidAt,
          xSignature,
          transactionId,
          transactionStatus,
        });

        if (cancelled) {
          return;
        }

        if (unitCode) {
          queryClient.invalidateQueries({ queryKey: [...queryKeys.bills, unitCode] });
          queryClient.invalidateQueries({ queryKey: [...queryKeys.paymentHistory, unitCode] });
        }

        const nextParams = {
          amount: readQueryValue(params.amount) ?? "-",
          paymentId: confirmation.paymentReference || confirmation.reference || confirmation.billId,
          paidAt: confirmation.paidAt || paidAt || "-",
          status: confirmation.outcome === "success" ? "Successful" : "Failed",
          methodLabel,
          unitCode: confirmation.unitCode || unitCode || ""
        };

        router.replace(
          confirmation.outcome === "success"
            ? {
                pathname: "/payment-success",
                params: nextParams
              }
            : {
                pathname: "/payment-failed",
                params: nextParams
              }
        );
      } catch {
        if (cancelled) {
          return;
        }

        router.replace({
          pathname: "/payment-failed",
          params: {
            amount: readQueryValue(params.amount) ?? "-",
            paymentId: billId,
            paidAt: paidAt || "-",
            status: "Failed",
            methodLabel,
            unitCode: unitCode ?? ""
          }
        });
      }
    }

    run().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [params, queryClient]);

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ScreenState kind="loading" message="Confirming payment with the server..." />
      </View>
    </Screen>
  );
}

function readQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
