import type { ComplaintPriorityOption } from "@/features/support/types/support";
import { ChoiceSelector } from "@/shared/ui/forms/choice-selector";

type ComplaintPrioritySelectorProps = {
  label: string;
  options: ComplaintPriorityOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ComplaintPrioritySelector({
  label,
  options,
  selectedId,
  onSelect
}: ComplaintPrioritySelectorProps) {
  return (
    <ChoiceSelector
      label={label}
      options={options}
      selectedId={selectedId}
      onSelect={onSelect}
      variant="chip"
      columns={3}
    />
  );
}
