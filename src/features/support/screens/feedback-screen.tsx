import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

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
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

export function FeedbackScreen() {
  const { theme } = useAppTheme();
  const { selectedTenant } = useTenant();
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

  const content = data;

  function handleSubmit() {
    if (!selectedTenant || !details.trim()) {
      return;
    }

    submitFeedbackMutation.mutate(
      {
        accountCode: selectedTenant?.id ?? null,
        unitCode: selectedTenant?.unitNumber ?? null,
        typeId: selectedTypeId,
        ratingId: selectedRatingId,
        details: details.trim(),
        attachments
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setSelectedTypeId(selectedTypeDefault);
          setSelectedRatingId(selectedRatingDefault);
          setDetails("");
          setAttachments([]);
          Alert.alert(content.messages.successTitle, content.messages.successDescription);
        },
        onError: (error) => {
          Alert.alert(
            content.messages.errorTitle,
            error instanceof Error ? error.message : content.messages.errorDescription
          );
        }
      }
    );
  }

  async function handleBrowseFiles() {
    if (submitted) {
      setSubmitted(false);
    }

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
    if (submitted) {
      setSubmitted(false);
    }

    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: theme.spacing[2], paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {content.header.eyebrow}
            </ThemedText>
            <View>
              {content.header.titleLines.map((line, index) => (
                <ThemedText
                  key={line}
                  variant="heading"
                  size="xl"
                  color={index === content.header.titleLines.length - 1 ? "brand" : "primary"}
                >
                  {line}
                </ThemedText>
              ))}
            </View>
            <ThemedText color="secondary">{content.header.description}</ThemedText>
          </View>

          <FeedbackTypeSelector
            section={content.typeSection}
            selectedId={selectedTypeId}
            onSelect={(value) => {
              if (submitted) {
                setSubmitted(false);
              }
              setSelectedTypeId(value);
            }}
          />
          <FeedbackRatingSelector
            section={content.ratingSection}
            selectedId={selectedRatingId}
            onSelect={(value) => {
              if (submitted) {
                setSubmitted(false);
              }
              setSelectedRatingId(value);
            }}
          />
          <FeedbackDetailsField
            section={content.detailsSection}
            value={details}
            onChangeText={(value) => {
              if (submitted) {
                setSubmitted(false);
              }
              setDetails(value);
            }}
          />
          <AttachmentUploader
            label={content.uploadSection.title}
            title={content.uploadSection.description}
            description={undefined}
            buttonLabel={content.uploadSection.buttonLabel}
            iconName="camera-outline"
            attachments={attachments}
            onBrowse={handleBrowseFiles}
            onRemoveAttachment={handleRemoveAttachment}
          />

          <View style={{ gap: theme.spacing[4] }}>
            <PrimaryButton
              onPress={handleSubmit}
              disabled={!selectedTenant || !details.trim() || submitFeedbackMutation.isPending}
              label={submitFeedbackMutation.isPending ? "Submitting..." : content.cta.submitLabel}
            />

            <FormNote
              message={
                submitted
                  ? content.messages.successDescription
                  : selectedTenant
                    ? content.cta.helperText
                    : "Select a tenant profile first before submitting feedback."
              }
              tone={submitted ? "success" : "info"}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
