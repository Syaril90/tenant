import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import complaintJson from "@/features/support/data/complaint.json";
import { ComplaintCategorySelector } from "@/features/support/components/complaint-category-selector";
import { ComplaintPrioritySelector } from "@/features/support/components/complaint-priority-selector";
import { SupportCaseList } from "@/features/support/components/support-case-list";
import { SupportSegmentedTabs } from "@/features/support/components/support-segmented-tabs";
import supportJson from "@/features/support/data/support.json";
import { useComplaintFormQuery } from "@/features/support/queries/use-complaint-form-query";
import { useSubmitComplaintMutation } from "@/features/support/queries/use-submit-complaint-mutation";
import { useSupportQuery } from "@/features/support/queries/use-support-query";
import type { ComplaintModel, FeedbackAttachment, SupportModel } from "@/features/support/types/support";
import { useTenant } from "@/features/unit-registration/providers/tenant-provider";
import { pickAttachments } from "@/shared/lib/document-picker";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { AttachmentUploader } from "@/shared/ui/forms/attachment-uploader";
import { FormNote } from "@/shared/ui/forms/form-note";
import { PrimaryButton } from "@/shared/ui/forms/primary-button";
import { TextInputField } from "@/shared/ui/forms/text-input-field";
import { ThemedText } from "@/shared/ui/primitives/themed-text";
import { useAppTheme } from "@/shared/theme/theme-provider";

type ComplaintTab = "submit-new" | "my-complaints";

const complaintTabs = [
  { id: "submit-new", label: "Submit New" },
  { id: "my-complaints", label: "My Complaints" }
] as const;

export function ComplaintScreen() {
  const { theme } = useAppTheme();
  const { selectedTenant } = useTenant();
  const complaintQuery = useComplaintFormQuery();
  const supportQuery = useSupportQuery(selectedTenant?.unitNumber ?? null);
  const submitComplaintMutation = useSubmitComplaintMutation();
  const fallbackComplaintContent = complaintJson as ComplaintModel;
  const fallbackSupportContent = supportJson as SupportModel;

  const data = complaintQuery.data;
  const defaultCategoryId = useMemo(() => data?.categories[0]?.id ?? "maintenance", [data]);
  const defaultPriorityId = useMemo(() => data?.priorities[0]?.id ?? "low", [data]);

  const [activeTab, setActiveTab] = useState<ComplaintTab>("submit-new");
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [priorityId, setPriorityId] = useState(defaultPriorityId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (data?.categories.length && !data.categories.some((option) => option.id === categoryId)) {
      setCategoryId(defaultCategoryId);
    }
  }, [categoryId, data?.categories, defaultCategoryId]);

  useEffect(() => {
    if (data?.priorities.length && !data.priorities.some((option) => option.id === priorityId)) {
      setPriorityId(defaultPriorityId);
    }
  }, [data?.priorities, defaultPriorityId, priorityId]);

  if (complaintQuery.isLoading || supportQuery.isLoading) {
    return (
      <Screen>
        <ScreenState kind="loading" message={fallbackComplaintContent.messages.loading} />
      </Screen>
    );
  }

  if (complaintQuery.isError || !data || supportQuery.isError || !supportQuery.data) {
    return (
      <Screen>
        <ScreenState
          kind="error"
          title={fallbackSupportContent.messages.errorTitle}
          description={fallbackSupportContent.messages.errorDescription}
        />
      </Screen>
    );
  }

  const content = data;
  const supportData = supportQuery.data;
  function handleSubmit() {
    if (!selectedTenant || !title.trim() || !description.trim() || !location.trim()) {
      return;
    }

    submitComplaintMutation.mutate(
      {
        accountId: selectedTenant?.id ?? "",
        unitCode: selectedTenant?.unitNumber ?? "",
        categoryId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        priorityId,
        attachments
      },
      {
        onSuccess: (result) => {
          setSubmitted(true);
          setTitle("");
          setDescription("");
          setLocation("");
          setAttachments([]);
          setActiveTab("my-complaints");
          Alert.alert(
            content.messages.successTitle,
            `${content.messages.successDescription}\n\nReference: ${result.reference}`
          );
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
            <ThemedText variant="heading" size="xl" color="brand">
              {content.header.title}
            </ThemedText>
            <ThemedText color="secondary">{content.header.description}</ThemedText>
          </View>

          <SupportSegmentedTabs
            tabs={[...complaintTabs]}
            activeTabId={activeTab}
            onChange={(tabId) => setActiveTab(tabId as ComplaintTab)}
          />

          {activeTab === "submit-new" ? (
            <ComplaintSubmitTab
              data={content}
              categoryId={categoryId}
              onCategoryChange={(value) => {
                if (submitted) {
                  setSubmitted(false);
                }
                setCategoryId(value);
              }}
              title={title}
              onTitleChange={(value) => {
                if (submitted) {
                  setSubmitted(false);
                }
                setTitle(value);
              }}
              description={description}
              onDescriptionChange={(value) => {
                if (submitted) {
                  setSubmitted(false);
                }
                setDescription(value);
              }}
              location={location}
              onLocationChange={(value) => {
                if (submitted) {
                  setSubmitted(false);
                }
                setLocation(value);
              }}
              priorityId={priorityId}
              onPriorityChange={(value) => {
                if (submitted) {
                  setSubmitted(false);
                }
                setPriorityId(value);
              }}
              attachments={attachments}
              onBrowseAttachments={handleBrowseFiles}
              onRemoveAttachment={handleRemoveAttachment}
              onSubmit={handleSubmit}
              isSubmitting={submitComplaintMutation.isPending}
              submitted={submitted}
              hasSelectedTenant={Boolean(selectedTenant)}
            />
          ) : (
            <ComplaintCasesTab
              cases={supportData.cases}
              onSelectCase={(caseId) => {
                router.push(`/support-complaints/${caseId}`);
              }}
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

type ComplaintSubmitTabProps = {
  data: ComplaintModel;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  priorityId: string;
  onPriorityChange: (id: string) => void;
  attachments: FeedbackAttachment[];
  onBrowseAttachments: () => void;
  onRemoveAttachment: (attachmentId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitted: boolean;
  hasSelectedTenant: boolean;
};

function ComplaintSubmitTab({
  data,
  categoryId,
  onCategoryChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  priorityId,
  onPriorityChange,
  attachments,
  onBrowseAttachments,
  onRemoveAttachment,
  onSubmit,
  isSubmitting,
  submitted,
  hasSelectedTenant
}: ComplaintSubmitTabProps) {
  const { theme } = useAppTheme();
  const isSubmitDisabled =
    !hasSelectedTenant || !title.trim() || !description.trim() || !location.trim() || isSubmitting;

  return (
    <View style={{ gap: theme.spacing[6] }}>
      <ComplaintCategorySelector
        label={data.fieldLabels.category}
        options={data.categories}
        selectedId={categoryId}
        onSelect={onCategoryChange}
      />

      <TextInputField
        label={data.fieldLabels.title}
        placeholder={data.placeholders.title}
        value={title}
        onChangeText={onTitleChange}
        required
      />

      <TextInputField
        label={data.fieldLabels.description}
        placeholder={data.placeholders.description}
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        required
      />

      <TextInputField
        label={data.fieldLabels.location}
        placeholder={data.placeholders.location}
        value={location}
        onChangeText={onLocationChange}
        leadingIcon="location-outline"
        required
      />

      <ComplaintPrioritySelector
        label={data.fieldLabels.priority}
        options={data.priorities}
        selectedId={priorityId}
        onSelect={onPriorityChange}
      />

      <AttachmentUploader
        label={data.uploadCard.title}
        title={data.uploadCard.description}
        description={data.uploadCard.helperText}
        buttonLabel={data.uploadCard.buttonLabel}
        iconName="videocam-outline"
        attachments={attachments}
        onBrowse={onBrowseAttachments}
        onRemoveAttachment={onRemoveAttachment}
      />

      <View style={{ gap: theme.spacing[4] }}>
        <PrimaryButton
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          label={isSubmitting ? "Submitting..." : data.cta.submitLabel}
        />

        <FormNote
          message={
            submitted
              ? data.messages.successDescription
              : hasSelectedTenant
                ? "Your complaint is reviewed by the resident support team and updated in the case feed."
                : "Select a tenant profile first before submitting a complaint."
          }
          tone={submitted ? "success" : "info"}
        />
      </View>
    </View>
  );
}

function ComplaintCasesTab({
  cases,
  onSelectCase
}: {
  cases: SupportModel["cases"];
  onSelectCase: (caseId: string) => void;
}) {
  const { theme } = useAppTheme();

  return (
    <View style={{ gap: theme.spacing[6] }}>
      <View style={{ gap: theme.spacing[2] }}>
        <ThemedText variant="heading" size="lg" color="brand">
          Track your cases
        </ThemedText>
        <ThemedText color="secondary">
          Open a case to review its latest status, attachments, and support notes.
        </ThemedText>
      </View>

      <SupportCaseList
        section={{ ...cases, title: cases.title || "YOUR CASES" }}
        onSelectCase={onSelectCase}
      />

      <FormNote
        title="Need to report another issue?"
        message="Switch back to `Submit New` to create another complaint using the same support workflow."
        card
      />
    </View>
  );
}
