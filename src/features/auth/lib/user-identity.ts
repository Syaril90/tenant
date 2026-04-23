import type { User } from "firebase/auth";

export type CurrentUserIdentity = {
  avatarUrl: string | null;
  displayName: string;
  firstName: string;
  initials: string;
  secondaryLabel: string;
};

export function getUserIdentity(user: User | null): CurrentUserIdentity {
  const rawDisplayName = user?.displayName?.trim();
  const rawEmail = user?.email?.trim();
  const displayName = rawDisplayName || rawEmail?.split("@")[0] || "Resident";
  const firstName = displayName.split(" ")[0] || displayName;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    avatarUrl: user?.photoURL?.trim() || null,
    displayName,
    firstName,
    initials: initials || "R",
    secondaryLabel: rawEmail || "Signed in resident"
  };
}
