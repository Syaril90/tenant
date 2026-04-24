import type { FeedbackOption, FeedbackFieldSection } from "@/features/support/types/support";
import { ChoiceSelector } from "@/shared/ui/forms/choice-selector";

type FeedbackTypeSelectorProps = {
  section: FeedbackFieldSection & { options: FeedbackOption[] };
  selectedId: string;
  onSelect: (id: string) => void;
};

export function FeedbackTypeSelector({
  section,
  selectedId,
  onSelect
}: FeedbackTypeSelectorProps) {
  return (
    <ChoiceSelector
      label={section.title}
      options={section.options}
      selectedId={selectedId}
      onSelect={onSelect}
      variant="chip"
      columns={3}
    />
  );
}
