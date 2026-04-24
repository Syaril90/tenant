import type { FeedbackFieldSection } from "@/features/support/types/support";
import { TextInputField } from "@/shared/ui/forms/text-input-field";

type FeedbackDetailsFieldProps = {
  section: FeedbackFieldSection & { placeholder: string; characterLimit: number };
  value: string;
  onChangeText: (value: string) => void;
};

export function FeedbackDetailsField({
  section,
  value,
  onChangeText
}: FeedbackDetailsFieldProps) {
  return (
    <TextInputField
      label={section.title}
      placeholder={section.placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline
      maxLength={section.characterLimit}
      showCharacterCount
      required
    />
  );
}
