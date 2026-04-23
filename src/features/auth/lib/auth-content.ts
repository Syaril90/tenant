import authJson from "@/features/auth/data/auth.json";

type AuthContent = {
  signIn: {
    title: string;
    subtitle: string;
    createAccountPrompt: string;
    createAccountAction: string;
    helpAction: string;
    googleLabel: string;
    facebookLabel: string;
    legalLinks: string[];
  };
  accountMenu: {
    supportLabel: string;
    nightModeLabel: string;
    logoutTitle: string;
    logoutMessage: string;
    logoutAction: string;
    logoutErrorTitle: string;
  };
};

export const authContent = authJson as AuthContent;
