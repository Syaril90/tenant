import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
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
import { pickAttachments } from "@/shared/lib/document-picker";
import { Screen } from "@/shared/ui/layout/screen";
import { ScreenState } from "@/shared/ui/layout/screen-state";
import { AttachmentUploader } from "@/shared/ui/forms/attachment-uploader";
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
  const complaintQuery = useComplaintFormQuery();
  const supportQuery = useSupportQuery();
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

  const supportData = supportQuery.data;
  function handleSubmit() {
    if (!title.trim() || !description.trim() || !location.trim()) {
      return;
    }

    submitComplaintMutation.mutate(
      {
        categoryId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        priorityId,
        attachments
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTitle("");
          setDescription("");
          setLocation("");
          setAttachments([]);
          setActiveTab("my-complaints");
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
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: theme.spacing[8] }}>
          <View style={{ gap: theme.spacing[2] }}>
            <ThemedText variant="label" size="sm" color="tertiary">
              {data.header.eyebrow}
            </ThemedText>
            <ThemedText variant="heading" size="xl" color="brand">
              {data.header.title}
            </ThemedText>
            <ThemedText color="secondary">{data.header.description}</ThemedText>
          </View>

          <SupportSegmentedTabs
            tabs={[...complaintTabs]}
            activeTabId={activeTab}
            onChange={(tabId) => setActiveTab(tabId as ComplaintTab)}
          />

          {activeTab === "submit-new" ? (
            <ComplaintSubmitTab
              data={data}
              categoryId={categoryId}
              onCategoryChange={setCategoryId}
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              location={location}
              onLocationChange={setLocation}
              priorityId={priorityId}
              onPriorityChange={setPriorityId}
              attachments={attachments}
              onBrowseAttachments={handleBrowseFiles}
              onRemoveAttachment={handleRemoveAttachment}
              onSubmit={handleSubmit}
              isSubmitting={submitComplaintMutation.isPending}
              submitted={submitted}
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
  submitted
}: ComplaintSubmitTabProps) {
  const { theme } = useAppTheme();
  const isSubmitDisabled =
    !title.trim() || !description.trim() || !location.trim() || isSubmitting;

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
      />

      <TextInputField
        label={data.fieldLabels.description}
        placeholder={data.placeholders.description}
        value={description}
        onChangeText={onDescriptionChange}
        multiline
      />

      <TextInputField
        label={data.fieldLabels.location}
        placeholder={data.placeholders.location}
        value={location}
        onChangeText={onLocationChange}
        leadingIcon="location-outline"
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
        <Pressable
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          style={{
            backgroundColor: theme.semantic.foreground.brand,
            borderRadius: theme.radius.md,
            paddingVertical: theme.spacing[5],
            alignItems: "center",
            opacity: isSubmitDisabled ? 0.6 : 1
          }}
        >
          <ThemedText color="inverse">
            {isSubmitting ? "Submitting..." : data.cta.submitLabel}
          </ThemedText>
        </Pressable>

        <View style={{ flexDirection: "row", gap: theme.spacing[3], alignItems: "flex-start" }}>
          <Ionicons
            name={submitted ? "checkmark-circle-outline" : "shield-checkmark-outline"}
            size={16}
            color={theme.semantic.foreground.brand}
          />
          <ThemedText color="secondary">
            {submitted
              ? data.messages.successDescription
              : "Your complaint is reviewed by the resident support team and updated in the case feed."}
          </ThemedText>
        </View>
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

      <View
        style={{
          gap: theme.spacing[3],
          backgroundColor: theme.semantic.background.surface,
          borderRadius: theme.radius.lg,
          padding: theme.spacing[6]
        }}
      >
        <ThemedText variant="heading" size="md">
          Need to report another issue?
        </ThemedText>
        <ThemedText color="secondary">
          Switch back to `Submit New` to create another complaint using the same support workflow.
        </ThemedText>
      </View>
    </View>
  );
}
