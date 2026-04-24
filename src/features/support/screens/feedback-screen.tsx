import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import feedbackJson from "@/features/support/data/feedback.json";
import { pickAttachments } from "@/shared/lib/document-picker";
import { AttachmentUploader } from "@/shared/ui/forms/attachment-uploader";
import { FormNote } from "@/shared/ui/forms/form-note";
import { PrimaryButton } from "@/shared/ui/forms/primary-button";
import { FeedbackDetailsField } from "@/features/support/components/feedback-details-field";
import { FeedbackRatingSelector } from "@/features/support/components/feedback-rating-selector";
import { FeedbackTypeSelector } from "@/features/support/components/feedback-type-selector";
import { useFeedbackQuery } from "@/features/support/queries/use-feedback-query";
import { useSubmitFeedbackMutation } from "@/features/support/queries/use-submit-feedback-mutation";
import type { FeedbackAttachment, FeedbackModel } from "@/features/support/types/support";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

export function FeedbackScreen() {
  const { theme } = useAppTheme();
  const feedbackQuery = useFeedbackQuery();
  const submitFeedbackMutation = useSubmitFeedbackMutation();
  const fallbackContent = feedbackJson as FeedbackModel;

  const data = feedbackQuery.data;
  const selectedTypeDefault = useMemo(() => data?.typeSection.options[0]?.id ?? "suggestion", [data]);
  const selectedRatingDefault = useMemo(() => data?.ratingSection.options[3]?.id ?? "great", [data]);

  const [selectedTypeId, setSelectedTypeId] = useState(selectedTypeDefault);
  const [selectedRatingId, setSelectedRatingId] = useState(selectedRatingDefault);
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data?.typeSection.options.length && !data.typeSection.options.some((option) => option.id === selectedTypeId)) {
      setSelectedTypeId(selectedTypeDefault);
    }
  }, [data?.typeSection.options, selectedTypeDefault, selectedTypeId]);

  useEffect(() => {
    if (data?.ratingSection.options.length && !data.ratingSection.options.some((option) => option.id === selectedRatingId)) {
      setSelectedRatingId(selectedRatingDefault);
    }
  }, [data?.ratingSection.options, selectedRatingDefault, selectedRatingId]);

  if (feedbackQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackContent.messages.loading} />
      </Screen>
    );
  }

  if (feedbackQuery.isError || !data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={fallbackContent.messages.errorTitle}
          description={fallbackContent.messages.errorDescription}
        />
      </Screen>
    );
  }

  function handleSubmit() {
    if (!details.trim()) {
      return;
    }

    submitFeedbackMutation.mutate(
      {
        typeId: selectedTypeId,
        ratingId: selectedRatingId,
        details: details.trim(),
        attachments
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setDetails("");
          setAttachments([]);
        }
      }
    );
  }

  async function handleBrowseFiles() {
    const nextAttachments = await pickAttachments();

    setAttachments((current) => {
      const merged = [...current];

      nextAttachments.forEach((attachment) => {
        if (!merged.some((item) => item.id === attachment.id)) {
          merged.push(attachment);
        }
      });

      return merged;
    });
  }

  function handleRemoveAttachment(attachmentId: string) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {data.header.eyebrow}
            </ThemedText>
            <View>
              {data.header.titleLines.map((line, index) => (
                <ThemedText
                  key={line}
                  variant="heading"
                  size="xl"
                  color={index === data.header.titleLines.length - 1 ? "brand" : "primary"}
                >
                  {line}
                </ThemedText>
              ))}
            </View>
            <ThemedText color="secondary">{data.header.description}</ThemedText>
          </View>

          <FeedbackTypeSelector
            section={data.typeSection}
            selectedId={selectedTypeId}
            onSelect={setSelectedTypeId}
          />
          <FeedbackRatingSelector
            section={data.ratingSection}
            selectedId={selectedRatingId}
            onSelect={setSelectedRatingId}
          />
          <FeedbackDetailsField
            section={data.detailsSection}
            value={details}
            onChangeText={setDetails}
          />
          <AttachmentUploader
            label={data.uploadSection.title}
            title={data.uploadSection.description}
            description={undefined}
            buttonLabel={data.uploadSection.buttonLabel}
            iconName="camera-outline"
            attachments={attachments}
            onBrowse={handleBrowseFiles}
            onRemoveAttachment={handleRemoveAttachment}
          />

          <View style={{ gap: theme.spacing[4] }}>
            <PrimaryButton
              onPress={handleSubmit}
              disabled={!details.trim() || submitFeedbackMutation.isPending}
              label={submitFeedbackMutation.isPending ? "Submitting..." : data.cta.submitLabel}
            />

            <FormNote
              message={submitted ? data.messages.successDescription : data.cta.helperText}
              tone={submitted ? "success" : "info"}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
