import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { DocumentCategoryList } from "@/features/documents/components/document-category-list";
import { DocumentsHelpCard } from "@/features/documents/components/documents-help-card";
import { DocumentSearchInput } from "@/features/documents/components/document-search-input";
import { DocumentTable } from "@/features/documents/components/document-table";
import { useDocumentsQuery } from "@/features/documents/queries/use-documents-query";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";

export function DocumentsScreen() {
  const { theme } = useAppTheme();
  const documentsQuery = useDocumentsQuery();
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const documentsData = documentsQuery.data;

  const filteredDocuments = useMemo(() => {
    const documents = documentsData?.documents ?? [];
    const normalized = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesCategory = activeCategoryId
        ? document.categoryId === activeCategoryId
        : true;
      const matchesQuery = normalized
        ? [document.title, document.description, document.categoryLabel]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        : true;

      return matchesCategory && matchesQuery;
    });
  }, [activeCategoryId, documentsData?.documents, query]);

  if (documentsQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message="Loading documents..." />
      </Screen>
    );
  }

  if (documentsQuery.isError || !documentsQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title="Files unavailable"
          description="The documents mock request failed. Swap the service when the real document API is ready."
        />
      </Screen>
    );
  }

  const { header, searchPlaceholder, categories, repository, documents, helpCard } =
    documentsQuery.data;
  const activeCategory = categories.find((category) => category.id === activeCategoryId);
  const resultLabel = `${filteredDocuments.length} ${filteredDocuments.length === 1 ? "file" : "files"}`;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[10] }}>
          <View style={{ gap: theme.spacing[6] }}>
            <View style={{ gap: theme.spacing[3] }}>
              <ThemedText variant="label" size="sm" color="tertiary">
                {header.eyebrow}
              </ThemedText>
              <View>
                {header.titleLines.map((line) => (
                  <ThemedText key={line} variant="heading" size="xl" color="brand">
                    {line}
                  </ThemedText>
                ))}
              </View>
              <ThemedText color="secondary">{header.description}</ThemedText>
            </View>

            <SurfaceCard muted elevated={false} style={{ gap: theme.spacing[3], borderRadius: 26 }}>
              <ThemedText variant="heading" size="md">
                {activeCategory ? activeCategory.title : "All documents"}
              </ThemedText>
              <ThemedText color="secondary">
                {activeCategory ? activeCategory.description : "Use search or a category chip to narrow the list."}
              </ThemedText>
              <ThemedText variant="label" size="sm" color="brand">
                {resultLabel}
              </ThemedText>
            </SurfaceCard>

            <DocumentSearchInput
              value={query}
              placeholder={searchPlaceholder}
              onChangeText={setQuery}
            />

            <DocumentCategoryList
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
            />
          </View>

          <DocumentTable
            repository={repository}
            files={filteredDocuments}
            onClearFilter={() => {
              setActiveCategoryId(null);
              setQuery("");
            }}
          />

          <DocumentsHelpCard card={helpCard} />
        </View>
      </ScrollView>
    </Screen>
  );
}
