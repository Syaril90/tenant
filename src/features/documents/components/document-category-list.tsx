import type { ComponentProps } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { DocumentCategory } from "@/features/documents/types/documents";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DocumentCategoryListProps = {
  categories: DocumentCategory[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function DocumentCategoryList({
  categories,
  activeCategoryId,
  onSelectCategory
}: DocumentCategoryListProps) {
  const { theme } = useAppTheme();
  const allSelected = activeCategoryId === null;

  return (
    <View style={{ gap: theme.spacing[4] }}>
      <ThemedText variant="label" size="sm" color="tertiary">
        FILTER BY CATEGORY
      </ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing[3] }}>
        <CategoryChip
          label="All"
          icon="grid-outline"
          active={allSelected}
          onPress={() => onSelectCategory(null)}
        />

        {categories.map((category) => {
          const active = category.id === activeCategoryId;

          return (
            <CategoryChip
              key={category.id}
              label={category.title}
              icon={category.icon as IoniconName}
              active={active}
              onPress={() => onSelectCategory(active ? null : category.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function CategoryChip({
  label,
  icon,
  active,
  onPress
}: {
  label: string;
  icon: IoniconName;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          minHeight: 44,
          borderRadius: theme.radius.pill,
          paddingLeft: theme.spacing[3],
          paddingRight: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing[2],
          backgroundColor: active ? theme.semantic.foreground.brand : theme.semantic.background.surface,
          borderWidth: 1,
          borderColor: active ? theme.semantic.foreground.brand : theme.semantic.border.subtle
        }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: active ? "rgba(255,255,255,0.16)" : theme.semantic.background.accent
          }}
        >
          <Ionicons
            name={icon}
            size={14}
            color={active ? theme.semantic.foreground.inverse : theme.semantic.foreground.brand}
          />
        </View>

        <ThemedText
          variant="label"
          size="sm"
          color={active ? "inverse" : "secondary"}
          style={{ lineHeight: 16 }}
        >
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}
