"use client";

import { useAccount } from "wagmi";
import RulesPage from "@/src/app/rules/page";

export function Connected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) return <RulesPage />;
  return <>{children}</>;
}
