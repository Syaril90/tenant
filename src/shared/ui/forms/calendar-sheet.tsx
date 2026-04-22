import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/theme/theme-provider";
import { BottomSheet } from "@/shared/ui/forms/bottom-sheet";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type CalendarSheetProps = {
  visible: boolean;
  title: string;
  value?: string;
  onClose: () => void;
  onSelect: (label: string) => void;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarSheet({
  visible,
  title,
  value,
  onClose,
  onSelect
}: CalendarSheetProps) {
  const { theme } = useAppTheme();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(today));

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const leadingEmptyDays = (monthStart.getDay() + 6) % 7;
    const totalDays = monthEnd.getDate();
    const cells: Array<Date | null> = Array.from({ length: leadingEmptyDays }, () => null);

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [displayMonth]);

  return (
    <BottomSheet
      visible={visible}
      title={title}
      onClose={onClose}
      actionLabel="Cancel"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing[4] }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Pressable
            onPress={() =>
              setDisplayMonth(
                (currentMonth) =>
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              )
            }
            disabled={isSameMonth(displayMonth, today)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.semantic.background.muted,
              opacity: isSameMonth(displayMonth, today) ? 0.4 : 1
            }}
          >
            <Ionicons name="chevron-back" size={18} color={theme.semantic.foreground.primary} />
          </Pressable>

          <ThemedText variant="heading" size="md">
            {displayMonth.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric"
            })}
          </ThemedText>

          <Pressable
            onPress={() =>
              setDisplayMonth(
                (currentMonth) =>
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              )
            }
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.semantic.background.muted
            }}
          >
            <Ionicons name="chevron-forward" size={18} color={theme.semantic.foreground.primary} />
          </Pressable>
        </View>

        <View style={{ gap: theme.spacing[3] }}>
          <View style={{ flexDirection: "row" }}>
            {WEEKDAY_LABELS.map((label) => (
              <View key={label} style={{ flex: 1, alignItems: "center" }}>
                <ThemedText variant="label" size="sm" color="tertiary">
                  {label}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={{ gap: theme.spacing[2] }}>
            {chunk(calendarDays, 7).map((week, weekIndex) => (
              <View key={`week-${weekIndex}`} style={{ flexDirection: "row", alignItems: "center" }}>
                {week.map((date, dayIndex) => {
                  if (!date) {
                    return <View key={`empty-${weekIndex}-${dayIndex}`} style={{ flex: 1 }} />;
                  }

                  const selected = formatDateLabel(date) === value;
                  const disabled = date < today;
                  const isTodayCell = isSameDay(date, today);

                  return (
                    <View
                      key={date.toISOString()}
                      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                    >
                      <Pressable
                        disabled={disabled}
                        onPress={() => onSelect(formatDateLabel(date))}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: selected
                            ? theme.semantic.foreground.brand
                            : isTodayCell
                              ? theme.semantic.background.accent
                              : "transparent",
                          borderWidth: isTodayCell || selected ? 1 : 0,
                          borderColor: selected
                            ? theme.semantic.foreground.brand
                            : theme.semantic.border.subtle,
                          opacity: disabled ? 0.35 : 1
                        }}
                      >
                        <ThemedText color={selected ? "inverse" : "primary"}>
                          {date.getDate()}
                        </ThemedText>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function formatDateLabel(date: Date) {
  return date
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    })
    .replace(",", "");
}
