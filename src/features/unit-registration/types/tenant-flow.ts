export type TenantProfile = {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  residentLabel: string;
};

export type TenantFlowContent = {
  seedTenants: TenantProfile[];
  selectTenant: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  registerTenant: {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    backAction: string;
    summaryTitle: string;
    summaryDescription: string;
    steps: Array<{
      id: string;
      label: string;
      title: string;
      description: string;
    }>;
    residentCode: {
      label: string;
      placeholder: string;
      helperText: string;
      scanAction: string;
      continueAction: string;
    };
    documents: {
      label: string;
      title: string;
      description: string;
      buttonLabel: string;
      helperTitle: string;
      helperDescription: string;
      requiredList: Array<{
        id: string;
        label: string;
        description: string;
      }>;
    };
    fields: {
      tenantName: {
        label: string;
        placeholder: string;
      };
      propertyName: {
        label: string;
        placeholder: string;
      };
      unitNumber: {
        label: string;
        placeholder: string;
      };
      residentLabel: {
        label: string;
        placeholder: string;
      };
    };
  };
};
