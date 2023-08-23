"use client";

import { useAccount } from "wagmi";
import Rules from "../tankGame/Rules";

export function Connected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) return <Rules />;
  return <>{children}</>;
}
