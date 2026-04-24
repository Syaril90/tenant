import { Ionicons } from "@expo/vector-icons";

import type { ComplaintCategoryOption } from "@/features/support/types/support";
import { ChoiceSelector } from "@/shared/ui/forms/choice-selector";

type ComplaintCategorySelectorProps = {
  label: string;
  options: ComplaintCategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  maintenance: "construct-outline",
  cleanliness: "brush-outline",
  security: "shield-checkmark-outline",
  billing: "card-outline",
  facilities: "snow-outline",
  noise: "volume-high-outline",
  other: "ellipsis-horizontal"
};

export function ComplaintCategorySelector({
  label,
  options,
  selectedId,
  onSelect
}: ComplaintCategorySelectorProps) {
  return (
    <ChoiceSelector
      label={label}
      options={options.map((option) => ({
        ...option,
        icon: categoryIcons[option.id] ?? "grid-outline"
      }))}
      selectedId={selectedId}
      onSelect={onSelect}
      variant="tile"
      columns={2}
    />
  );
}
