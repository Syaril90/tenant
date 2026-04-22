import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { DocumentCategory } from "@/features/documents/types/documents";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
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

  return (
    <View style={{ gap: theme.spacing[4] }}>
      {categories.map((category) => {
        const active = category.id === activeCategoryId;

        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(active ? null : category.id)}
          >
            <SurfaceCard
              muted={!active}
              elevated={active}
              style={{
                gap: theme.spacing[4],
                minHeight: 132,
                backgroundColor: active
                  ? theme.semantic.foreground.brand
                  : theme.semantic.background.surface
              }}
            >
              <Ionicons
                name={category.icon as IoniconName}
                size={22}
                color={active ? theme.semantic.foreground.inverse : theme.semantic.foreground.brand}
              />

              <View style={{ gap: 2 }}>
                <ThemedText
                  variant="heading"
                  size="lg"
                  color={active ? "inverse" : "primary"}
                >
                  {category.title}
                </ThemedText>
                <ThemedText color={active ? "inverse" : "tertiary"}>
                  {category.description}
                </ThemedText>
              </View>
            </SurfaceCard>
          </Pressable>
        );
      })}
    </View>
  );
}

