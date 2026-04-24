import { Ionicons } from "@expo/vector-icons";

import type { FeedbackFieldSection, FeedbackRatingOption } from "@/features/support/types/support";
import { ChoiceSelector } from "@/shared/ui/forms/choice-selector";

type FeedbackRatingSelectorProps = {
  section: FeedbackFieldSection & { options: FeedbackRatingOption[] };
  selectedId: string;
  onSelect: (id: string) => void;
};

export function FeedbackRatingSelector({
  section,
  selectedId,
  onSelect
}: FeedbackRatingSelectorProps) {
  return (
    <ChoiceSelector
      label={section.title}
      options={section.options.map((option) => ({
        ...option,
        icon: option.icon as keyof typeof Ionicons.glyphMap
      }))}
      selectedId={selectedId}
      onSelect={onSelect}
      variant="chip"
      columns={2}
    />
  );
}
