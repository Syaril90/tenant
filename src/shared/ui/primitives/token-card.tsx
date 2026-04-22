import type { PropsWithChildren } from "react";

import { SurfaceCard } from "@/shared/ui/primitives/surface-card";

export function TokenCard({ children }: PropsWithChildren) {
  return <SurfaceCard>{children}</SurfaceCard>;
}
