import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { useRequestDocumentContentQuery } from "@/features/documents/queries/use-request-document-content-query";
import { useSubmitDocumentRequestMutation } from "@/features/documents/queries/use-submit-document-request-mutation";
import type { RequestDocumentContent } from "@/features/documents/types/documents";
import { pickAttachments } from "@/shared/lib/document-picker";
import type { SharedAttachment } from "@/shared/lib/document-picker";
import { AttachmentUploader } from "@/shared/ui/forms/attachment-uploader";
import { FormNote } from "@/shared/ui/forms/form-note";
import { PickerField } from "@/shared/ui/forms/picker-field";
import { PrimaryButton } from "@/shared/ui/forms/primary-button";
import { SelectSheet } from "@/shared/ui/forms/select-sheet";
import { TextInputField } from "@/shared/ui/forms/text-input-field";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { useAppTheme } from "@/shared/theme/theme-provider";
import { SurfaceCard } from "@/shared/ui/primitives/surface-card";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import requestDocumentJson from "@/features/documents/data/request-document.json";

export function RequestDocumentScreen() {
  const { colorScheme, theme } = useAppTheme();
  const requestDocumentQuery = useRequestDocumentContentQuery();
  const submitRequestMutation = useSubmitDocumentRequestMutation();
  const fallbackContent = requestDocumentJson as RequestDocumentContent;

  const data = requestDocumentQuery.data;
  const defaultTypeId = useMemo(() => data?.typeField.options[0]?.id ?? "", [data]);
  const defaultFormatId = useMemo(() => data?.preferredFormatField.options[0]?.id ?? "", [data]);

  const [typeId, setTypeId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [preferredFormatId, setPreferredFormatId] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<SharedAttachment[]>([]);
  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [formatSheetVisible, setFormatSheetVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!typeId && defaultTypeId) {
      setTypeId(defaultTypeId);
    }
  }, [defaultTypeId, typeId]);

  useEffect(() => {
    if (!preferredFormatId && defaultFormatId) {
      setPreferredFormatId(defaultFormatId);
    }
  }, [defaultFormatId, preferredFormatId]);

  if (requestDocumentQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackContent.messages.loading} />
      </Screen>
    );
  }

  if (requestDocumentQuery.isError || !data) {
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

  const selectedType = data.typeField.options.find((option) => option.id === typeId);
  const selectedFormat = data.preferredFormatField.options.find(
    (option) => option.id === preferredFormatId
  );
  const isSubmitDisabled =
    !typeId || !purpose.trim() || !preferredFormatId || submitRequestMutation.isPending;

  async function handleBrowseAttachments() {
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

  function handleSubmit() {
    if (isSubmitDisabled) {
      return;
    }

    submitRequestMutation.mutate(
      {
        typeId,
        purpose: purpose.trim(),
        preferredFormatId,
        notes: notes.trim(),
        attachments
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setPurpose("");
          setNotes("");
          setAttachments([]);
        }
      }
    );
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
              {data.header.titleLines.map((line) => (
                <ThemedText key={line} variant="heading" size="xl" color="brand">
                  {line}
                </ThemedText>
              ))}
            </View>
            <ThemedText color="secondary">{data.header.description}</ThemedText>
          </View>

          <SurfaceCard style={{ gap: theme.spacing[5], borderRadius: 28 }}>
            <View style={{ gap: theme.spacing[1] }}>
              <ThemedText variant="heading" size="lg" color="brand">
                Request details
              </ThemedText>
              <ThemedText color="secondary">
                Fill in the core details first. Supporting notes and files are optional.
              </ThemedText>
            </View>

            <PickerField
              label={data.typeField.label}
              value={selectedType?.label ?? ""}
              placeholder={data.typeField.placeholder}
              onPress={() => setTypeSheetVisible(true)}
            />

            <TextInputField
              label={data.purposeField.label}
              placeholder={data.purposeField.placeholder}
              value={purpose}
              onChangeText={setPurpose}
              leadingIcon="briefcase-outline"
              required
            />

            <PickerField
              label={data.preferredFormatField.label}
              value={selectedFormat?.label ?? ""}
              placeholder={data.preferredFormatField.placeholder}
              onPress={() => setFormatSheetVisible(true)}
            />

            <TextInputField
              label={data.notesField.label}
              placeholder={data.notesField.placeholder}
              value={notes}
              onChangeText={setNotes}
              multiline
              helperText="Optional"
            />
          </SurfaceCard>

          <AttachmentUploader
            label={data.uploadField.label}
            title={data.uploadField.title}
            description={data.uploadField.description}
            buttonLabel={data.uploadField.buttonLabel}
            attachments={attachments}
            onBrowse={handleBrowseAttachments}
            onRemoveAttachment={(attachmentId) => {
              setAttachments((current) => current.filter((item) => item.id !== attachmentId));
            }}
          />

          <FormNote
            title={data.timelineCard.title}
            message={data.timelineCard.description}
            iconName="time-outline"
            card
          />

          {submitted ? (
            <FormNote
              title={data.messages.successTitle}
              message={data.messages.successDescription}
              tone="success"
              card
            />
          ) : null}

          <View style={{ gap: theme.spacing[3] }}>
            <PrimaryButton
              disabled={isSubmitDisabled}
              onPress={handleSubmit}
              label={submitRequestMutation.isPending ? "Submitting..." : data.cta.submitLabel}
            />
            <FormNote message={data.cta.helperText} />
          </View>
        </View>
      </ScrollView>

      <SelectSheet
        visible={typeSheetVisible}
        title={data.typeField.label}
        selectedId={typeId}
        options={data.typeField.options}
        onClose={() => setTypeSheetVisible(false)}
        onSelect={(nextId) => {
          setTypeId(nextId);
          setTypeSheetVisible(false);
        }}
      />

      <SelectSheet
        visible={formatSheetVisible}
        title={data.preferredFormatField.label}
        selectedId={preferredFormatId}
        options={data.preferredFormatField.options}
        onClose={() => setFormatSheetVisible(false)}
        onSelect={(nextId) => {
          setPreferredFormatId(nextId);
          setFormatSheetVisible(false);
        }}
      />
    </Screen>
  );
}
