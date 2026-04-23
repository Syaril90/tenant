import appIdentityJson from "@/shared/config/app-identity.json";

type AppIdentity = {
  name: string;
  headerName: string;
  brandLines: string[];
  footerName: string;
  copyrightLine: string;
};

export const appIdentity = appIdentityJson as AppIdentity;
